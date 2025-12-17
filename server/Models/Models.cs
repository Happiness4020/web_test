namespace server.Models
{
    public class Product
    {
        public int Id { get; set; }
        public string Image { get; set; } = string.Empty;
        public string Name { get; set; } = string.Empty;
        public decimal Price { get; set; }
    }

    public class Order
    {
        public int Id { get; set; }
        public List<Product> Products { get; set; } = new();
        public decimal TotalAmount { get; set; }
        public DateTime PaymentTime { get; set; }
    }
}

