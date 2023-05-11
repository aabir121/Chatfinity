namespace backend.DTOs;

public class ChatUserDto
{
    public string UserName { get; set; }
    public string FullName { get; set; }
    public bool IsOnline { get; set; }
    public DateTime? LastOnline { get; set; }

    public ChatUserDto(string userName, string firstName, string lastName, DateTime? lastOnline, bool isOnline)
    {
        UserName = userName;
        FullName = firstName + " " + lastName;
        IsOnline = isOnline;
        LastOnline = lastOnline;
    }
}