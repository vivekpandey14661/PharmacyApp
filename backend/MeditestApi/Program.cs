using MeditestApi.Models;
using MeditestApi.Services;

var builder = WebApplication.CreateBuilder(args);

const string CorsPolicy = "AllowAngularDevServer";

// The Angular dev server runs on :4200 by default; add the built SPA's own origin here too if you deploy it separately.
builder.Services.AddCors(options =>
{
    options.AddPolicy(CorsPolicy, policy =>
    {
        policy.WithOrigins("http://localhost:4200")
              .AllowAnyHeader()
              .AllowAnyMethod();
    });
});

var dataFolder = Path.Combine(builder.Environment.ContentRootPath, "Data");

builder.Services.AddSingleton(new JsonFileStore<Medicine>(Path.Combine(dataFolder, "medicines.json")));
builder.Services.AddSingleton(new JsonFileStore<SaleRecord>(Path.Combine(dataFolder, "sales.json")));
builder.Services.AddSingleton<MedicineService>();
builder.Services.AddSingleton<SaleService>();

builder.Services.AddEndpointsApiExplorer();

var app = builder.Build();

app.UseCors(CorsPolicy);

var api = app.MapGroup("/api");

// ---------- Medicines ----------

api.MapGet("/medicines", async (MedicineService service, string? search) =>
{
    var medicines = await service.GetAllAsync(search);
    return Results.Ok(medicines);
});

api.MapGet("/medicines/{id:guid}", async (MedicineService service, Guid id) =>
{
    var medicine = await service.GetByIdAsync(id);
    return medicine is null ? Results.NotFound() : Results.Ok(medicine);
});

api.MapPost("/medicines", async (MedicineService service, Medicine input) =>
{
    if (string.IsNullOrWhiteSpace(input.FullName))
    {
        return Results.BadRequest(new { message = "Full name is required." });
    }
    if (input.Quantity < 0)
    {
        return Results.BadRequest(new { message = "Quantity cannot be negative." });
    }
    if (input.Price < 0)
    {
        return Results.BadRequest(new { message = "Price cannot be negative." });
    }

    var created = await service.AddAsync(input);
    return Results.Created($"/api/medicines/{created.Id}", created);
});

// ---------- Sales ----------

api.MapGet("/sales", async (SaleService service) =>
{
    var sales = await service.GetAllAsync();
    return Results.Ok(sales);
});

api.MapPost("/sales", async (SaleService service, RecordSaleRequest input) =>
{
    if (input.QuantitySold <= 0)
    {
        return Results.BadRequest(new { message = "Quantity sold must be greater than zero." });
    }

    var sale = await service.RecordSaleAsync(input.MedicineId, input.QuantitySold);
    if (sale is null)
    {
        return Results.BadRequest(new { message = "Medicine not found or insufficient stock." });
    }

    return Results.Created($"/api/sales/{sale.Id}", sale);
});

app.Run();

record RecordSaleRequest(Guid MedicineId, int QuantitySold);
