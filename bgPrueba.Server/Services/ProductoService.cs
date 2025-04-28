using bgPrueba.Server.ActionModels;
using bgPrueba.Server.DbContext;
using bgPrueba.Server.Interfaces;
using bgPrueba.Server.Models;
using Microsoft.EntityFrameworkCore;

namespace bgPrueba.Server.Services
{
    public class ProductoService : IProductoService
    {
        private readonly ApplicationContext _applicationContext;
        private readonly ILogger<ProductoService> _logger;

        public ProductoService(ApplicationContext applicationContext, ILogger<ProductoService> logger)
        {
            _applicationContext = applicationContext;
            _logger = logger;
        }

        public IEnumerable<GetProducto> GetProductos()
        {
            return _applicationContext.Productos.Include(x => x.Categoria).Where(x => x.Estado == "A").Select(x => new GetProducto
            {
                id = x.Id,
                nombre = x.Nombre,
                descripcion = x.Descripcion,
                precio = x.Precio,
                stock = x.Stock,
                id_categoria = x.Categoria.Id,
                categoria = x.Categoria.Nombre,
                estado = x.Estado
            });
        }

        public async Task<Response> CreateProducto(ProductoInterface model)
        {
            Response response = new Response();
            try
            {
                var categoria_exist = await _applicationContext.Categorias.FindAsync(model.id_categoria);
                if(categoria_exist == null)
                {
                    response.setError("Categoría no ha sido encontrada.");
                    return response;
                }

                var producto_exist = await _applicationContext.Productos.FirstOrDefaultAsync(x => x.Nombre.ToLower() == model.nombre.ToLower());
                if (producto_exist != null)
                {
                    response.setError("Producto ya existe.");
                    return response;
                }

                Producto nuevo_producto = new Producto
                {
                    Nombre = model.nombre,
                    Descripcion = model.descripcion,
                    Precio = model.precio,
                    Stock = model.stock,
                    Idcategoria = categoria_exist.Id,
                    Estado = "A"
                };

                if(model.stock > 0)
                {
                    List<ProductoMovimiento> movimiento_inicial = new List<ProductoMovimiento>();
                    movimiento_inicial.Add(new ProductoMovimiento
                    {
                        Cantidad = model.stock,
                        Tipo = "E",
                        Estado = "A"
                    });

                    nuevo_producto.Movimientos = movimiento_inicial;
                }

                await _applicationContext.Productos.AddAsync(nuevo_producto);
                var result = await _applicationContext.SaveChangesAsync();

                if(result > 0)
                {
                    response.setSuccess("Producto creado exitosamente.");
                }
                else
                {
                    response.setError("No ha sido posible crear el producto.");
                }

                return response;
            }
            catch(Exception ex)
            {
                _logger.LogError($"Personalized: {ex.Message}");
                response.SetServerError();
                return response;
            }
        }

        public async Task<Response> UpdateProducto(ProductoInterface model)
        {
            Response response = new Response();
            try
            {
                var producto_exist = await _applicationContext.Productos.FindAsync(model.id);
                if (producto_exist == null)
                {
                    response.setError("Producto no ha sido encontrada.");
                    return response;
                }

                var categoria_exist = await _applicationContext.Categorias.FindAsync(model.id_categoria);
                if (categoria_exist == null)
                {
                    response.setError("Categoría no ha sido encontrada.");
                    return response;
                }

                if (model.stock != 0 && model.stock != producto_exist.Stock)
                {
                    var nuevo_movimiento = new ProductoMovimiento
                    {
                        Idproducto = producto_exist.Id,
                        Cantidad = model.stock,
                        Tipo = "A",
                        Estado = "A"
                    };

                    await _applicationContext.ProductoMovimientos.AddAsync(nuevo_movimiento);

                }

                producto_exist.Nombre = model.nombre;
                producto_exist.Descripcion = model.descripcion;
                producto_exist.Precio = model.precio;
                producto_exist.Stock = model.stock;
                producto_exist.Idcategoria = categoria_exist.Id;

                var result = await _applicationContext.SaveChangesAsync();

                if (result > 0)
                {
                    response.setSuccess("Producto actualizado exitosamente.");
                }
                else
                {
                    response.setError("No ha sido posible actualizar el producto.");
                }

                return response;
            }
            catch (Exception ex)
            {
                _logger.LogError($"Personalized: {ex.Message}");
                response.SetServerError();
                return response;
            }
        }

        public async Task<Response> DeleteProducto(int id)
        {
            Response response = new Response();
            try
            {
                var producto_exist = await _applicationContext.Productos.FindAsync(id);
                if (producto_exist == null)
                {
                    response.setError("Producto no ha sido encontrada.");
                    return response;
                }

                producto_exist.Estado = "I";

                var result = await _applicationContext.SaveChangesAsync();

                if (result > 0)
                {
                    response.setSuccess("Producto eliminado exitosamente.");
                }
                else
                {
                    response.setError("No ha sido posible eliminar el producto.");
                }

                return response;
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
