using bgPrueba.Server.ActionModels;

namespace bgPrueba.Server.Interfaces
{
    public interface IRolService
    {
        Task<Response> CreateRol(Rol model);
    }
}
