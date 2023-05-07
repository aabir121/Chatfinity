using backend.Models;
using MongoDB.Driver;

namespace backend.Repositories;

public class MessageRepository : RepositoryBase<Message>, IMessageRepository
{
    public MessageRepository(IMongoDbConfig config) : base(config) {}
    public async Task CreateMessage(Message message)
    {
        await Collection.InsertOneAsync(message);
    }

    public async Task<List<Message>> FindAllMessages()
    {
        return await Collection.Find(_=>true).ToListAsync();
    }

    public async Task<List<Message>> FindMessageByParticipants(string from, string to)
    {
        return await Collection.Find(x => x.From == from && x.To == to).ToListAsync();
    }
}