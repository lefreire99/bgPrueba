using bgPrueba.Server.ActionModels;

namespace bgPrueba.Server.Interfaces
{
    public interface IProductoMovimientoService
    {
        Task<Response> RegisterEntradaSalida(ProductoMovimientoInterface model);
    }
}
