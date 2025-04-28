using bgPrueba.Server.ActionModels;
using bgPrueba.Server.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace bgPrueba.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class ProductoMovimientoController : ControllerBase
    {
        private readonly IProductoMovimientoService _productoMovimientoService;

        public ProductoMovimientoController(IProductoMovimientoService productoMovimientoService)
        {
            _productoMovimientoService = productoMovimientoService;
        }

        [HttpPost]
        [Route("[action]")]
        //[Authorize(Roles = "DIRECTOR DE PROYECTO,ASISTENTE DE PROYECTO,COORDINADOR POA")]
        public async Task<IActionResult> RegisterEntradaSalida([FromBody] ProductoMovimientoInterface model)
        {
            var res = await _productoMovimientoService.RegisterEntradaSalida(model);
            if (res.Status == "Error")
            {
                return StatusCode(StatusCodes.Status500InternalServerError, res);
            }
            return Ok(res);
        }
    }
}
