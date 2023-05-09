using backend.DTOs;
using backend.Enums;
using backend.ErrorManagement.Exceptions;
using backend.Models;
using backend.Repositories;

namespace backend.Services;

public class ChatService : IChatService
{
    private readonly IChatRepository _chatRepository;
    private readonly IUserService _userService;

    public ChatService(IChatRepository chatRepository, IUserService userService)
    {
        _chatRepository = chatRepository;
        _userService = userService;
    }
    
    public async Task<List<MessageDto>?> GetPublicMessages()
    {
        var publicChat = await _chatRepository.GetOrCreatePublicChatAsync();
        
        return PrepareMsgListFromChat(publicChat);
    }

    public async Task<List<MessageDto>?> GetPrivateMessagesByParticipants(string userName1, string userName2)
    {
        ValidateUserName(userName1);
        ValidateUserName(userName2);
        
        var privateChat = await _chatRepository.GetOrCreatePrivateChatAsync(userName1, userName2);
        return PrepareMsgListFromChat(privateChat);
    }

    public async Task<MessageDto?> CreateMessage(string chatType, string[] participants, MessageDto newMessage)
    {
        ValidateUserName(participants[0]);
        if (chatType.Equals(ChatType.Private.ToString(), StringComparison.OrdinalIgnoreCase))
        {
            ValidateUserName(participants[1]);
        }

        var chatObject = chatType.ToLowerInvariant() switch
        {
            "public" => await _chatRepository.GetOrCreatePublicChatAsync(),
            "private" => await _chatRepository.GetOrCreatePrivateChatAsync(participants[0], participants[1]),
            _ => throw new BadRequestException("Invalid chat type.")
        };

        if (chatObject is null) return null;

        var createdMessage = await _chatRepository.CreateMessageInChatAsync(chatObject.Id, new Message
        (
            newMessage.Sender,
            chatObject.Type == (int)ChatType.Private && newMessage.Receiver is not null ? newMessage.Receiver : "",
            newMessage.Content,
            DateTime.UtcNow
        ));

        if (createdMessage is null) return null;

        return new MessageDto
        (
            createdMessage.Id.ToString(),
            createdMessage.Sender,
            createdMessage.Receiver ?? "",
            createdMessage.Content,
            createdMessage.Timestamp
        );
    }


    private static List<MessageDto>? PrepareMsgListFromChat(Chat? chat)
    {
        return chat?.Messages
            .Select(msg => new MessageDto(
                msg.Id.ToString(),
                msg.Sender,
                msg.Receiver ?? "",
                msg.Content,
                msg.Timestamp))
            .ToList();
    }

    private void ValidateUserName(string userName)
    {
        if (!_userService.IsUserNameValid(userName))
        {
            throw new NotFoundException($"User with {userName} does not exist");
        }
    }
}