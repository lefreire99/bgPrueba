using bgPrueba.Server.ActionModels;
using bgPrueba.Server.Interfaces;
using Microsoft.AspNetCore.Identity;
using System.Data;

namespace bgPrueba.Server.Services
{
    public class RolService : IRolService
    {
        private readonly RoleManager<IdentityRole> _roleManager;

        public RolService(RoleManager<IdentityRole> roleManager)
        {
            _roleManager = roleManager;
        }

        public async Task<Response> CreateRol(Rol model)
        {
            Response response = new Response();
            try
            {
                var exist = await _roleManager.RoleExistsAsync(model.rolname);
                if (exist)
                {
                    response.setError("Rol ya existe.");
                    return response;
                }
                IdentityResult result = await _roleManager.CreateAsync(new IdentityRole(model.rolname));
                if (result.Succeeded)
                {
                    response.setSuccess("Rol creado exitosamente.");
                    return response;
                }
                else
                {
                    response.setError("No ha sido posible crear el rol");
                    return response;
                }
            }
            catch(Exception ex)
            {
                response.SetServerError();
                return response;
            }
        }

    }
}
