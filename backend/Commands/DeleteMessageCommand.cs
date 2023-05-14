using backend.Services;

namespace backend.Commands;

public class DeleteMessageCommand
{
    private readonly IChatService _chatService;
    private readonly string _messageId;

    public DeleteMessageCommand(IChatService chatService, string messageId)
    {
        _chatService = chatService;
        _messageId = messageId;
    }

    public async Task Execute()
    {
        // await _chatService.DeleteMessage(_messageId);
    }
}