using backend.Models;
using MongoDB.Driver;

namespace backend.Repositories;

public class RepositoryBase<T>
{
    protected readonly IMongoCollection<T> Collection;

    protected RepositoryBase(IMongoDbConfig config)
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
            nameof(Chat) => config.ChatCollectionName,
            _ => throw new ArgumentException($"Unsupported type {typeof(T).Name}")
        };
    }
}