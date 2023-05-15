using backend.DTOs;
using backend.Models;

namespace backend.Hubs;

public interface IChatClient
{
    Task SendMessage(CreateMessageDto message);
    Task ReceiveMessage(CreateMessageDto message);
    Task AnnounceUser(string? userName, bool joined);
    Task TypingStatus(string user, string type, string[] participants, bool isTyping);
    Task MessageUpdated(MessageDto messageDto);
    Task UpdateMessage(string chatId, string messageId, string updatedContent);
    Task DeleteMessage(string chatId, string messageId);
    Task MessageDeleted(string chatId, string messageId);
}