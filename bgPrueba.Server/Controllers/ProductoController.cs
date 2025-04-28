using bgPrueba.Server.ActionModels;
using bgPrueba.Server.Interfaces;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace bgPrueba.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoController : ControllerBase
    {
        private readonly IProductoService _productoService;

        public ProductoController(IProductoService productoService)
        {
            _productoService = productoService;
        }

        [HttpGet]
        [Route("[action]")]
        public IEnumerable<GetProducto> GetProductos()
        {
            return _productoService.GetProductos();
        }

        [HttpPost]
        [Route("[action]")]
        [Authorize(Roles = "Admin,Guardalmacen")]
        public async Task<IActionResult> CreateProducto([FromBody] ProductoInterface model)
        {
            var res = await _productoService.CreateProducto(model);
            if (res.Status == "Error")
            {
                return StatusCode(StatusCodes.Status500InternalServerError, res);
            }
            return Ok(res);
        }

        [HttpPut]
        [Route("[action]")]
        [Authorize(Roles = "Admin,Guardalmacen")]
        public async Task<IActionResult> UpdateProducto([FromBody] ProductoInterface model)
        {
            var res = await _productoService.UpdateProducto(model);
            if (res.Status == "Error")
            {
                return StatusCode(StatusCodes.Status500InternalServerError, res);
            }
            return Ok(res);
        }

        [HttpDelete]
        [Route("[action]/{id}")]
        [Authorize(Roles = "Admin,Guardalmacen")]
        public async Task<IActionResult> DeleteProducto(int id)
        {
            var res = await _productoService.DeleteProducto(id);
            if (res.Status == "Error")
            {
                return StatusCode(StatusCodes.Status500InternalServerError, res);
            }
            return Ok(res);
        }
    }
}
