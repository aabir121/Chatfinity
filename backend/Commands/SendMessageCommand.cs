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

        public SendMessageCommand(IChatService chatService, IHubContext<ChatHub, IChatClient> hubContext,
            CreateMessageDto message)
        {
            _chatService = chatService;
            _hubContext = hubContext;
            _message = message;
        }

        public async Task Execute()
        {
            if (!Enum.TryParse(_message.Type, true, out ChatType chatType))
            {
                return;
            }

            _message.TimeStamp = DateTime.Now;

            string[] participants;
            switch (chatType)
            {
                case ChatType.Public:
                    participants = new[] { _message.Sender };
                    _message.Receiver = string.Empty;
                    break;
                case ChatType.Private:
                    participants = new[] { _message.Sender, _message.Receiver ?? string.Empty };
                    break;
                default:
                    return;
            }

            await _chatService.CreateMessage(chatType.ToString(), participants, _message);
            await _hubContext.Clients.All.ReceiveMessage(_message);
        }
    }
}