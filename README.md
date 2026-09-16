# ABC Meditest — Medicine & Sales SPA

A single-page app for managing medicine inventory and sale records.

- **Backend:** ASP.NET Core 8 minimal Web API, data persisted to JSON files (no database).
- **Frontend:** Angular 17 (standalone components), talks to the API over HTTP.

## Project structure

```
MeditestApp/
├── backend/
│   └── MeditestApi/          .NET 8 Web API
│       ├── Data/              medicines.json, sales.json (created/seeded automatically)
│       ├── Models/            Medicine, SaleRecord
│       ├── Services/          JSON file store + business logic
│       └── Program.cs         API endpoints & CORS setup
└── frontend/
    └── meditest-spa/          Angular SPA
        └── src/app/
            ├── components/    medicine-list, add-medicine, sales
            ├── services/      HTTP clients for medicines & sales
            └── models/        TypeScript interfaces
```

## Prerequisites

- [.NET 8 SDK](https://dotnet.microsoft.com/download)
- [Node.js 18+](https://nodejs.org/) and npm
- Angular CLI: `npm install -g @angular/cli`

## 1. Run the API

```bash
cd backend/MeditestApi
dotnet run
```

The API starts at **http://localhost:5000** (see `Properties/launchSettings.json`).
On first run it seeds `Data/medicines.json` with 4 sample medicines (some already set to trigger
the red/yellow highlighting) and an empty `Data/sales.json`.

Endpoints:

| Method | Route                      | Description                                   |
|--------|-----------------------------|------------------------------------------------|
| GET    | `/api/medicines?search=`   | List medicines, optional search on name/brand/notes |
| GET    | `/api/medicines/{id}`      | Get one medicine                               |
| POST   | `/api/medicines`           | Add a medicine                                 |
| GET    | `/api/sales`                | List sale records (newest first)               |
| POST   | `/api/sales`                 | Record a sale `{ medicineId, quantitySold }` — decrements stock |

## 2. Run the Angular app

In a separate terminal:

```bash
cd frontend/meditest-spa
npm install
npm start
```

This opens the SPA at **http://localhost:4200**, which calls the API at `http://localhost:5000`
(CORS for that origin is already enabled in `Program.cs`).

## Features implemented

- **Medicine grid** — shows Full Name, Brand, Expiry Date, Quantity and Price (Notes intentionally
  excluded from the grid per the spec).
  - **Red row** when expiry date is less than 30 days away.
  - **Yellow row** when quantity in stock is less than 10 (expiry color takes priority if both apply).
- **Add Medicine** form with client + server-side validation.
- **Sale recording** — "Record Sale" button on each row opens a small dialog to enter quantity sold;
  submitting decrements stock and appends to the sale history table shown below.
- **Search** — debounced search box filtering by name, brand or notes (good-to-have requirement).

## Notes / things to adjust for production use

- Data is stored as flat JSON files with a simple in-process lock — fine for a demo/small deployment,
  not for concurrent multi-instance hosting. Swap `JsonFileStore<T>` for a real database if you need that.
- The API origin is hardcoded to `http://localhost:5000` in the Angular services
  (`src/app/services/*.service.ts`) — move this to `environment.ts` files if you need per-environment config.
- No authentication is implemented; add it before exposing this beyond a local/demo environment.
