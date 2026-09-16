using MeditestApi.Models;

namespace MeditestApi.Services;

public class SaleService
{
    private readonly JsonFileStore<SaleRecord> _store;
    private readonly MedicineService _medicineService;

    public SaleService(JsonFileStore<SaleRecord> store, MedicineService medicineService)
    {
        _store = store;
        _medicineService = medicineService;
    }

    public async Task<List<SaleRecord>> GetAllAsync()
    {
        var sales = await _store.ReadAllAsync();
        return sales.OrderByDescending(s => s.SaleDate).ToList();
    }

    /// <summary>
    /// Records a sale and decrements the medicine's stock quantity.
    /// Returns null if the medicine doesn't exist or there isn't enough stock.
    /// </summary>
    public async Task<SaleRecord?> RecordSaleAsync(Guid medicineId, int quantitySold)
    {
        if (quantitySold <= 0)
        {
            return null;
        }

        var medicine = await _medicineService.GetByIdAsync(medicineId);
        if (medicine is null)
        {
            return null;
        }

        var stockReduced = await _medicineService.ReduceStockAsync(medicineId, quantitySold);
        if (!stockReduced)
        {
            return null;
        }

        var sale = new SaleRecord
        {
            MedicineId = medicine.Id,
            MedicineName = medicine.FullName,
            QuantitySold = quantitySold,
            UnitPrice = medicine.Price,
            SaleDate = DateTime.UtcNow
        };

        var sales = await _store.ReadAllAsync();
        sales.Add(sale);
        await _store.WriteAllAsync(sales);

        return sale;
    }
}
