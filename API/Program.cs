using API.Extensions;
using API.Middleware;
using API.SignalR;
using Domain;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Identity;
using Microsoft.AspNetCore.Mvc.Authorization;
using Microsoft.AspNetCore.Mvc.TagHelpers;
using Microsoft.EntityFrameworkCore;
using Persistence;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.

builder.Services.AddApplicationServices(builder.Configuration);
builder.Services.AddIdentityServices(builder.Configuration);

builder.Services.AddControllers(opt => 
{
    var policy = new AuthorizationPolicyBuilder().RequireAuthenticatedUser().Build();
    opt.Filters.Add(new AuthorizeFilter(policy));
});

var app = builder.Build();

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{    
    app.UseSwagger();
    app.UseSwaggerUI();
}
else 
{
    // transport securiryt - BUT DOESN'T WORK
    app.UseHsts();
    app.Use(async (context, next) =>
    {
        context.Request.Headers.Add("Strict-Transport-Security", "max-age=31536000");
        await next();
    });
}

//app.UseHttpsRedirection();

app.UseMiddleware(typeof(ExceptionHandlingMiddleware));

app.UseXContentTypeOptions();
app.UseReferrerPolicy(opt =>
{
    opt.NoReferrer();
});
app.UseXXssProtection(opt => opt.EnabledWithBlockMode());
app.UseXfo(opt => opt.Deny());
app.UseCsp(opt =>
{
    opt.BlockAllMixedContent()
        .StyleSources(s => s.Self().CustomSources("https://fonts.googleapis.com"))
        .FontSources(s => s.Self().CustomSources("https://fonts.gstatic.com", "data:"))
        .FormActions(s => s.Self())
        .FrameAncestors(s => s.Self())
        .ImageSources(s => s.Self())
        .ScriptSources(s => s.Self());
});

app.UseCors("CorsPolicy");
app.UseAuthentication();
app.UseAuthorization();

app.UseDefaultFiles(); // looks for default files i.e, index.html,...
app.UseStaticFiles(); // serves from wwwroot folder
app.MapControllers();

app.MapHub<ChatHub>("/chat");
app.MapFallbackToController("Index", "Fallback");

using var scope = app.Services.CreateScope();
var services = scope.ServiceProvider;


try {
    var context = services.GetRequiredService<DataContext>();
    var userManager = services.GetRequiredService<UserManager<AppUser>>();
    await context.Database.MigrateAsync();
    await Seed.SeedData(context, userManager);
}
catch (Exception ex)
{
    var logger = services.GetRequiredService<ILogger<Program>>();
    logger.LogError(ex, "migration error");
}

app.Run();
