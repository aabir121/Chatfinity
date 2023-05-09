using backend.DTOs;
using backend.Models;
using MongoDB.Bson;

namespace backend.Services;

public interface IUserService
{
    Task<List<User>> GetAsync();
    Task<User?> GetAsync(string userName);
    Task<User?> AuthAndGetUser(UserDto userDto);
    Task CreateAsync(User user);
    Task UpdateOneAsync(string userName, User userToUpdate);
    Task RemoveAsync(string userName);
    bool IsUserNameValid(string userName);
}