using System.Text.Json;
using System.Text;
using System.Text.Json.Serialization;
using GraphixWeb.Models;
using Microsoft.JSInterop;
using System.Net.Http.Headers;
using GraphixWeb.DTOs.Security;
using System.ComponentModel.Design;
using System;
using GraphixWeb.Contract;
using GraphixWeb.Authentication;
using Microsoft.AspNetCore.Components.Authorization;

namespace GraphixWeb.Helpers
{
    public class ApiClient
    {
        private readonly HttpClient _httpClient;
        private readonly IJSRuntime _jsRuntime;
        private readonly string _baseUrl;
        private readonly IAuthService _authService;
        private readonly CustomAuthStateProvider _authStateProvider;

        public ApiClient(HttpClient httpClient, IJSRuntime jsRuntime, IConfiguration configuration, IAuthService authService, AuthenticationStateProvider authStateProvider)
        {
            _httpClient = httpClient;
            _jsRuntime = jsRuntime;
            _baseUrl = configuration["baseUrl"];
            _httpClient.DefaultRequestHeaders.Add("ngrok-skip-browser-warning", "true");
            _authService = authService;
            _authStateProvider = (CustomAuthStateProvider)authStateProvider;

        }

        private async Task<T> SendAsync<T>(HttpMethod httpMethod, string requestUri, object content = null)
        {
            var timeExpireToken = await _jsRuntime.InvokeAsync<string>("localStorage.getItem", "timestemp");

            if (DateTime.TryParse(timeExpireToken, out DateTime result) && result <= DateTime.Now)
                await _authService.RefreshTokenAsync();

            var token = await _authService.GetTokenAsync();

            var request = new HttpRequestMessage(httpMethod, _baseUrl + requestUri);
            if (content != null)
            {
                var options = new JsonSerializerOptions
                {
                    DefaultIgnoreCondition = JsonIgnoreCondition.WhenWritingNull
                };
                var jsonContent = JsonSerializer.Serialize(content, options);
                request.Content = new StringContent(jsonContent, Encoding.UTF8, "application/json");
            }

            if (!string.IsNullOrEmpty(token))
                request.Headers.Authorization = new AuthenticationHeaderValue("Bearer", token);

            var response = await _httpClient.SendAsync(request);
            
            if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
            {
                await _authStateProvider.LogoutAsync();

                throw new HttpRequestException($"Sua sessão expirou, faça o login novamente.");
            }
            
            if (response.IsSuccessStatusCode)
            {
                if (typeof(T) == typeof(byte[]))
                {
                    var fileBytes = await response.Content.ReadAsByteArrayAsync();
                    return (T)(object)fileBytes;
                }

                var responseContent = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<T>(responseContent, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });
            }

            var errorResponseContent = await response.Content.ReadAsStringAsync();
            try
            {
                var errorResponse = JsonSerializer.Deserialize<CustomErrorModel>(errorResponseContent, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                throw new HttpRequestException($"{errorResponse?.Error}");
            }
            catch (JsonException)
            {
                if (response.StatusCode == System.Net.HttpStatusCode.Unauthorized)
                    await _authService.LogoutAsync();

                throw new HttpRequestException($"Ops a requisição falhou, entre em contato com o suporte técnico! StatusCode:{response.StatusCode}, Response: {errorResponseContent}");
            }
        }

        public async Task<T> GetAsync<T>(string requestUri)
        {
            return await SendAsync<T>(HttpMethod.Get, requestUri);
        }

        public async Task<T> PostAsync<T>(string requestUri, object content)
        {
            return await SendAsync<T>(HttpMethod.Post, requestUri, content);
        }
        public async Task<T> PutAsync<T>(string requestUri, object content)
        {
            return await SendAsync<T>(HttpMethod.Put, requestUri, content);
        }

        public async Task<T> DeleteAsync<T>(string requestUri)
        {
            return await SendAsync<T>(HttpMethod.Delete, requestUri, null);
        }

        public async Task<T> PatchAsync<T>(string requestUri, object content)
        {
            return await SendAsync<T>(new HttpMethod("PATCH"), requestUri, content);
        }
        public async Task<T> DownloadFileAsync<T>(string requestUri, string authToken = null)
        {
            return await SendAsync<T>(HttpMethod.Get, requestUri, null);
        }
    }
}
