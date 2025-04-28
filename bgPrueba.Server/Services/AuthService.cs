using bgPrueba.Server.ActionModels;
using bgPrueba.Server.DbContext;
using bgPrueba.Server.Interfaces;
using Microsoft.AspNetCore.Identity;
using Microsoft.IdentityModel.Tokens;
using System.Data;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Text;

namespace bgPrueba.Server.Services
{
    public class AuthService : IAuthService
    {
        private readonly SignInManager<IdentityUser> _signInManager;
        private readonly UserManager<IdentityUser> _userManager;
        private readonly IConfiguration _configuration;

        public AuthService(SignInManager<IdentityUser> signInManager, UserManager<IdentityUser> userManager, IConfiguration configuration)
        {
            _signInManager = signInManager;
            _userManager = userManager;
            _configuration = configuration;
        }

        public async Task<AuthResponse> Login(LoginInterface model)
        {
            AuthResponse response = new AuthResponse();
            try
            {
                var usuario_exist = await _userManager.FindByEmailAsync(model.email);
                if (usuario_exist == null)
                {
                    response.setError("Usuario no encontrado.");
                    return response;
                }

                if(usuario_exist.UserName == null)
                {
                    response.setError("Username del usuario no ha sido definido.");
                    return response;
                }

                var result = await _signInManager.PasswordSignInAsync(usuario_exist.UserName, model.password, isPersistent: false, lockoutOnFailure: false);

                if (result.Succeeded)
                {
                    var usuario_roles = await _userManager.GetRolesAsync(usuario_exist);

                    var authClaims = new List<Claim>
                    {
                        new Claim("id", usuario_exist.Id ?? ""),
                        new Claim("usuario", usuario_exist.UserName ?? ""),
                        new Claim("email", usuario_exist.Email ?? ""),
                        new Claim(JwtRegisteredClaimNames.Jti, Guid.NewGuid().ToString()),
                    };

                    foreach (var item in usuario_roles)
                    {
                        authClaims.Add(new Claim("role", item));
                    }

                    var token = GetToken(authClaims);

                    var usuario = new
                    {
                        id = usuario_exist.Id,
                        email = usuario_exist.Email,
                        username = usuario_exist.UserName,
                        roles = usuario_roles.First(),
                        token = new JwtSecurityTokenHandler().WriteToken(token),
                        expiration = token.ValidTo
                    };

                    response.setSuccess("Login realizado correctamente",usuario);
                }
                else
                {
                    response.setError("No ha sido posible validar el usuario. Contraseña incorrecta.");
                }

                return response;
            }
            catch(Exception ex)
            {
                response.setError("Error logeando el usuario.");
                return response;
            }
        }

        public async Task<ObjectResponse> Logout()
        {
            ObjectResponse response = new ObjectResponse();
            try
            {
                await _signInManager.SignOutAsync();

                response.setObjectResponse("S", "Logout realizado con exito.", true);
                return response;
            }
            catch
            {
                response.setObjectResponse("E", "Logout realizado con exito.", true);
                return response;
            }
        }

        private JwtSecurityToken GetToken(List<Claim> authClaims)
        {
            var authSigningKey = new SymmetricSecurityKey(Encoding.UTF8.GetBytes(_configuration["JWT:Secret"]));

            var token = new JwtSecurityToken(
                issuer: _configuration["JWT:ValidIssuer"],
                audience: _configuration["JWT:ValidAudience"],
                expires: DateTime.Now.AddHours(3),
                claims: authClaims,
                signingCredentials: new SigningCredentials(authSigningKey, SecurityAlgorithms.HmacSha256)
                );

            return token;
        }
    }
}
