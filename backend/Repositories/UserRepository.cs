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

    public async Task UpdateUser(string userName, User user)
    {
        await Collection.ReplaceOneAsync(x => x.UserName == userName, user);
    }

    public async Task DeleteUser(string userName)
    {
        await Collection.DeleteOneAsync(userName);
    }
}