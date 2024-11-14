using GraphixWeb.Authentication;
using GraphixWeb.Contract;
using GraphixWeb.DTOs.Security;
using GraphixWeb.Helpers;
using Microsoft.JSInterop;
using System.Net.Http.Json;
using System.Text.Json;

namespace GraphixWeb.Service.Security
{
    public class AuthService : IAuthService
    {
        private readonly HttpClient _httpClient;
        private readonly IJSRuntime _jsRuntime;
        private readonly string _baseMethod;
        private readonly string _baseUrl;
        public AuthService(HttpClient httpClient, IJSRuntime jsRuntime, IConfiguration configuration)
        {
            _baseUrl = configuration["baseUrl"];
            _httpClient = httpClient;
            _jsRuntime = jsRuntime;
            _baseMethod = "auth";
        }

        public async Task<bool> LoginAsync(string username, string password)
        {
            var loginData = new UserLoginModel { Username = username, Password = password };
            var loginResponse = await _httpClient.PostAsJsonAsync($"{_baseUrl}{_baseMethod}/login", loginData);

            if (loginResponse.IsSuccessStatusCode)
            {
                var response = await loginResponse.Content.ReadFromJsonAsync<AuthenticationDto>();
                return await SetLocalStorage(response);
            }
            else
                throw new ApplicationException($"Falha na autenticação, você sera redirecionado para tela de login.");
        }
        public async Task<bool> RefreshTokenAsync()
        {
            var jwt = await GetTokenAsync();
            var refresh = await GetRefreshTokenAsync();

            var refreshData = new AuthenticationDto { JwtToken = jwt, RefreshToken = refresh };
            var refreshResponse = await _httpClient.PostAsJsonAsync($"{_baseUrl}{_baseMethod}/refresh-token", refreshData);

            if (refreshResponse.IsSuccessStatusCode)
            {
                var response = await refreshResponse.Content.ReadFromJsonAsync<AuthenticationDto>();
                await SetLocalStorage(response);
                return true;
            }
            else
                throw new ApplicationException($"Falha na autenticação, você sera redirecionado para tela de login.");
        }
        public async Task LogoutAsync()
        {
            await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", "authToken");
            await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", "refreshToken");
            await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", "roles");
            await _jsRuntime.InvokeVoidAsync("localStorage.removeItem", "timestamp");
        }

        public async Task<string> GetTimestempAsync()
        {
            return await _jsRuntime.InvokeAsync<string>("localStorage.getItem", "timestemp");
        }
        public async Task<string> GetTokenAsync()
        {
            return await _jsRuntime.InvokeAsync<string>("localStorage.getItem", "authToken");
        }

        public async Task<string> GetRefreshTokenAsync()
        {
            return await _jsRuntime.InvokeAsync<string>("localStorage.getItem", "refreshToken");
        }

        public async Task<IList<string>> GetRolesAsync()
        {
            var rolesJson = await _jsRuntime.InvokeAsync<string>("localStorage.getItem", "roles");
            return string.IsNullOrEmpty(rolesJson) ? new List<string>() : JsonSerializer.Deserialize<IList<string>>(rolesJson);
        }
        private async Task<bool> SetLocalStorage(AuthenticationDto response)
        {
            if (response != null && !string.IsNullOrEmpty(response.JwtToken) && !string.IsNullOrEmpty(response.RefreshToken))
            {
                await _jsRuntime.InvokeVoidAsync("localStorage.setItem", "authToken", response.JwtToken);
                await _jsRuntime.InvokeVoidAsync("localStorage.setItem", "refreshToken", response.RefreshToken);
                await _jsRuntime.InvokeVoidAsync("localStorage.setItem", "roles", JsonSerializer.Serialize(response.Roles));
                await _jsRuntime.InvokeVoidAsync("localStorage.setItem", "timestemp", DateTime.Now.AddMinutes(15));
                //await _jsRuntime.InvokeVoidAsync("localStorage.setItem", "timestemp", DateTime.Now);
                return true;
            }
            else
                return false;
        }
    }
}
