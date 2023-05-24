using System.Collections.ObjectModel;
using backend.DTOs;
using backend.ErrorManagement.Exceptions;
using backend.Models;
using MongoDB.Driver;

namespace backend.Repositories;

public class UserRepository : RepositoryBase<User>, IUserRepository
{
    public UserRepository(IMongoDbConfig mongoDbSettings) : base(mongoDbSettings) { }
    
    public async Task<List<User>> FindAllUsers()
    {
        return await Collection.Find(_ => true).ToListAsync();
    }

    public async Task<User?> FindUserByUserName(string userName)
    {
        return await Collection.Find(x => x.UserName == userName).FirstOrDefaultAsync();
    }

    public async Task CreateUser(User user)
    {
        await Collection.InsertOneAsync(user);
    }

    public async Task<bool> UpdateUser(string userName, User user)
    {
        var result = await Collection.ReplaceOneAsync(x => x.UserName == userName, user);
        return result.IsAcknowledged;
    }

    public async Task DeleteUser(string userName)
    {
        await Collection.DeleteOneAsync(userName);
    }

    public bool IsUserNameValid(string userName)
    {
        return Collection.AsQueryable().Any(u => u.UserName.Equals(userName));
    }
}