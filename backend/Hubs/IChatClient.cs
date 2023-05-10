using backend.DTOs;
using backend.Models;

namespace backend.Hubs;

public interface IChatClient
{
    Task SendMessage(CreateMessageDto message);
    Task ReceiveMessage(CreateMessageDto message);
    Task AnnounceUser(MessageUser messageUser, bool joined);
    Task TypingStatus(string user, string type, string[] participants, bool isTyping);
}