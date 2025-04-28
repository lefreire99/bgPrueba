using bgPrueba.Server.ActionModels;

namespace bgPrueba.Server.Interfaces
{
    public interface IAuthService
    {
        Task<AuthResponse> Login(LoginInterface model);
        Task<ObjectResponse> Logout();
    }
}
