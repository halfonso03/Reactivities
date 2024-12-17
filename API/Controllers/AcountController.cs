using System;
using System.Collections.Generic;
using System.Diagnostics;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using API.DTOs;
using API.Services;
using CloudinaryDotNet.Actions;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
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

        public AccountController(UserManager<AppUser> userManager, TokenService tokenService)
        {
            // _signInManager = signInManager;
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
                return Unauthorized();
            }

            var result = await _userManager.CheckPasswordAsync(user, loginDto.Password);

            if (result)
            {
                await SetRefreshToken(user);
                return CreateUserObject(user);
            }

            return Unauthorized();
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

            if (result.Succeeded)
            {
                await SetRefreshToken(user);
                return CreateUserObject(user);
            }

            return BadRequest(result.Errors);
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