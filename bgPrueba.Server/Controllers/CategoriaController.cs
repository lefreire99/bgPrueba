using bgPrueba.Server.ActionModels;
using bgPrueba.Server.Interfaces;
using bgPrueba.Server.Services;
using Microsoft.AspNetCore.Authorization;
using Microsoft.AspNetCore.Mvc;

namespace bgPrueba.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class CategoriaController : ControllerBase
    {
        private readonly ICategoriaService _categoriaService;

        public CategoriaController(ICategoriaService categoriaService)
        {
            _categoriaService = categoriaService;
        }

        [HttpGet]
        [Route("[action]")]
        public IEnumerable<OptionInterface> GetCategoriasOptions()
        {
            return _categoriaService.GetCategoriasOptions();
        }

        [HttpPost]
        [Route("[action]")]
        [Authorize(Roles = "Admin")]
        public async Task<IActionResult> CreateCategoria([FromBody] CategoriaInterface model)
        {
            var res = await _categoriaService.CreateCategoria(model);
            if (res.Status == "Error")
            {
                return StatusCode(StatusCodes.Status500InternalServerError, res);
            }
            return Ok(res);
        }
    }
}
