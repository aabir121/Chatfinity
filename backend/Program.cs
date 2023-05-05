using backend.Hubs;
using backend.Models;
using backend.Services;
using Microsoft.Extensions.Options;

var builder = WebApplication.CreateBuilder(args);

// Add services to the container.
builder.Services.Configure<MongoDbConfig>(builder.Configuration.GetSection(nameof(MongoDbConfig)));
builder.Services.AddSingleton<IMongoDbConfig>(provider =>
    provider.GetRequiredService<IOptions<MongoDbConfig>>().Value);
builder.Services.AddSingleton<UserService>();
builder.Services.AddSingleton<MessageService>();

builder.Services.AddCors();
builder.Services.AddControllers();
// Learn more about configuring Swagger/OpenAPI at https://aka.ms/aspnetcore/swashbuckle
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddSignalR();
var app = builder.Build();

app.UseCors(builder =>
    builder.AllowAnyHeader()
        .WithOrigins("http://localhost:3000")
        .AllowAnyMethod()
        .AllowCredentials());

// Configure the HTTP request pipeline.
if (app.Environment.IsDevelopment())
{
    app.UseSwagger();
    app.UseSwaggerUI();
}

app.UseHttpsRedirection();

app.UseAuthorization();

app.MapControllers();

app.MapHub<ChatHub>("/chatHub");

app.Run();