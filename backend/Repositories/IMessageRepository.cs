using backend.Models;

namespace backend.Repositories;

public interface IMessageRepository
{
    Task CreateMessage(Message message);
    Task<List<Message>> FindAllMessages();
    Task<List<Message>> FindMessageByParticipants(string from, string to);
}