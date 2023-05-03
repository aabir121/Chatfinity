using backend.DTOs;
using backend.Models;
using backend.Utils;
using MongoDB.Driver;

namespace backend.Services;

public class UserService
{
    private readonly IMongoCollection<User> _usersCollection;

    public UserService(IMongoDbConfig mongoDbSettings)
    {
        var mongoClient = new MongoClient(
            mongoDbSettings.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            mongoDbSettings.DatabaseName);

        _usersCollection = mongoDatabase.GetCollection<User>(
            mongoDbSettings.UsersCollectionName);
    }

    public async Task<List<User>> GetAsync()
    {
        return await _usersCollection.Find(_ => true).ToListAsync();
    }

    public async Task<User?> GetAsync(string userName)
    {
        return await _usersCollection.Find(x => x.UserName == userName).FirstOrDefaultAsync();
    }

    public async Task<User?> AuthAndGetUser(UserDto userDto)
    {
        var user = await _usersCollection.Find(x => x.UserName == userDto.Username).FirstOrDefaultAsync();
        if (user is null)
        {
            return null;
        }

        return PasswordUtils.HashString(userDto.Password) == user.Password ? user : null;
    }

    public async Task CreateAsync(User user)
    {
        user.Password = PasswordUtils.HashString(user.Password);
        await _usersCollection.InsertOneAsync(user);
    }

    public async Task UpdateOneAsync(string userName, User userToUpdate)
    {
        await _usersCollection.ReplaceOneAsync(x => x.UserName == userName, userToUpdate);
    }

    public async Task RemoveAsync(string userName)
    {
        await _usersCollection.DeleteOneAsync(x => x.UserName == userName);
    }
}