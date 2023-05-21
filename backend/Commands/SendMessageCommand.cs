using backend.DTOs;
using backend.Enums;
using backend.Hubs;
using backend.Services;
using Microsoft.AspNetCore.SignalR;

namespace backend.Commands
{
    public class SendMessageCommand : ICommand
    {
        private readonly IChatService _chatService;
        private readonly IHubContext<ChatHub, IChatClient> _hubContext;
        private readonly CreateMessageDto _message;
        private readonly ConnectionManager _connectionManager;

        public SendMessageCommand(
            IChatService chatService,
            IHubContext<ChatHub, IChatClient> hubContext,
            ConnectionManager connectionManager,
            CreateMessageDto message)
        {
            _chatService = chatService;
            _hubContext = hubContext;
            _connectionManager = connectionManager;
            _message = message;
        }

        public async Task Execute()
        {
            if (!Enum.TryParse(typeof(ChatType), _message.Type, true, out var chatTypeObj) ||
                !Enum.IsDefined(typeof(ChatType), chatTypeObj))
            {
                return;
            }

            var chatType = (ChatType)chatTypeObj;
            _message.TimeStamp = DateTime.Now;

            var participants = GetChatParticipants(chatType);
            var clientsToSend = GetClientsToSend(chatType);

            var chatDto = await _chatService.CreateMessage(chatType.ToString(), participants, _message);

            await SendMessageToClients(clientsToSend);
        }

        private string[] GetChatParticipants(ChatType chatType)
        {
            return chatType switch
            {
                ChatType.Public => new[] { _message.Sender },
                ChatType.Private => new[] { _message.Sender, _message.Receiver ?? string.Empty },
                _ => Array.Empty<string>()
            };
        }

        private IEnumerable<string> GetClientsToSend(ChatType chatType)
        {
            return chatType switch
            {
                ChatType.Public => new List<string>(),
                ChatType.Private => new List<string> { _message.Sender, _message.Receiver ?? string.Empty },
                _ => new List<string>()
            };
        }

        private async Task SendMessageToClients(IEnumerable<string> clientsToSend)
        {
            var connectionIds = clientsToSend
                .Select(c => _connectionManager.TryGetByUserName(c))
                .ToList();

            if (connectionIds.Count > 0)
            {
                await _hubContext.Clients.Clients(connectionIds).ReceiveMessage(_message);
            }
            else
            {
                await _hubContext.Clients.All.ReceiveMessage(_message);
            }
        }
    }
}
