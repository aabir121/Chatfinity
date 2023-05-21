using backend.DTOs;
using backend.Enums;
using backend.ErrorManagement.Exceptions;
using backend.Models;
using backend.Repositories;
using MongoDB.Bson;

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
    
    public async Task<ChatDto?> GetPublicMessages()
    {
        var publicChat = await _chatRepository.GetOrCreatePublicChatAsync();
        
        return publicChat is null ? null : PrepareChatDto(publicChat);
    }

    public async Task<ChatDto?> GetPrivateMessagesByParticipants(string userName1, string userName2)
    {
        ValidateUserName(userName1);
        ValidateUserName(userName2);
        
        var privateChat = await _chatRepository.GetOrCreatePrivateChatAsync(userName1, userName2);
        return privateChat is null ? null : PrepareChatDto(privateChat);
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

    public async Task<bool> UpdateMessage(string chatId, string messageId, string updatedContent)
    {
        if (!ObjectId.TryParse(chatId, out var chatObjectId) || !ObjectId.TryParse(messageId, out var messageObjectId))
        {
            return false;
        }

        return await _chatRepository.UpdateMessageContent(chatObjectId, messageObjectId, updatedContent);
    }

    public async Task<bool> DeleteMessage(string chatId, string messageId)
    {
        if (!ObjectId.TryParse(chatId, out var chatObjectId) || !ObjectId.TryParse(messageId, out var messageObjectId))
        {
            return false;
        }

        return await _chatRepository.DeleteMessageFromChatByIdAsync(chatObjectId, messageObjectId);
    }

    public async Task<MessageDto?> GetMessageById(string chatId, string messageId)
    {
        if (!ObjectId.TryParse(chatId, out var chatObjectId) || !ObjectId.TryParse(messageId, out var messageObjectId))
        {
            return null;
        }

        var message = await _chatRepository.GetMessageById(chatObjectId, messageObjectId);

        return message is null ? null : new MessageDto(message.Id.ToString(), message.Sender, message.Receiver, message.Content, message.Timestamp);
    }

    private static ChatDto? PrepareChatDto(Chat chat)
    {
        var messages = chat.Messages            
            .Select(msg => new MessageDto(
                msg.Id.ToString(),
                msg.Sender,
                msg.Receiver ?? "",
                msg.Content,
                msg.Timestamp))
            .ToList();

        return new ChatDto(chat.Id.ToString(), chat.Type, messages);
    }

    private void ValidateUserName(string userName)
    {
        if (!_userService.IsUserNameValid(userName))
        {
            throw new NotFoundException($"User with {userName} does not exist");
        }
    }
}