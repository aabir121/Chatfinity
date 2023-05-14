using backend.Interfaces;

namespace backend.Commands;

public class CommandExecutor : ICommandExecutor
{
    public async Task ExecuteAsync(ICommand messageCommand)
    {
        await Task.Run(() =>
        {
            messageCommand.Execute();
        });
    }
}