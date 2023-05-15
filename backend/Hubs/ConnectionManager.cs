using System.Collections.Concurrent;

namespace backend.Hubs;

public class ConnectionManager
{
    private readonly ConcurrentDictionary<string, string?> _connectionMap = new();

    public string TryGetByUserName(string userName)
    {
        return _connectionMap.FirstOrDefault(p => p.Value == userName).Key;
    }

    public List<string?> GetAllConnectedUserNames()
    {
        return _connectionMap.Select(pair => pair.Value).ToList();
    }

    public void AddOrUpdateConnection(string connectionId, string? username)
    {
        _connectionMap.AddOrUpdate(connectionId, username, (_, existingConnectionId) => connectionId);
    }

    public bool RemoveConnection(string connectionId, out string? username)
    {
        return _connectionMap.TryRemove(connectionId, out username);
    }

    public bool TryGetByConnectionId(string connectionId, out string? username)
    {
        return _connectionMap.TryGetValue(connectionId, out username);
    }
}
