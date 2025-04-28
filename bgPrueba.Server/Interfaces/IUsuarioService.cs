using bgPrueba.Server.ActionModels;

namespace bgPrueba.Server.Interfaces
{
    public interface IUsuarioService
    {
        Task<Response> CreateUsuario(Usuario model);
    }
}
