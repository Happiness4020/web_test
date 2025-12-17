using Microsoft.AspNetCore.Mvc;
using Microsoft.AspNetCore.SignalR;
using server.Services;
using server.Models;
using server.Hubs;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class OrdersController : ControllerBase
    {
        private readonly InMemoryDataStore _store;
        private readonly OrderService _orderService;
        private readonly IHubContext<OrderHub> _hubContext;

        public OrdersController(InMemoryDataStore store, OrderService orderService, IHubContext<OrderHub> hubContext)
        {
            _store = store;
            _orderService = orderService;
            _hubContext = hubContext;
        }

        [HttpGet]
        public ActionResult<List<Order>> Get()
        {
            return _store.Orders.OrderByDescending(o => o.PaymentTime).ToList();
        }

        [HttpPost]
        public async Task<ActionResult<Order>> Post([FromBody] List<int> productIds)
        {
            // Validate product IDs
            var (isValidIds, idError) = _orderService.ValidateProductIds(productIds);
            if (!isValidIds)
                return BadRequest(idError);

            // Build order products list
            var (isValidProducts, products, productError) = _orderService.BuildOrderProducts(productIds);
            if (!isValidProducts)
                return BadRequest(productError);

            // Create and save order
            var newOrder = _orderService.CreateOrder(products!);
            _orderService.SaveOrder(newOrder);

            // Broadcast new order via SignalR
            await _hubContext.Clients.All.SendAsync("NewOrder", newOrder);

            return CreatedAtAction(nameof(Get), new { id = newOrder.Id }, newOrder);
        }
    }
}

