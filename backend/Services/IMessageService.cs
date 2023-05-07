using backend.Models;

namespace backend.Services;

public interface IMessageService
{
    Task<Message> CreateAsync(Message message);
    Task<List<Message>?> GetAsync();
    Task<List<Message>?> GetAsync(string from, string to);
}
