using backend.DTOs;
using backend.Enums;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers
{
    [ApiController]
    [Route("/api/[controller]")]
    public class ChatController : ControllerBase
    {
        private readonly IChatService _chatService;

        public ChatController(IChatService chatService)
        {
            _chatService = chatService;
        }

        [HttpGet("Public")]
        public async Task<ActionResult<List<MessageDto>>> GetPublicMessages()
        {
            var messages = await _chatService.GetPublicMessages();

            if (messages == null)
            {
                return NotFound();
            }

            return messages;
        }

        [HttpGet("Private/{user1}/{user2}")]
        public async Task<ActionResult<List<MessageDto>>> GetPrivateMessages(string user1, string user2)
        {
            var messages = await _chatService.GetPrivateMessagesByParticipants(user1, user2);

            if (messages == null)
            {
                return NotFound();
            }

            return messages;
        }

        [HttpPost("Message")]
        public async Task<ActionResult<MessageDto>> CreateMessage(CreateMessageDto messageDto)
        {
            var participants = new[]{messageDto.Sender};
            if (messageDto.Type.Equals(ChatType.Public.ToString(), StringComparison.OrdinalIgnoreCase))
            {
                messageDto.Receiver = "";
            }
            else if (messageDto.Type.Equals(ChatType.Private.ToString(), StringComparison.OrdinalIgnoreCase))
            {
                participants = new[] { messageDto.Sender, messageDto.Receiver ?? "" };
            }
            else
            {
                return BadRequest($"Invalid chat type: {messageDto.Type}");
            }

            var newMsg = await _chatService.CreateMessage(messageDto.Type.ToLower(), participants, messageDto);

            return newMsg;
        }
    }
}