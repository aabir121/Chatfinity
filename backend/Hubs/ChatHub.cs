using backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs
{
    public class ChatHub : Hub<IChatClient>
    {
        public async Task SendMessage(string user, string message)
        {
            await Clients.Others.ReceiveMessage(user, message);
        }

        public async Task AnnounceUser(string user, bool joined)
        {
            var currentUser = new User(Context.ConnectionId, user, DateTime.Now);
            if (joined)
            {
                ClientList.AllUsers.Add(currentUser);
            }
            else
            {
                currentUser = ClientList.AllUsers.FirstOrDefault(u => u.userName == user);
                ClientList.AllUsers.Remove(currentUser);
            }

            await Clients.Others.AnnounceUser(currentUser, joined);
        }

        public async Task GetAllUsers()
        {
            var otherUsers = ClientList.AllUsers.Where(u => u.connectionId != Context.ConnectionId).ToList();
            await Clients.Caller.GetAllUsers(otherUsers);
        }

        public async Task TypingStatus(string user, bool isTyping)
        {
            await Clients.AllExcept(Context.ConnectionId).TypingStatus(user, isTyping);
        }

        public override async Task OnDisconnectedAsync(Exception exception)
        {
            var user = ClientList.AllUsers.FirstOrDefault(u => u.connectionId == Context.ConnectionId);
            if (user != null)
            {
                await AnnounceUser(user.userName, false);
            }

            await base.OnDisconnectedAsync(exception);
        }
    }
}