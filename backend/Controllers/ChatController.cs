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
        public async Task<ActionResult<ChatDto>> GetPublicMessages()
        {
            var chatDto = await _chatService.GetPublicMessages();

            if (chatDto == null)
            {
                return NotFound();
            }

            return chatDto;
        }

        [HttpGet("Private/{user1}/{user2}")]
        public async Task<ActionResult<ChatDto>> GetPrivateMessages(string user1, string user2)
        {
            var chatDto = await _chatService.GetPrivateMessagesByParticipants(user1, user2);

            if (chatDto == null)
            {
                return NotFound();
            }

            return chatDto;
        }
    }
}