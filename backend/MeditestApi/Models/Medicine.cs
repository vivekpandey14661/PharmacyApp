namespace MeditestApi.Models;

public class Medicine
{
    public Guid Id { get; set; } = Guid.NewGuid();

    /// <summary>Full name of the medicine.</summary>
    public string FullName { get; set; } = string.Empty;

    public string Notes { get; set; } = string.Empty;

    public DateTime ExpiryDate { get; set; }

    public int Quantity { get; set; }

    /// <summary>Price, stored with 2 decimal places.</summary>
    public decimal Price { get; set; }

    public string Brand { get; set; } = string.Empty;
}
