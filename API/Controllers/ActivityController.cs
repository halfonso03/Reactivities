using System;
using System.Collections.Generic;

using System.Linq;
using System.Reflection.Metadata;
using System.Threading.Tasks;
using Application.Activities;
using Application.Core;
using Domain;
using MediatR;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Cors;
using Microsoft.AspNetCore.Mvc;
using Microsoft.EntityFrameworkCore;
using Persistence;

namespace API.Controllers
{

    public class ActivitiesController : BaseApiController
    {
        [HttpGet]
        public async Task<ActionResult<List<Activity>>> GetActivities([FromQuery] ActivityParams param)
        {
            return HandlePagedResult(await Mediator.Send(new List.Query { Params = param }));
        }


        [HttpGet("{id}")]
        public async Task<IActionResult> GetActivity(Guid id)
        {
            return HandleResult(await Mediator.Send(new Details.Query { Id = id }));            
        }

        [HttpPost]
        public async Task<IActionResult> Create(Activity activity)
        {
            return HandleResult(await Mediator.Send(new Create.Command() { Activity = activity }));        
        }

        [Authorize(Policy ="IsActivityHost")]
        [HttpPut("{id}")]        
        public async Task<IActionResult> Edit (Guid id, Activity activity)
        {
            activity.Id = id;

            return HandleResult(await Mediator.Send(new Edit.Command { Activity = activity }));            
        }

        [Authorize(Policy ="IsActivityHost")]
        [HttpDelete("{id}")]
        public async Task<IActionResult> DeleteActivity (Guid id)
        {
            return HandleResult(await Mediator.Send(new Delete.Command { Id = id }));            
        }

        [HttpPost("{id}/attend")]
        public async Task<IActionResult> Attend(Guid id)        
        {
            return HandleResult(await Mediator.Send(new UpdateAttendance.Command { Id = id }));
        }
    }
}