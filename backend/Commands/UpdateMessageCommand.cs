using backend.Hubs;
using backend.Services;
using Microsoft.AspNetCore.SignalR;
using backend.DTOs;

namespace backend.Commands
{
    public class UpdateMessageCommand : ICommand
    {
        private readonly IChatService _chatService;
        private readonly IHubContext<ChatHub, IChatClient> _hubContext;
        private readonly string _chatId;
        private readonly string _messageId;
        private readonly string _updatedContent;
        private readonly ConnectionManager _connectionManager;

        public UpdateMessageCommand(IChatService chatService, IHubContext<ChatHub, IChatClient> hubContext,
            ConnectionManager connectionManager,
            string chatId, string messageId, string updatedContent)
        {
            _chatService = chatService;
            _hubContext = hubContext;
            _connectionManager = connectionManager;
            _chatId = chatId;
            _messageId = messageId;
            _updatedContent = updatedContent;
        }

        public async Task Execute()
        {
            var success = await _chatService.UpdateMessage(_chatId, _messageId, _updatedContent);
            if (!success)
            {
                return;
            }

            var msgDto = await _chatService.GetMessageById(_chatId, _messageId);
            if (msgDto == null)
            {
                return;
            }

            if (string.IsNullOrWhiteSpace(msgDto.Receiver))
            {
                await _hubContext.Clients.All.MessageUpdated(msgDto);
                return;
            }

            var clientsToSend = GetClientsToSend(msgDto.Receiver ?? string.Empty, msgDto.Sender);
            await SendMessageToClients(clientsToSend, msgDto);
        }

        private List<string> GetClientsToSend(string receiver, string sender)
        {
            var connectionIds = new List<string> { _connectionManager.TryGetByUserName(sender) };

            if (!string.IsNullOrWhiteSpace(receiver))
            {
                connectionIds.Add(_connectionManager.TryGetByUserName(receiver));
            }
            
            return connectionIds;
        }

        private async Task SendMessageToClients(IReadOnlyList<string> clientsToSend, MessageDto msgDto)
        {
            await _hubContext.Clients.Clients(clientsToSend).MessageUpdated(msgDto);
        }
    }
}
