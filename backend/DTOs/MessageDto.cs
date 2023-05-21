using System.Text.Json.Serialization;

namespace backend.DTOs;

public class MessageDto
{
    [JsonPropertyName("id")]
    public string? Id { get; set; }
    [JsonPropertyName("sender")]
    public string Sender { get; set; }
    [JsonPropertyName("receiver")]
    public string? Receiver { get; set; }
    [JsonPropertyName("content")]
    public string Content { get; set; }
    [JsonPropertyName("timestamp")]
    public DateTime? TimeStamp { get; set; }

    [JsonPropertyName("isUpdated")]
    public bool IsUpdated { get; set; } = false;

    public MessageDto(string id, string sender, string receiver, string content, DateTime timeStamp, bool isUpdated)
    {
        Id = id;
        Sender = sender;
        Receiver = receiver;
        Content = content;
        TimeStamp = timeStamp;
        IsUpdated = isUpdated;
    }

    public MessageDto(string sender, string? receiver, string content)
    {
        Sender = sender;
        Receiver = receiver ?? "";
        Content = content;
        IsUpdated = false;
    }
}