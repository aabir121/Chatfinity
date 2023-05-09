using backend.Models;
using MongoDB.Bson;

namespace backend.Repositories;

public interface IChatRepository
{
    // Get all public chats
    Task<Chat?> GetOrCreatePublicChatAsync();

    // Get private chat based on two participants
    Task<Chat?> GetOrCreatePrivateChatAsync(string participant1, string participant2);

    Task<Chat?> CreateChat(Chat newChat);

    // Create message in public chat
    Task<Message?> CreateMessageInChatAsync(ObjectId chatId, Message newMessage);
    
    // Delete message in public chat by id
    Task<bool> DeleteMessageFromChatByIdAsync(ObjectId chatId, ObjectId messageId);

    // Update message content in private chat based on two participants by id
    Task<bool> UpdateMessageContent(ObjectId chatId, ObjectId messageId, string newContent);
}