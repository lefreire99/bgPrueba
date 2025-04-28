using bgPrueba.Server.ActionModels;
using bgPrueba.Server.DbContext;
using bgPrueba.Server.Interfaces;
using bgPrueba.Server.Models;
using Microsoft.AspNetCore.Identity;
using Microsoft.EntityFrameworkCore;

namespace bgPrueba.Server.Services
{
    public class CategoriaService : ICategoriaService
    {
        private readonly ApplicationContext _applicationContext;

        public CategoriaService(ApplicationContext applicationContext)
        {
            _applicationContext = applicationContext;
        }

        public IEnumerable<OptionInterface> GetCategoriasOptions()
        {
            return _applicationContext.Categorias.Where(x => x.Estado == "A").Select(x => new OptionInterface
            {
                value = x.Id,
                label = x.Nombre
            });
        }

        public async Task<Response> CreateCategoria(CategoriaInterface model)
        {
            Response response = new Response();
            try
            {
                var categoria_exist = await _applicationContext.Categorias.FirstOrDefaultAsync(x => x.Nombre.ToLower() == model.nombre.ToLower());
                if(categoria_exist != null)
                {
                    response.setError("Categoría ya existe.");
                    return response;
                }

                Categoria nueva_categoria = new Categoria
                {
                    Nombre = model.nombre,
                    Estado = "A"
                };

                await _applicationContext.Categorias.AddAsync(nueva_categoria);

                var result = await _applicationContext.SaveChangesAsync();

                if(result > 0)
                {
                    response.setSuccess("Categoria creada exitosamente.");
                }
                else
                {
                    response.setError("No ha sido posible crear la categoria.");
                }
                return response;

            }
            catch(Exception ex)
            {
                response.SetServerError();
                return response;
            }
        }
    }
}
