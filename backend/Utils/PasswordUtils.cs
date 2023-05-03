using System.Security.Cryptography;
using System.Text;

namespace backend.Utils;

public class PasswordUtils
{
    public static string HashString(string inputString)
    {
        using var sha256Hash = SHA256.Create();
        // Convert the input string to a byte array
        var bytes = sha256Hash.ComputeHash(Encoding.UTF8.GetBytes(inputString));

        // Convert the byte array to a hexadecimal string
        var builder = new StringBuilder();
        for (var i = 0; i < bytes.Length; i++) builder.Append(bytes[i].ToString("x2"));
        return builder.ToString();
    }
}