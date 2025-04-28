using bgPrueba.Server.ActionModels;
using bgPrueba.Server.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace bgPrueba.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class RolController : ControllerBase
    {
        private readonly IRolService _rolService;

        public RolController(IRolService rolService)
        {
            _rolService = rolService;
        }

        [HttpPost]
        [Route("[action]")]
        //[Authorize(Roles = "DIRECTOR DE PROYECTO,ASISTENTE DE PROYECTO,COORDINADOR POA")]
        public async Task<IActionResult> CreateRol([FromBody] Rol model)
        {
            var res = await _rolService.CreateRol(model);
            if (res.Status == "Error")
            {
                return StatusCode(StatusCodes.Status500InternalServerError, res);
            }
            return Ok(res);
        }
    }
}
