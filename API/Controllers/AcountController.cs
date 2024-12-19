using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Text;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using CloudinaryDotNet.Actions;
using Domain;
using Infrastructure.Email;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.WebUtilities;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Caching.Memory;
using Microsoft.Extensions.Logging;

namespace API.Controllers
{
    
    [ApiController]
    [Route("api/[controller]")]
    public class AccountController : ControllerBase
    {
        
        public UserManager<AppUser> _userManager;
        private TokenService _tokenService;
        // private SignInManager<AppUser> _signInManager;
        private readonly SignInManager<AppUser> _signInManager;
        private readonly EmailSender _emailSender;

        public AccountController(UserManager<AppUser> userManager, SignInManager<AppUser> signInManager, TokenService tokenService,
             EmailSender emailSender)
        {
            _emailSender = emailSender;
            _signInManager = signInManager;
            _tokenService = tokenService;
            _userManager = userManager;
            
        }

        [AllowAnonymous]
        [HttpPost("login")]
        public async Task<ActionResult<UserDto>> Login(LoginDto loginDto)
        {
            var user = await _userManager.Users
                    .Include(x => x.Photos)
                    .Include(r => r.RefreshTokens)
                    .FirstOrDefaultAsync(x => x.Email ==loginDto.Email);

            if (user == null)
            {
                return Unauthorized("Invalid Email");
            }

            if (user.UserName == "bob") user.EmailConfirmed = true;

            if (!user.EmailConfirmed) return Unauthorized("Your email is not confirmed");

            var result = await _signInManager.CheckPasswordSignInAsync(user, loginDto.Password, false);

            if (result.Succeeded)
            {
                await SetRefreshToken(user);
                return CreateUserObject(user);
            }

            return Unauthorized("Invalid Password");
        }

        [AllowAnonymous]
        [HttpPost("register")]
        public async Task<ActionResult<UserDto>> Register(RegisterDto registerDto)
        {
            if (await _userManager.Users.AnyAsync(x => x.UserName == registerDto.Username))
            {

                ModelState.AddModelError("username", "User name is already taken");
                return ValidationProblem(); //BadRequest(ModelState);
            }

            if (await _userManager.Users.AnyAsync(x => x.Email == registerDto.Email))
            {
                ModelState.AddModelError("email", "Email is already taken");
                return ValidationProblem();// BadRequest(ModelState);
            }

            var user = new AppUser
            {
                DisplayName = registerDto.DisplayName,
                Email = registerDto.Email,
                UserName = registerDto.Username
            };

            var result = await _userManager.CreateAsync(user, registerDto.Password);

            if (!result.Succeeded) return BadRequest("Problem registering user");

            var origin = Request.Headers["origin"];
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));

            var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
            var message = $"<p>Please click the below link to verify your email address:</p>";
            message += $"<p><a href='{verifyUrl}'>Click to verify email</a></p>";


            await _emailSender.SendEmailAsync(user.Email, "Verify Email", message);


            return Ok("Registration Success. Email on the way!!");

            // if (result.Succeeded)
            // {
            //     await SetRefreshToken(user);
            //     return CreateUserObject(user);
            // }

            // return BadRequest(result.Errors);
        }

        [AllowAnonymous]
        [HttpPost("verifyEmail")]
        public async Task<IActionResult> VerifyEmail(string token, string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return Unauthorized();
            var decodedTokenBytes = WebEncoders.Base64UrlDecode(token);
            var decodedToken = Encoding.UTF8.GetString(decodedTokenBytes);
            var result = await _userManager.ConfirmEmailAsync(user, decodedToken);
            if (!result.Succeeded) return BadRequest("Could not verify email address");
            return Ok("Email confirmed you can now log in");
        }

        [AllowAnonymous]
        [HttpGet("resendEmailConfirmationLink")]
        public async Task<IActionResult> ResendEmailConfirmationLink(string email)
        {
            var user = await _userManager.FindByEmailAsync(email);
            if (user == null) return Unauthorized();
            var origin = Request.Headers["origin"];
            var token = await _userManager.GenerateEmailConfirmationTokenAsync(user);
            token = WebEncoders.Base64UrlEncode(Encoding.UTF8.GetBytes(token));
            var verifyUrl = $"{origin}/account/verifyEmail?token={token}&email={user.Email}";
            var message = $"<p>Please click the below link to verify your email address:</p>";
            message += $"<p><a href='{verifyUrl}'>Click to verify email</a></p>";
            await _emailSender.SendEmailAsync(user.Email, "Verify Email", message);
            return Ok("Email Confirmation Link sent. Email on the way!!");
        }


        [Authorize]
        [HttpPost("refreshToken")]
        public async Task<ActionResult<UserDto>> RefreshToken()
        {
            var refreshToken = Request.Cookies["refreshToken"];
            var user = await _userManager.Users
                        .Include(r => r.RefreshTokens)
                        .Include(p => p.Photos)
                        .FirstOrDefaultAsync(x => x.UserName == User.FindFirstValue(ClaimTypes.Name));

            if (user == null)
            {
                return Unauthorized();
            }

            var oldToken = user.RefreshTokens.SingleOrDefault(x => x.Token == refreshToken);

            if (oldToken != null && !oldToken.IsActive) return Unauthorized();

            if (oldToken != null) oldToken.Revoked = DateTime.UtcNow;

            return CreateUserObject(user);
        }



        [Authorize]
        [HttpGet]
        public async Task<ActionResult<UserDto>> GetCurrentUser()
        {
            var user = await _userManager.Users
                                .Include(x => x.Photos)
                                .FirstOrDefaultAsync(x => x.Email == User.FindFirstValue(ClaimTypes.Email));

            await SetRefreshToken(user);
            return CreateUserObject(user);
        }


        private async Task SetRefreshToken(AppUser user)
        {
            var refreshToekn = _tokenService.GenertRefreshToken();
            user.RefreshTokens.Add(refreshToekn);
            await _userManager.UpdateAsync(user);

            var cookieOptions = new CookieOptions
            {
                HttpOnly = true,
                Expires = DateTime.UtcNow.AddDays(7)
            };

            Response.Cookies.Append("refreshToken", refreshToekn.Token, cookieOptions);
        }


        private UserDto CreateUserObject(AppUser user)
        {
            var userDto = new UserDto
            {
                DisplayName = user.DisplayName,
                Image = user.Photos.FirstOrDefault(x=> x.IsMain)?.Url ?? "",
                Token = _tokenService.CreateToken(user),
                Username = user.UserName
            };
            //user?.Photos?.First(x => x.IsMain)?.Url,
            return userDto;
        }
        
    }
}