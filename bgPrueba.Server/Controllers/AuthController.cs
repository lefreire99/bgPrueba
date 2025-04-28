using bgPrueba.Server.ActionModels;
using bgPrueba.Server.Interfaces;
using Microsoft.AspNetCore.Mvc;

namespace bgPrueba.Server.Controllers
{
    [Route("api/[controller]")]
    [ApiController]
    public class AuthController : ControllerBase
    {
        private readonly IAuthService _authService;

        public AuthController(IAuthService authService)
        {
            _authService = authService;
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> Login([FromBody] LoginInterface model)
        {
            var res = await _authService.Login(model);
            if (res.Status == "Error")
            {
                return StatusCode(StatusCodes.Status500InternalServerError, res);
            }
            return Ok(res.usuario);
        }

        [HttpPost]
        [Route("[action]")]
        public async Task<IActionResult> Logout()
        {
            var res = await _authService.Logout();
            if (res.Status == "Error")
            {
                return StatusCode(StatusCodes.Status500InternalServerError, res);
            }
            return Ok(res);
        }
    }
}
