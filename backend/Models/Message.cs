using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class Message
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }
    
    [BsonElement("from")]
    public string From { get; set; }

    [BsonElement("to")]
    public string To { get; set; }
    
    [BsonElement("content")]
    public string Content { get; set; }
    
    [BsonElement("sentAt")]
    public DateTime SentAt { get; set; }
}