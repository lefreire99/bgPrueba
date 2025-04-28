using bgPrueba.Server.ActionModels;

namespace bgPrueba.Server.Interfaces
{
    public interface IProductoService
    {
        IEnumerable<GetProducto> GetProductos();
        Task<Response> CreateProducto(ProductoInterface model);
        Task<Response> UpdateProducto(ProductoInterface model);
        Task<Response> DeleteProducto(int id);
    }
}
