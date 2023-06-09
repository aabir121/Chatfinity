using backend.DTOs;
using backend.Models;
using MongoDB.Bson;

namespace backend.Services;

public interface IUserService
{
    Task<List<User>> GetAsync();
    Task<User?> GetAsync(string userName);
    Task<User?> AuthAndGetUser(UserDto userDto);
    Task LogoutUser(LogoutUserDto logoutUserDto);
    Task CreateAsync(CreateUserDto user);
    Task<bool> UpdateOneAsync(string userName, UpdateUserDto userToUpdate);
    Task RemoveAsync(string userName);
    bool IsUserNameValid(string userName);
}