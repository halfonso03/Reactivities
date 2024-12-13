using System;
using System.Collections.Generic;
using System.Linq;
using System.Threading.Tasks;
using API.DTOs;
using Application.Profiles;
using Microsoft.AspNetCore.Mvc;

namespace API.Controllers
{
    public class ProfilesController: BaseApiController
    {
        [HttpGet("{username}")]
        public async Task<IActionResult> GetProfile(string username)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Username = username }));
        }

        [HttpPut]
        public async Task<IActionResult> Update(ProfileDto profile)
        {
            return HandleResult(await Mediator.Send(new Update.Command { Bio = profile.Bio, DisplayName = profile.DisplayName }));
        }

        [HttpGet("{username}/activities")]
        public async Task<IActionResult> GetUserActivities([FromQuery] string predicate, string username)
        {
            return HandleResult(await Mediator.Send(new ListActivities.Query { Predicate = predicate, Username = username }));
        }

    }
}