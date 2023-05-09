using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class Message
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public ObjectId Id { get; set; }
    
    [BsonElement("sender")]
    public string Sender { get; set; }

    [BsonElement("receiver")]
    public string? Receiver { get; set; }

    [BsonElement("content")]
    public string Content { get; set; }

    [BsonElement("timestamp")]
    public DateTime Timestamp { get; set; }

    public Message(string sender, string receiver, string content, DateTime timestamp)
    {
        Sender = sender;
        Receiver = receiver;
        Content = content;
        Timestamp = timestamp;
    }
}