using System.Collections.Concurrent;
using backend.Commands;
using backend.DTOs;
using backend.Interfaces;
using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

public class ChatHub : Hub<IChatClient>
{
    public static readonly ConcurrentDictionary<string, MessageUser> ConnectionMap = new();

    private readonly ICommandExecutor _commandExecutor;
    private readonly IHubContext<ChatHub, IChatClient> _hubContext;
    private readonly IChatService _chatService;

    public ChatHub(ICommandExecutor executor, IHubContext<ChatHub, IChatClient> hubContext, IChatService chatService)
    {
        _commandExecutor = executor;
        _hubContext = hubContext;
        _chatService = chatService;
    }

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
        var command = new SendMessageCommand(_chatService, _hubContext, msgBody);
        await _commandExecutor.ExecuteAsync(command);
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