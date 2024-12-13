using System;
using System.Collections.Generic;
using System.Linq;
using System.Security.Cryptography.X509Certificates;
using System.Threading.Tasks;
using Application.Core;
using Application.Interfaces;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.EntityFrameworkCore.Query;
using Persistence;

namespace Application.Profiles
{
    public class ListActivities
    {
        public class Query : IRequest<Result<List<UserActivityDto>>>
        {
            public string Predicate { get; set; }
            public string Username { get; set; }
        }

        public class Handler : IRequestHandler<Query, Result<List<UserActivityDto>>>
        {
            private readonly DataContext _context;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper)
            {
                _mapper = mapper;
                _context = context;

            }

            public async Task<Result<List<UserActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {

                var query = _context.Activities
                            .SelectMany(x => x.Attendees)
                            .Where(x => x.AppUser.UserName == request.Username)                                
                            .AsQueryable();

                if (request.Predicate == "past")
                {
                    query = query.Where(x => x.Activity.Date < DateTime.Today);
                }
                else if (request.Predicate == "future")
                {
                    query = query.Where(x => x.Activity.Date >= DateTime.Today);
                }
                else if (request.Predicate == "hosting")
                {
                    query = query.Where(x => x.IsHost);
                }

                var results = await query
                    .OrderBy(x => x.Activity.Date)
                    .ProjectTo<UserActivityDto>(_mapper.ConfigurationProvider)
                    .ToListAsync();

                return Result<List<UserActivityDto>>.Success(results);


            }
        }
    }
}