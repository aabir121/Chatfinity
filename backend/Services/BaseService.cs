using backend.Models;
using MongoDB.Driver;

namespace backend.Services;

public abstract class BaseService<T>
{
    protected readonly IMongoCollection<T> Collection;

    protected BaseService(IMongoDbConfig config)
    {
        var mongoClient = new MongoClient(
            config.ConnectionString);

        var mongoDatabase = mongoClient.GetDatabase(
            config.DatabaseName);

        Collection = mongoDatabase.GetCollection<T>(GetCollectionName(config));
    }

    private static string GetCollectionName(IMongoDbConfig config)
    {
        return typeof(T).Name switch
        {
            nameof(User) => config.UsersCollectionName,
            nameof(Message) => config.MessageCollectionName,
            _ => throw new ArgumentException($"Unsupported type {typeof(T).Name}")
        };
    }
}