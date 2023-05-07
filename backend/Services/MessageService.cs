using backend.Models;
using backend.Repositories;
using MongoDB.Driver;

namespace backend.Services;

public class MessageService : IMessageService
{
    private readonly IMessageRepository _messageRepository;

    public MessageService(IMessageRepository messageRepository)
    {
        this._messageRepository = messageRepository;
    }

    public async Task<Message> CreateAsync(Message message)
    {
        message.SentAt = DateTime.Now;
        await _messageRepository.CreateMessage(message);
        return message;
    }

    public async Task<List<Message>?> GetAsync()
    {
        return await _messageRepository.FindAllMessages();
    }

    public async Task<List<Message>?> GetAsync(string from, string to)
    {
        return await _messageRepository.FindMessageByParticipants(from, to);
    }
}
