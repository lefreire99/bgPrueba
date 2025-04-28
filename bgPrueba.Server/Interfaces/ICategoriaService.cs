using bgPrueba.Server.ActionModels;

namespace bgPrueba.Server.Interfaces
{
    public interface ICategoriaService
    {
        IEnumerable<OptionInterface> GetCategoriasOptions();
        Task<Response> CreateCategoria(CategoriaInterface model);
    }
}
