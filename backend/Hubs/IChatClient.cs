using backend.Models;

namespace backend.Hubs;

public interface IChatClient
{
    Task ReceiveMessage(string user, string message);
    Task AnnounceUser(MessageUser messageUser, bool joined);
    Task GetAllUsers(List<MessageUser> users);
    Task TypingStatus(string user, bool isTyping);
}