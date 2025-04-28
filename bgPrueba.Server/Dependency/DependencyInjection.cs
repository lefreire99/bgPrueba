using bgPrueba.Server.Interfaces;
using bgPrueba.Server.Services;

namespace bgPrueba.Server.Dependency
{
    public static class DependencyInjection
    {
        public static IServiceCollection AddApplication(this IServiceCollection services)
        {
            services.AddScoped<IUsuarioService, UsuarioService>();
            services.AddScoped<IRolService, RolService>();
            services.AddScoped<ICategoriaService, CategoriaService>();
            services.AddScoped<IProductoService, ProductoService>();
            services.AddScoped<IProductoMovimientoService, ProductoMovimientoService>();
            services.AddScoped<IAuthService, AuthService>();

            return services;
        }
    }
}
