using System.Collections.Concurrent;
using backend.Models;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

public class ChatHub : Hub<IChatClient>
{
    public static readonly ConcurrentDictionary<string, MessageUser> ConnectionMap = new();

    public override async Task OnConnectedAsync()
    {
        var userName = Context.GetHttpContext()?.Request.Query["user"];
        var messageUser = new MessageUser(userName, DateTime.Now, true);
        ConnectionMap[Context.ConnectionId] = messageUser;
        
        await base.OnConnectedAsync();
        await this.AnnounceUser(messageUser, true);
    }

    public async Task SendMessage(string user, string message)
    {
        await Clients.Others.ReceiveMessage(user, message);
    }

    public async Task AnnounceUser(MessageUser user, bool joined)
    {
        await Clients.Others.AnnounceUser(user, joined);
    }

    public async Task TypingStatus(string user, bool isTyping)
    {
        await Clients.AllExcept(Context.ConnectionId).TypingStatus(user, isTyping);
    }

    public override async Task OnDisconnectedAsync(Exception exception)
    {
        MessageUser removed;

        if (ConnectionMap.TryRemove(Context.ConnectionId, out removed))
        {
            await AnnounceUser(removed, false);
        }

        await base.OnDisconnectedAsync(exception);
    }
}