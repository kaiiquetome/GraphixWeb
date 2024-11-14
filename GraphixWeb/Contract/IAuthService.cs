namespace GraphixWeb.Contract
{
    public interface IAuthService
    {
        Task<bool> LoginAsync(string username, string password);
        Task<bool> RefreshTokenAsync();
        Task LogoutAsync();
        Task<string> GetTokenAsync();
        Task<string> GetTimestempAsync();
    }
}
