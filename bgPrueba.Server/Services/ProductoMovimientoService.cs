﻿using bgPrueba.Server.ActionModels;
using bgPrueba.Server.DbContext;
using bgPrueba.Server.Interfaces;
using bgPrueba.Server.Models;

namespace bgPrueba.Server.Services
{
    public class ProductoMovimientoService : IProductoMovimientoService
    {
        private readonly ApplicationContext _applicationContext;
        private readonly ILogger<ProductoMovimientoService> _logger;
        public ProductoMovimientoService(ApplicationContext applicationContext, ILogger<ProductoMovimientoService> logger)
        {
            _applicationContext = applicationContext;
            _logger = logger;
        }

        public async Task<ObjectResponse> GetMovimientosByProductoId(int id)
        {
            ObjectResponse response = new ObjectResponse();
            try
            {
                var producto_exist = await _applicationContext.Productos.FindAsync(id);
                if(producto_exist == null)
                {
                    response.setError("Producto no encontrado.");
                    return response;
                }

                var movimientos = (from movimiento in _applicationContext.ProductoMovimientos
                                  where movimiento.Idproducto == producto_exist.Id
                                  select new GetProductoMovimiento
                                  {
                                      tipo = movimiento.Tipo,
                                      cantidad = movimiento.Cantidad,
                                      fecha = movimiento.Fechacreacion.ToString("dd/MM/yyyy")
                                  }).ToList();
                var state = new
                {
                    producto = producto_exist.Nombre,
                    movimientos = movimientos
                };

                response.setSuccess("Movimientos encontrados correctamente", state);
                return response;

            }
            catch(Exception ex)
            {
                _logger.LogError($"Personalized: {ex.Message}");
                response.setError("Error en el servidor");
                return response;
            }
        }

        public async Task<Response> RegisterEntradaSalida(ProductoMovimientoInterface model)
        {
            Response response = new Response();
            try
            {
                var producto_exist = await _applicationContext.Productos.FindAsync(model.id_producto);
                if(producto_exist == null)
                {
                    response.setError("El producto no ha sido encontrado.");
                    return response;
                }

                if(model.tipo != "E" && model.tipo != "S")
                {
                    response.setError("El tipo de acción no es correcto.");
                    return response;
                }

                ProductoMovimiento nuevo_movimiento = new ProductoMovimiento
                {
                    Idproducto = producto_exist.Id,
                    Cantidad = model.cantidad,
                    Tipo = model.tipo,
                    Estado = "A"
                };

                if(model.tipo == "E")
                {
                    producto_exist.Stock += model.cantidad;
                }
                else
                {
                    if(producto_exist.Stock < model.cantidad)
                    {
                        response.setError("La cantidad de salida no puede ser mayor a la cantidad disponible.");
                        return response;
                    }
                    
                    producto_exist.Stock -= model.cantidad;
                }

                await _applicationContext.ProductoMovimientos.AddAsync(nuevo_movimiento);
                var result = await _applicationContext.SaveChangesAsync();
                if(result > 0)
                {
                    response.setSuccess($"Movimiento de {(model.tipo == "E" ? "Entrada" : "Salida")} registrado correctamente.");
                }
                else
                {
                    response.setError($"No ha sido posible registrar el movimiento de {(model.tipo == "E" ? "Entrada" : "Salida")}");
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
