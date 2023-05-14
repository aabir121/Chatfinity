namespace backend.Commands;

public interface ICommand
{
    Task Execute();
}