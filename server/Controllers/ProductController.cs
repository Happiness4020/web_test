using Microsoft.AspNetCore.Mvc;
using server.Services;
using server.Models;

namespace server.Controllers
{
    [ApiController]
    [Route("api/[controller]")]
    public class ProductsController : ControllerBase
    {
        private readonly InMemoryDataStore _store;
        public ProductsController(InMemoryDataStore store)
        {
            _store = store;
        }

        [HttpGet]
        public ActionResult<List<Product>> Get()
        {
            return _store.Products;
        }
    }
}

