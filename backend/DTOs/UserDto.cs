namespace backend.DTOs;

public class UserDto
{
    public string Username { get; set; }
    public string Password { get; set; }
    
    public UserDto(string username, string password)
    {
        Username = username;
        Password = password;
    }
}