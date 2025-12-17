using server.Models;

namespace server.Services
{
    public class InMemoryDataStore
    {
        public List<Product> Products { get; set; } = new();
        public List<Order> Orders { get; set; } = new();
    }

    public class DataSeeder
    {
        // Đường dẫn Image là relative URL dưới wwwroot (ví dụ: wwwroot/images/cafe-den.jpg => /images/cafe-den.jpg)
        private static readonly List<Product> DefaultProducts = new()
        {
            new Product { Id = 1, Image = "/images/cafe-den.jpg", Name = "Cà phê đen", Price = 25000M },
            new Product { Id = 2, Image = "/images/tra-chanh.jpg", Name = "Trà chanh", Price = 20000M },
            new Product { Id = 3, Image = "/images/banh-mi-thit.jpg", Name = "Bánh mì thịt", Price = 35000M },
            new Product { Id = 4, Image = "/images/banh-ngot.jpg", Name = "Bánh ngọt", Price = 30000M },
            new Product { Id = 5, Image = "/images/sinh-to-xoai.jpg", Name = "Sinh tố xoài", Price = 40000M },
            new Product { Id = 6, Image = "/images/nuoc-suoi.jpg", Name = "Nước suối", Price = 10000M }
        };

        public static void Seed(InMemoryDataStore store)
        {
            if (!store.Products.Any())
            {
                store.Products.AddRange(DefaultProducts);
            }
        }
    }
}

