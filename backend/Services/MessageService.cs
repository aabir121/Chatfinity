using backend.Models;
using MongoDB.Driver;

namespace backend.Services;

public class MessageService : BaseService<Message>
{
    public MessageService(IMongoDbConfig config) : base(config) {}

    public async Task<Message> CreateAsync(Message message)
    {
        message.SentAt = DateTime.Now;
        await Collection.InsertOneAsync(message);
        return message;
    }

    public async Task<List<Message>?> GetAsync()
    {
        return await Collection.Find(_=>true).ToListAsync();
    }

    public async Task<List<Message>?> GetAsync(string from, string to)
    {
        return await Collection.Find(x => x.From == from && x.To == to).ToListAsync();
    }
}