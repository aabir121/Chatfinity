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

    public async Task LogoutUser(LogoutUserDto logoutUserDto)
    {
        var user = await GetAsync(logoutUserDto.UserName);
        if (user is null)
        {
            throw new NotFoundException("User not found");
        }

        user.LastOnlineTime = DateTime.Now;

        await _userRepository.UpdateUser(logoutUserDto.UserName, user);
    }

    public async Task CreateAsync(CreateUserDto user)
    {
        var userInDb = await _userRepository.FindUserByUserName(user.UserName);
        if (userInDb != null)
        {
            throw new BadRequestException("The username is already taken. Please try a new one.");
        }
        
        user.Password = PasswordUtils.HashString(user.Password);

        var userToCreate = new User(ObjectId.GenerateNewId().ToString(), user.UserName, user.FirstName, user.LastName, 
            user.DateOfBirth, user.Password, user.Avatar);
        await _userRepository.CreateUser(userToCreate);
    }

    public async Task<bool> UpdateOneAsync(string userName, UpdateUserDto userToUpdate)
    {   
        var userInDb = await GetAsync(userName);
        if (userInDb is null) return false;

        var user = new User(userInDb.Id, userInDb.UserName, userToUpdate.FirstName,
            userToUpdate.LastName, userToUpdate.DateOfBirth, userInDb.Password, userToUpdate.Avatar);
        
        return await _userRepository.UpdateUser(userName, user);
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