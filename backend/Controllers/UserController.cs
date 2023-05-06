using backend.DTOs;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("api/[controller]")]
public class UserController : ControllerBase
{
    private readonly UserService _userService;

    public UserController(UserService userService)
    {
        _userService = userService;
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
}