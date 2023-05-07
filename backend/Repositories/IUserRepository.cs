using backend.Models;

namespace backend.Repositories;

public interface IUserRepository
{
    Task<List<User>> FindAllUsers();
    Task<User?> FindUserByUserName(string userName);
    Task CreateUser(User user);
    Task UpdateUser(string userName, User user);
    Task DeleteUser(string userName);
}