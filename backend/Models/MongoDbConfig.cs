namespace backend.Models;

public class MongoDbConfig : IMongoDbConfig
{
    public string UsersCollectionName { get; set; }
    public string ChatCollectionName { get; set; }
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
}

public interface IMongoDbConfig
{
    public string UsersCollectionName { get; set; }
    public string ChatCollectionName { get; set; }
    public string ConnectionString { get; set; }
    public string DatabaseName { get; set; }
}