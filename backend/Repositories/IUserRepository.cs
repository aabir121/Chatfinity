using backend.Models;

namespace backend.Repositories;

public interface IUserRepository
{
    Task<List<User>> FindAllUsers();
    Task<User?> FindUserByUserName(string userName);
    Task CreateUser(User user);
    Task<bool> UpdateUser(string userName, User user);
    Task DeleteUser(string userName);
    bool IsUserNameValid(string userName);
}