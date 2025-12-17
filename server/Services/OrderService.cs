using server.Models;

namespace server.Services
{
    public class OrderService
    {
        private readonly InMemoryDataStore _store;

        public OrderService(InMemoryDataStore store)
        {
            _store = store;
        }

        /// <summary>
        /// Validate product IDs - check if list is not empty
        /// </summary>
        public (bool IsValid, string? ErrorMessage) ValidateProductIds(List<int> productIds)
        {
            if (productIds == null || !productIds.Any())
                return (false, "Product list cannot be empty.");
            
            return (true, null);
        }

        /// <summary>
        /// Build order products list from product IDs
        /// </summary>
        public (bool IsValid, List<Product>? Products, string? ErrorMessage) BuildOrderProducts(List<int> productIds)
        {
            var orderProducts = new List<Product>();
            
            foreach (var id in productIds)
            {
                var product = _store.Products.FirstOrDefault(p => p.Id == id);
                if (product == null)
                    return (false, null, $"Product with ID {id} not found.");

                orderProducts.Add(product);
            }

            return (true, orderProducts, null);
        }

        /// <summary>
        /// Generate next order ID
        /// </summary>
        public int GenerateOrderId()
        {
            return _store.Orders.Count > 0 ? _store.Orders.Max(o => o.Id) + 1 : 1;
        }

        /// <summary>
        /// Create a new order from products list
        /// </summary>
        public Order CreateOrder(List<Product> products)
        {
            var orderId = GenerateOrderId();
            
            return new Order
            {
                Id = orderId,
                Products = products,
                TotalAmount = products.Sum(p => p.Price),
                PaymentTime = DateTime.UtcNow
            };
        }

        /// <summary>
        /// Save order to store and return it
        /// </summary>
        public Order SaveOrder(Order order)
        {
            _store.Orders.Add(order);
            return order;
        }
    }
}
