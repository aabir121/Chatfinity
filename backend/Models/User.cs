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
    
    [BsonElement("lastOnlineTime")] public DateTime? LastOnlineTime { get; set; }
    
    [BsonElement("avatar")] public byte[]? Avatar { get; set; }
    
    public User(string? id, string userName, string firstName, string lastName, 
        DateTime dateOfBirth, string password, string avatar)
    {
        Id = id;
        UserName = userName;
        FirstName = firstName;
        LastName = lastName;
        DateOfBirth = dateOfBirth;
        Password = password;
        Avatar = Convert.FromBase64String(avatar.Substring(avatar.IndexOf(',') + 1));
    }
}