using backend.DTOs;
using backend.Models;
using backend.Utils;
using MongoDB.Driver;

namespace backend.Services;

public class UserService : BaseService<User>
{
    public UserService(IMongoDbConfig mongoDbSettings) : base(mongoDbSettings) { }

    public async Task<List<User>> GetAsync()
    {
        return await Collection.Find(_ => true).ToListAsync();
    }

    public async Task<User?> GetAsync(string userName)
    {
        return await Collection.Find(x => x.UserName == userName).FirstOrDefaultAsync();
    }

    public async Task<User?> AuthAndGetUser(UserDto userDto)
    {
        var user = await Collection.Find(x => x.UserName == userDto.Username).FirstOrDefaultAsync();
        if (user is null)
        {
            return null;
        }

        return PasswordUtils.HashString(userDto.Password) == user.Password ? user : null;
    }

    public async Task CreateAsync(User user)
    {
        user.Password = PasswordUtils.HashString(user.Password);
        await Collection.InsertOneAsync(user);
    }

    public async Task UpdateOneAsync(string userName, User userToUpdate)
    {
        await Collection.ReplaceOneAsync(x => x.UserName == userName, userToUpdate);
    }

    public async Task RemoveAsync(string userName)
    {
        await Collection.DeleteOneAsync(x => x.UserName == userName);
    }
}