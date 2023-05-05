using backend.Models;
using backend.Services;
using Microsoft.AspNetCore.Mvc;

namespace backend.Controllers;

[ApiController]
[Route("/api/[controller]")]
public class MessageController : ControllerBase
{
    private readonly MessageService _messageService;

    public MessageController(MessageService messageService)
    {
        this._messageService = messageService;
    }
    
    [HttpGet]
    public async Task<List<Message>?> Get()
    {
        return await _messageService.GetAsync();
    }

    [HttpGet("{from}/{to}")]
    public async Task<ActionResult<List<Message>>> Get(string from, string to)
    {
        var messages = await _messageService.GetAsync(from, to);

        if (messages is null) return NotFound();

        return messages;
    }
    
    [HttpPost]
    public async Task<Message> Create(Message message)
    {
        var newMsg = await _messageService.CreateAsync(message);

        return newMsg;
    }
}