using System.Collections.Concurrent;
using backend.DTOs;
using backend.Models;
using Microsoft.AspNetCore.SignalR;
using MongoDB.Bson;

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

    public async Task SendMessage(CreateMessageDto msgBody)
    {
        msgBody.Id = ObjectId.GenerateNewId().ToString();
        msgBody.TimeStamp = DateTime.Now;
        await Clients.Others.ReceiveMessage(msgBody);
    }

    public async Task AnnounceUser(MessageUser user, bool joined)
    {
        await Clients.Others.AnnounceUser(user, joined);
    }

    public async Task TypingStatus(string user, string type, string[] participants, bool isTyping)
    {
        await Clients.AllExcept(Context.ConnectionId).TypingStatus(user, type, participants, isTyping);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (ConnectionMap.TryRemove(Context.ConnectionId, out var removed))
        {
            await AnnounceUser(removed, false);
        }

        await base.OnDisconnectedAsync(exception);
    }
}