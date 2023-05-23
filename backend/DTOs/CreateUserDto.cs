using System.Text.Json.Serialization;

namespace backend.DTOs;

public class CreateUserDto
{
    [JsonPropertyName("userName")]
    public string UserName { get; set; }

    [JsonPropertyName("firstName")]
    public string FirstName { get; set; }

    [JsonPropertyName("lastName")]
    public string LastName { get; set; }

    [JsonPropertyName("dateOfBirth")]
    public DateTime DateOfBirth { get; set; }

    [JsonPropertyName("password")]
    public string Password { get; set; }
    
    [JsonPropertyName("avatar")]
    public string Avatar { get; set; }
}