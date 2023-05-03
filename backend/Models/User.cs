using MongoDB.Bson;
using MongoDB.Bson.Serialization.Attributes;

namespace backend.Models;

public class User
{
    [BsonId]
    [BsonRepresentation(BsonType.ObjectId)]
    public string? Id { get; set; }

    [BsonElement("username")] public string UserName { get; set; }

    [BsonElement("firstName")] public string FirstName { get; set; }

    [BsonElement("lastName")] public string LastName { get; set; }

    [BsonElement("dob")] public DateTime DateOfBirth { get; set; }

    [BsonElement("pwd")] public string Password { get; set; }
}