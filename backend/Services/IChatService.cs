using backend.DTOs;

namespace backend.Services;

public interface IChatService
{
    Task<ChatDto?> GetPublicMessages();

    Task<ChatDto?> GetPrivateMessagesByParticipants(string userName1, string userName2);

    Task<MessageDto?> CreateMessage(string chatType, string[] participants, MessageDto newMessage);

    Task<bool> UpdateMessage(string chatId, string messageId, string updatedContent);

    Task<bool> DeleteMessage(string chatId, string messageId);

    Task<MessageDto?> GetMessageById(string chatId, string messageId);
}