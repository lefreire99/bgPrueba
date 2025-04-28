using bgPrueba.Server.ActionModels;

namespace bgPrueba.Server.Interfaces
{
    public interface IProductoMovimientoService
    {
        Task<ObjectResponse> GetMovimientosByProductoId(int id);
        Task<Response> RegisterEntradaSalida(ProductoMovimientoInterface model);
    }
}
