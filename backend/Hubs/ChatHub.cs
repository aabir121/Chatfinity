using backend.Commands;
using backend.DTOs;
using backend.Interfaces;
using backend.Services;
using Microsoft.AspNetCore.SignalR;

namespace backend.Hubs;

public class ChatHub : Hub<IChatClient>
{
    private readonly ICommandExecutor _commandExecutor;
    private readonly IHubContext<ChatHub, IChatClient> _hubContext;
    private readonly IChatService _chatService;
    private readonly ConnectionManager _connectionManager;

    public ChatHub(ICommandExecutor executor, IHubContext<ChatHub, IChatClient> hubContext, 
        IChatService chatService, ConnectionManager connectionManager)
    {
        _commandExecutor = executor;
        _hubContext = hubContext;
        _chatService = chatService;
        _connectionManager = connectionManager;
    }

    public override async Task OnConnectedAsync()
    {
        var userName = Context.GetHttpContext()?.Request.Query["user"];
        _connectionManager.AddOrUpdateConnection(Context.ConnectionId, userName);
        
        await base.OnConnectedAsync();
        await AnnounceUser(userName, true);
    }

    public async Task SendMessage(CreateMessageDto msgBody)
    {
        var command = new SendMessageCommand(_chatService, _hubContext, _connectionManager, msgBody);
        await _commandExecutor.ExecuteAsync(command);
    }

    public async Task UpdateMessage(string chatId, string messageId, string updatedContent)
    {
        var command = new UpdateMessageCommand(_chatService, _hubContext, _connectionManager,
            chatId, messageId, updatedContent);
        await _commandExecutor.ExecuteAsync(command);
    }

    public async Task DeleteMessage(string chatId, string messageId)
    {
        var command = new DeleteMessageCommand(_chatService, _hubContext, _connectionManager,
            chatId, messageId);
        await _commandExecutor.ExecuteAsync(command);
    }

    private async Task AnnounceUser(string? userName, bool joined)
    {
        await Clients.Others.AnnounceUser(userName, joined);
    }

    public async Task TypingStatus(string user, string type, string[] participants, bool isTyping)
    {
        await Clients.AllExcept(Context.ConnectionId).TypingStatus(user, type, participants, isTyping);
    }

    public override async Task OnDisconnectedAsync(Exception? exception)
    {
        if (_connectionManager.RemoveConnection(Context.ConnectionId, out var removed))
        {
            await AnnounceUser(removed, false);
        }

        await base.OnDisconnectedAsync(exception);
    }
}