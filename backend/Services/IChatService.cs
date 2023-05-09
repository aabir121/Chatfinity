using backend.DTOs;

namespace backend.Services;

public interface IChatService
{
    Task<List<MessageDto>?> GetPublicMessages();

    Task<List<MessageDto>?> GetPrivateMessagesByParticipants(string userName1, string userName2);

    Task<MessageDto?> CreateMessage(string chatType, string[] participants, MessageDto newMessage);
}