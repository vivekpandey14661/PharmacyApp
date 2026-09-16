using System.Text.Json;

namespace MeditestApi.Services;

/// <summary>
/// Minimal thread-safe read/write wrapper around a JSON file that holds a List&lt;T&gt;.
/// Each store gets its own lock so medicines.json and sales.json don't block each other.
/// </summary>
public class JsonFileStore<T>
{
    private readonly string _filePath;
    private readonly SemaphoreSlim _lock = new(1, 1);
    private static readonly JsonSerializerOptions SerializerOptions = new()
    {
        WriteIndented = true,
        PropertyNamingPolicy = JsonNamingPolicy.CamelCase
    };

    public JsonFileStore(string filePath)
    {
        _filePath = filePath;
        var dir = Path.GetDirectoryName(_filePath);
        if (!string.IsNullOrEmpty(dir) && !Directory.Exists(dir))
        {
            Directory.CreateDirectory(dir);
        }
        if (!File.Exists(_filePath))
        {
            File.WriteAllText(_filePath, "[]");
        }
    }

    public async Task<List<T>> ReadAllAsync()
    {
        await _lock.WaitAsync();
        try
        {
            var json = await File.ReadAllTextAsync(_filePath);
            if (string.IsNullOrWhiteSpace(json)) return new List<T>();
            return JsonSerializer.Deserialize<List<T>>(json, SerializerOptions) ?? new List<T>();
        }
        finally
        {
            _lock.Release();
        }
    }

    public async Task WriteAllAsync(List<T> items)
    {
        await _lock.WaitAsync();
        try
        {
            var json = JsonSerializer.Serialize(items, SerializerOptions);
            await File.WriteAllTextAsync(_filePath, json);
        }
        finally
        {
            _lock.Release();
        }
    }
}
