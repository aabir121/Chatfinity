using System.Net;
using System.Text.Json;
using backend.ErrorManagement.Exceptions;

namespace backend.ErrorManagement.Configurations;

public class GlobalErrorHandlingMiddleware
{
    private readonly RequestDelegate _next;

    public GlobalErrorHandlingMiddleware(RequestDelegate next)
    {
        this._next = next;
    }
    
    public async Task Invoke(HttpContext context)
    {
        try
        {
            await _next(context);
        }
        catch (Exception ex)
        {
            await HandleExceptionAsync(context, ex);
        }
    }
    
    private static Task HandleExceptionAsync(HttpContext context, Exception exception)
    {
        HttpStatusCode status;
        var stackTrace = string.Empty;
        string message;

        var exceptionType = exception.GetType();

        if (exceptionType == typeof(BadRequestException))
        {
            message = exception.Message;
            status = HttpStatusCode.BadRequest;
            stackTrace = exception.StackTrace;
        }
        else if (exceptionType == typeof(NotFoundException))
        {
            message = exception.Message;
            status = HttpStatusCode.NotFound;
            stackTrace = exception.StackTrace;
        }
        else if (exceptionType == typeof(InvalidCredentialsException))
        {
            status = HttpStatusCode.Unauthorized;
            message = exception.Message;
            stackTrace = exception.StackTrace;
        }
        else
        {
            status = HttpStatusCode.InternalServerError;
            message = exception.Message;
            stackTrace = exception.StackTrace;
        }

        var exceptionResult = JsonSerializer.Serialize(new { errorMessage = message, status= (int) status });
        context.Response.ContentType = "application/json";
        context.Response.StatusCode = (int)status;

        return context.Response.WriteAsync(exceptionResult);
    }
}