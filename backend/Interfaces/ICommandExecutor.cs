using backend.Commands;

namespace backend.Interfaces;

public interface ICommandExecutor
{
    Task ExecuteAsync(ICommand messageCommand);
}