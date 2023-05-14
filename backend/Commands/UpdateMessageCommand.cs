using backend.Services;

namespace backend.Commands;

public class UpdateMessageCommand
{
    private readonly IChatService _chatService;
    private readonly string _messageId;
    private readonly string _updatedContent;

    public UpdateMessageCommand(IChatService chatService, string messageId, string updatedContent)
    {
        _chatService = chatService;
        _messageId = messageId;
        _updatedContent = updatedContent;
    }

    public async Task Execute()
    {
        // await _chatService.UpdateMessage(_messageId, _updatedContent);
    }
}