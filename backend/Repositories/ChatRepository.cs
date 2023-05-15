using backend.Enums;
using backend.Models;
using MongoDB.Bson;
using MongoDB.Driver;

namespace backend.Repositories;

public class ChatRepository : RepositoryBase<Chat>, IChatRepository
{
    public ChatRepository(IMongoDbConfig config) : base(config) {}
    
    public async Task<Chat?> GetOrCreatePublicChatAsync()
    {
        var filter = Builders<Chat>.Filter.Eq(c=>c.Type, (int)ChatType.Public);

        var chat = await Collection.Find(filter).FirstOrDefaultAsync();

        if (chat != null) return chat;
        
        chat = new Chat((int)ChatType.Public,  new List<string>(), new List<Message>());
        await CreateChat(chat);

        return chat;
    }


    public async Task<Chat?> GetOrCreatePrivateChatAsync(string participant1, string participant2)
    {
        var participantSet = new HashSet<string> { participant1, participant2 };

        var filter = Builders<Chat>.Filter.And(
            Builders<Chat>.Filter.Eq(c=>c.Type, (int)ChatType.Private),
            Builders<Chat>.Filter.Size(c=>c.Participants, 2),
            Builders<Chat>.Filter.All(c=>c.Participants, participantSet)
        );

        var chat = await Collection.Find(filter).FirstOrDefaultAsync();

        if (chat != null) return chat;
        
        chat = new Chat((int)ChatType.Private, new List<string>() { participant1, participant2 }, new List<Message>());
        await CreateChat(chat);

        return chat;
    }

    public async Task<Chat?> CreateChat(Chat newChat)
    {
        await Collection.InsertOneAsync(newChat);
        return newChat;
    }

    public async Task<Message?> CreateMessageInChatAsync(ObjectId chatId, Message newMessage)
    {
        var chatObject = await Collection.Find(chat => chat.Id == chatId).FirstOrDefaultAsync();
        if (chatObject is null)
        {
            return null;
        }
        
        newMessage.Id = ObjectId.GenerateNewId();

        // Create a filter expression to find the chat document by its Id
        var filter = Builders<Chat>.Filter.Eq(c => c.Id, chatId);

        // Create an update expression to add the new message to the Messages list
        var update = Builders<Chat>.Update.Push(c => c.Messages, newMessage);

        // Call UpdateOneAsync to perform the update operation
        var result = await Collection.UpdateOneAsync(filter, update);

        return result.IsAcknowledged ? newMessage : null;
    }


    public async Task<bool> DeleteMessageFromChatByIdAsync(ObjectId chatId, ObjectId messageId)
    {
        // Create a filter expression to find the chat document by its Id
        var filter = Builders<Chat>.Filter.Eq(c => c.Id, chatId);

        // Create an update expression to remove the message with the specified Id from the Messages list
        var update = Builders<Chat>.Update.PullFilter(c => c.Messages, m => m.Id == messageId);

        // Call UpdateOneAsync to perform the update operation
        var result = await Collection.UpdateOneAsync(filter, update);

        return result.IsAcknowledged;
    }

    public async Task<bool> UpdateMessageContent(ObjectId chatId, ObjectId messageId, string newContent)
    {
        // Create a filter expression to find the chat document by its Id and the message within the Messages list by its Id
        var filter = Builders<Chat>.Filter.And(
            Builders<Chat>.Filter.Eq(c => c.Id, chatId),
            Builders<Chat>.Filter.ElemMatch(c => c.Messages, m => m.Id == messageId)
        );

        // Create an update expression to set the content of the message with the specified Id to the new value
        var update = Builders<Chat>.Update.Set(c => c.Messages[-1].Content, newContent);

        // Call UpdateOneAsync to perform the update operation
        var result = await Collection.UpdateOneAsync(filter, update);

        return result.IsAcknowledged;
    }

    public async Task<Message?> GetMessageById(ObjectId chatId, ObjectId messageId)
    {
        var filter = Builders<Chat>.Filter.Eq(c=>c.Id, chatId);
        var projection = Builders<Chat>.Projection
            .ElemMatch(x => x.Messages, Builders<Message>.Filter.Eq(m=>m.Id, messageId));

        var chat = await Collection.Find(filter)
            .Project<Chat>(projection)
            .FirstOrDefaultAsync();

        return chat?.Messages?.FirstOrDefault();
    }
}