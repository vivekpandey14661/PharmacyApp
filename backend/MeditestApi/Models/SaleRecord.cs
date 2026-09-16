namespace MeditestApi.Models;

public class SaleRecord
{
    public Guid Id { get; set; } = Guid.NewGuid();

    public Guid MedicineId { get; set; }

    /// <summary>Denormalized so sale history still reads fine even if the medicine is later renamed.</summary>
    public string MedicineName { get; set; } = string.Empty;

    public int QuantitySold { get; set; }

    public decimal UnitPrice { get; set; }

    public decimal TotalAmount => Math.Round(QuantitySold * UnitPrice, 2);

    public DateTime SaleDate { get; set; } = DateTime.UtcNow;
}
