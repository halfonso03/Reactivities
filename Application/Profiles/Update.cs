using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Claims;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using Domain;
using FluentValidation;
using MediatR;
using Microsoft.AspNetCore.Http;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace Application.Profiles
{
    public class Update
    {
        public class Command : IRequest<Result<Unit>>
        {
            public string DisplayName { get; set;}
            public string Bio { get; set; }            
        }

        // public class CommandValidator: AbstractValidator<Command>
        // {
        //     public CommandValidator()
        //     {
        //         RuleFor(x => x.Activity).SetValidator(new ActivityValidator());
        //     }
        // }

        public class Handler : IRequestHandler<Command , Result<Unit>>
        {
        private readonly DataContext _context;
        private readonly IUserAccessor _userAccessor;
        private readonly IHttpContextAccessor _httpContextAccessor;

            public Handler(DataContext context, IUserAccessor userAccessor, IHttpContextAccessor httpContextAccessor)
            {
                _httpContextAccessor = httpContextAccessor;
                _userAccessor = userAccessor;
                _context = context;
            }

            public async Task<Result<Unit>> Handle(Command request, CancellationToken cancellationToken)
            {
                

                var userId = _httpContextAccessor.HttpContext.User.FindFirstValue(ClaimTypes.NameIdentifier);


                var user = await _context.Users.SingleOrDefaultAsync(x => x.Id == userId);

                if (user == null) return Result<Unit>.Failure("Could not find user:" + userId);

                user.Bio = request.Bio;
                user.DisplayName = request.DisplayName;

                var result = await _context.SaveChangesAsync(CancellationToken.None) > 0;

                if (!result)
                {
                    return Result<Unit>.Failure("Failed to update profile");
                }
                else 
                {
                    return Result<Unit>.Success(Unit.Value);
                }
            }
        }
    }
}