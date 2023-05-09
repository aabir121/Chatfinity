using backend.Enums;
using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class Chat
{
    [BsonId]
    public ObjectId Id { get; set; }

    [BsonElement("type")]
    [EnumValidation(typeof(ChatType))]
    public int Type { get; set; }

    [BsonElement("participants")]
    public List<string> Participants { get; set; }

    [BsonElement("messages")]
    public List<Message> Messages { get; set; }

    public Chat(int type, List<string> participants, List<Message> messages)
    {
        Type = type;
        Participants = participants;
        Messages = messages;
    }
}