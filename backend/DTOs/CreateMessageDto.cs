namespace backend.DTOs;

public class CreateMessageDto : MessageDto
{
    public string Type { get; set; }
    
    public CreateMessageDto(string type, string sender, string receiver, string content) : base(sender, receiver, content)
    {
        Type = type;
    }
}