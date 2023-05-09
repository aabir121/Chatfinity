using System.ComponentModel.DataAnnotations;

namespace backend.Enums;

public class EnumValidationAttribute : ValidationAttribute
{
    private readonly Type _enumType;

    public EnumValidationAttribute(Type enumType)
    {
        _enumType = enumType;
    }

    protected override ValidationResult? IsValid(object? value, ValidationContext validationContext)
    {
        if (value != null && !Enum.IsDefined(_enumType, value))
        {
            return new ValidationResult($"Invalid value '{value}' for {validationContext.MemberName}. " +
                                        $"Valid values are: {string.Join(", ", Enum.GetNames(_enumType))}.");
        }

        return ValidationResult.Success;
    }
}