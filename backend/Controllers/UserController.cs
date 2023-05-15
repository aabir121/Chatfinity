using backend.DTOs;
using backend.ErrorManagement.Exceptions;
using backend.Hubs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly IUserService _userService;
    private readonly ConnectionManager _connectionManager;

    public UserController(IUserService userService, ConnectionManager connectionManager)
    {
        _userService = userService;
        _connectionManager = connectionManager;
    }

    [HttpGet]
    public async Task<List<User>> Get()
    {
        return await _userService.GetAsync();
    }

    [HttpGet("{userName}")]
    public async Task<ActionResult<User>> Get(string userName)
    {
        var users = await _userService.GetAsync(userName);

        if (users is null) return NotFound();

        return users;
    }

    [HttpPost("Login")]
    public async Task<ActionResult<User?>> Login(UserDto userDto)
    {
        var user = await _userService.AuthAndGetUser(userDto);
        return user;
    }
    
    [HttpPost("Logout")]
    public async Task<bool> Logout(LogoutUserDto logoutUser)
    {
        if (string.IsNullOrWhiteSpace(logoutUser.UserName))
        {
            throw new BadRequestException("Username is mandatory");
        }
        
        await _userService.LogoutUser(logoutUser);

        return true;
    }

    [HttpPost]
    public async Task<IActionResult> Create(User user)
    {
        await _userService.CreateAsync(user);

        return CreatedAtAction(nameof(Get), new { userName = user.UserName }, user);
    }

    [HttpPut]
    public async Task<IActionResult> Update(string userName, User user)
    {
        var userInDb = await _userService.GetAsync(userName);
        if (userInDb is null) return NotFound();

        user.Id = userInDb.Id;
        await _userService.UpdateOneAsync(userName, user);

        return CreatedAtAction(nameof(Get), new { userName = user.UserName }, user);
    }

    [HttpDelete]
    public async Task<IActionResult> Delete(string userName)
    {
        var userInDb = await _userService.GetAsync(userName);
        if (userInDb is null) return NotFound();

        await _userService.RemoveAsync(userName);

        return NoContent();
    }

    [HttpGet("Chat")]
    public async Task<List<ChatUserDto>> GetChatUserList()
    {
        var allUsers = await _userService.GetAsync();
        var allConnectedUserNames = _connectionManager.GetAllConnectedUserNames() ?? new List<string?>();
        var connectedUserSet = new HashSet<string>(allConnectedUserNames);

        return allUsers.Select(user => 
            new ChatUserDto(user.UserName, user.FirstName, user.LastName, user.LastOnlineTime, 
                connectedUserSet.Contains(user.UserName)))
            .ToList();
    }
}