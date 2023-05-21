using backend.Enums;

namespace backend.DTOs;

public class ChatDto
{
    public string? Id { get; set; }
    public string Type { get; set; }
    public List<MessageDto> Messages { get; set; }

    public ChatDto(string? id, int type, List<MessageDto> messages)
    {
        Id = id;
        Type = GetChatTypeString(type);
        Messages = messages;
    }
    
    private static string GetChatTypeString(int type)
    {
        if (Enum.IsDefined(typeof(ChatType), type))
        {
            return Enum.GetName(typeof(ChatType), type)?.ToLower() ?? string.Empty;
        }
        else
        {
            throw new ArgumentException("Invalid chat type value.");
        }
    }
}