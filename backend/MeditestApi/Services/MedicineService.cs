using MeditestApi.Models;

namespace MeditestApi.Services;

public class MedicineService
{
    private readonly JsonFileStore<Medicine> _store;

    public MedicineService(JsonFileStore<Medicine> store)
    {
        _store = store;
    }

    public async Task<List<Medicine>> GetAllAsync(string? search = null)
    {
        var medicines = await _store.ReadAllAsync();

        if (!string.IsNullOrWhiteSpace(search))
        {
            var term = search.Trim();
            medicines = medicines.Where(m =>
                    Contains(m.FullName, term) ||
                    Contains(m.Brand, term) ||
                    Contains(m.Notes, term))
                .ToList();
        }

        return medicines.OrderBy(m => m.FullName).ToList();
    }

    private static bool Contains(string source, string term) =>
        source.Contains(term, StringComparison.OrdinalIgnoreCase);

    public async Task<Medicine?> GetByIdAsync(Guid id)
    {
        var medicines = await _store.ReadAllAsync();
        return medicines.FirstOrDefault(m => m.Id == id);
    }

    public async Task<Medicine> AddAsync(Medicine medicine)
    {
        var medicines = await _store.ReadAllAsync();
        medicine.Id = Guid.NewGuid();
        medicine.Price = Math.Round(medicine.Price, 2);
        medicines.Add(medicine);
        await _store.WriteAllAsync(medicines);
        return medicine;
    }

    /// <summary>Reduces stock quantity for a medicine when a sale is recorded. Returns false if not enough stock.</summary>
    public async Task<bool> ReduceStockAsync(Guid medicineId, int quantitySold)
    {
        var medicines = await _store.ReadAllAsync();
        var medicine = medicines.FirstOrDefault(m => m.Id == medicineId);
        if (medicine is null || medicine.Quantity < quantitySold)
        {
            return false;
        }

        medicine.Quantity -= quantitySold;
        await _store.WriteAllAsync(medicines);
        return true;
    }
}
