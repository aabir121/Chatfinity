namespace backend.DTOs;

public class LogoutUserDto
{
    public LogoutUserDto(string userName)
    {
        UserName = userName;
    }

    public string UserName { get; set; }
}