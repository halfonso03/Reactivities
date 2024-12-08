
using Application.Core;
using AutoMapper;
using AutoMapper.QueryableExtensions;
using MediatR;
using Microsoft.EntityFrameworkCore;
using Microsoft.Extensions.Logging;
using Persistence;

namespace Application.Activities
{
    public class List
    {
        public class Query : IRequest <Result<List<ActivityDto>>>
        {

        }

        public class Handler : IRequestHandler<Query, Result<List<ActivityDto>>>
        {
            private DataContext _context;
            public ILogger<List> _logger;
            private readonly IMapper _mapper;

            public Handler(DataContext context, IMapper mapper, ILogger<List> logger)
            {
                _mapper = mapper;
                _logger = logger;
                _context = context;
            }
            public async Task<Result<List<ActivityDto>>> Handle(Query request, CancellationToken cancellationToken)
            {

                // try
                // {
                //     for (var i = 0; i <= 10; i++)
                //     {
                //         cancellationToken.ThrowIfCancellationRequested();
                //         await Task.Delay(1000, cancellationToken);
                //         _logger.LogInformation($"Task {i} has completed");
                //     }
                // }
                // catch (System.Exception)
                // {

                //     _logger.LogError("Task was cancelled");
                // }


                var activities = 
                        await _context.Activities
                                    .ProjectTo<ActivityDto>(_mapper.ConfigurationProvider)
                                    .ToListAsync();

                

                return Result<List<ActivityDto>>.Success(activities);
            }
        }
    }
}