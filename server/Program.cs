using server.Services;
using server.Hubs;

var builder = WebApplication.CreateBuilder(args);

// Add services
builder.Services.AddSingleton<InMemoryDataStore>();
builder.Services.AddSingleton<OrderService>();
builder.Services.AddControllers();
builder.Services.AddEndpointsApiExplorer();
builder.Services.AddSwaggerGen();
builder.Services.AddCors(options =>
{
    options.AddDefaultPolicy(policy =>
        policy
            .WithOrigins(
                "http://localhost:5173",
                "http://127.0.0.1:5173"
            )
            .AllowAnyHeader()
            .AllowAnyMethod()
            .AllowCredentials()
    );
});
builder.Services.AddSignalR();

var app = builder.Build();

// Seed Products
var dataStore = app.Services.GetRequiredService<InMemoryDataStore>();
server.Services.DataSeeder.Seed(dataStore);

// Middleware
app.UseSwagger();
app.UseSwaggerUI();
app.UseCors();

// phục vụ file tĩnh (wwwroot, ví dụ ảnh trong wwwroot/images)
app.UseStaticFiles();

app.MapControllers();
app.MapHub<OrderHub>("/orderhub");

app.Run();
