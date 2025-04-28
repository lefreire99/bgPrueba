using bgPrueba.Server.ActionModels;
using bgPrueba.Server.DbContext;
using bgPrueba.Server.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace bgPrueba.Server.Services
{
    public class UsuarioService : IUsuarioService
    {
        private readonly UserManager<IdentityUser> _userManager;
        private readonly ILogger<UsuarioService> _logger;

        public UsuarioService(UserManager<IdentityUser> userManager, ILogger<UsuarioService> logger)
        {
            _userManager = userManager;
            _logger = logger;
        }

        public async Task<Response> CreateUsuario(Usuario model)
        {
            Response response = new Response();
            try
            {
                var usuario_exist = await _userManager.FindByEmailAsync(model.email);
                if (usuario_exist != null)
                {
                    if (usuario_exist.UserName?.ToLower() == model.username.ToLower())
                    {
                        response.setError("Nombre de usuario ya pertenece a un usuario existente.");
                        return response;
                    }

                    response.setError("Correo ya pertenece a un usuario existente.");
                    return response;
                }

                if(model.tipo != "G" && model.tipo != "A")
                {
                    response.setError("El tipo de usuario no es el correcto.");
                    return response;
                }

                string tipo = model.tipo == "A" ? "Admin" : "Guardalmacen";

                var nuevo_usuario = new IdentityUser
                {
                    UserName = model.username,
                    Email = model.email,
                    EmailConfirmed = true
                };

                var result = await _userManager.CreateAsync(nuevo_usuario, model.password);

                if (result.Succeeded)
                {
                    // You can also assign roles here if needed
                    result = await _userManager.AddToRoleAsync(nuevo_usuario, tipo);
                    if (result.Succeeded)
                    {
                        response.setSuccess("Usuario creado correctamente.");
                        return response;
                    }
                    else
                    {
                        await _userManager.DeleteAsync(nuevo_usuario);
                        response.setError("No ha sido posible asignar el rol.");
                        return response;
                    }
                }
                else
                {
                    string errors_message = "";
                    foreach (var error in result.Errors)
                    {
                        errors_message += $"{error.Description}.";
                    }
                    response.setError($"No ha sido posible crear el usuario.{errors_message}");
                    return response;
                }

            }
            catch(Exception ex)
            {
                _logger.LogError($"Personalized: {ex.Message}");
                response.SetServerError();
                return response;
            }
        }

    }
}
