using backend.DTOs;
using backend.Hubs;
using backend.Services;
using Microsoft.AspNetCore.SignalR;

namespace backend.Commands
{
    public class DeleteMessageCommand : ICommand
    {
        private readonly IHubContext<ChatHub, IChatClient> _hubContext;
        private readonly IChatService _chatService;
        private readonly ConnectionManager _connectionManager;
        private readonly string _chatId;
        private readonly string _messageId;

        public DeleteMessageCommand(
            IChatService chatService,
            IHubContext<ChatHub, IChatClient> hubContext,
            ConnectionManager connectionManager,
            string chatId,
            string messageId)
        {
            _chatService = chatService;
            _hubContext = hubContext;
            _connectionManager = connectionManager;
            _chatId = chatId;
            _messageId = messageId;
        }

        public async Task Execute()
        {
            var message = await _chatService.GetMessageById(_chatId, _messageId);
            if (message is null)
            {
                return;
            }

            var participants = GetChatParticipants(message);
            var connectionIds = GetConnectionIds(participants);

            await _chatService.DeleteMessage(_chatId, _messageId);

            var broadCastFunc = connectionIds.Count > 1
                ? _hubContext.Clients.Clients(connectionIds)
                : _hubContext.Clients.All;
            
            await broadCastFunc.MessageDeleted(_chatId, _messageId);
        }

        private static IEnumerable<string> GetChatParticipants(MessageDto message)
        {
            return string.IsNullOrWhiteSpace(message.Receiver) ? 
                new[] { message.Sender } : new[] { message.Sender, message.Receiver };
        }

        private List<string> GetConnectionIds(IEnumerable<string> participants)
        {
            return participants.Select(participant => 
                _connectionManager.TryGetByUserName(participant)).ToList();
        }
    }
}
