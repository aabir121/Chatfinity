using backend.Models;

namespace backend.Hubs;

public interface IChatClient
{
    Task ReceiveMessage(string user, string message);
    Task AnnounceUser(User user, bool joined);
    Task GetAllUsers(List<User> users);
    Task TypingStatus(string user, bool isTyping);
}
