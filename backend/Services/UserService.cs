using backend.DTOs;
using backend.ErrorManagement.Exceptions;
using backend.Models;
using backend.Repositories;
using backend.Utils;
using MongoDB.Bson;
using MongoDB.Driver;

namespace backend.Services;

public class UserService : IUserService
{
    private readonly IUserRepository _userRepository;

    public UserService(IUserRepository userRepository)
    {
        this._userRepository = userRepository;
    }

    public async Task<List<User>> GetAsync()
    {
        return await _userRepository.FindAllUsers();
    }

    public async Task<User?> GetAsync(string userName)
    {
        return await _userRepository.FindUserByUserName(userName);
    }

    public async Task<User?> AuthAndGetUser(UserDto userDto)
    {
        var user = await _userRepository.FindUserByUserName(userDto.Username);
        if (user is null)
        {
            throw new NotFoundException("User not found. Please check your username and try again.");
        }

        if (PasswordUtils.HashString(userDto.Password) != user.Password)
        {
            throw new backend.ErrorManagement.Exceptions.InvalidCredentialsException(
                "Invalid Credentials. Please check your username and password and try again.");
        }

        return user;
    }

    public async Task CreateAsync(User user)
    {
        var userInDb = await _userRepository.FindUserByUserName(user.UserName);
        if (userInDb != null)
        {
            throw new BadRequestException("The username is already taken. Please try a new one.");
        }
        
        user.Password = PasswordUtils.HashString(user.Password);
        await _userRepository.CreateUser(user);
    }

    public async Task UpdateOneAsync(string userName, User userToUpdate)
    {
        await _userRepository.UpdateUser(userName, userToUpdate);
    }

    public async Task RemoveAsync(string userName)
    {
        await _userRepository.DeleteUser(userName);
    }

    public bool IsUserNameValid(string userName)
    {
        return !string.IsNullOrEmpty(userName) && _userRepository.IsUserNameValid(userName);
    }
}