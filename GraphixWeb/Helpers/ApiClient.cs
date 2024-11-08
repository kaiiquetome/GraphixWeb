using System.Text.Json;
using System.Text;
using System.Text.Json.Serialization;
using GraphixWeb.Models;

namespace GraphixWeb.Helpers
{
    public static class ApiClient
    {
        private static readonly HttpClient _httpClient = new HttpClient();
        private static readonly string _baseUrl;

        static ApiClient()
        {
            // Carregar o valor de baseUrl do arquivo appsettings.json
            var configuration = new ConfigurationBuilder()
                .SetBasePath(AppContext.BaseDirectory)
                .AddJsonFile("appsettings.json", optional: false, reloadOnChange: true)
                .Build();

            _baseUrl = configuration["baseUrl"];
            _httpClient.DefaultRequestHeaders.Add("ngrok-skip-browser-warning", "true");

        }

        // Método genérico para fazer uma solicitação HTTP (GET, POST, PUT, DELETE, PATCH)
        private static async Task<T> SendAsync<T>(HttpMethod httpMethod, string requestUri, object content = null, string authToken = null)
        {
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

            if (!string.IsNullOrEmpty(authToken))
            {
                request.Headers.Add("Authorization", $"bearer {authToken}");
            }

            var response = await _httpClient.SendAsync(request);

            // Verifica se o status é de sucesso
            if (response.IsSuccessStatusCode)
            {
                var contentType = response.Content.Headers.ContentType?.MediaType;

                // Se for um arquivo, retorna como byte[]
                if (typeof(T) == typeof(byte[]))
                {
                    var fileBytes = await response.Content.ReadAsByteArrayAsync();
                    return (T)(object)fileBytes; // Retorna como byte[]
                }
                // Se for JSON, deserializa como o tipo T
                var responseContent = await response.Content.ReadAsStringAsync();
                return JsonSerializer.Deserialize<T>(responseContent, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });
            }

            // Se não for sucesso, deserializa o corpo do erro
            var errorResponseContent = await response.Content.ReadAsStringAsync();

            // Tenta deserializar o objeto de erro retornado pela API
            try
            {
                var errorResponse = JsonSerializer.Deserialize<CustomErrorModel>(errorResponseContent, new JsonSerializerOptions
                {
                    PropertyNamingPolicy = JsonNamingPolicy.CamelCase
                });

                // Lança uma exceção contendo a propriedade "error" e "detail" do objeto de erro
                throw new HttpRequestException($"{errorResponse?.Error}");
            }
            catch (JsonException)
            {
                // Caso a deserialização falhe, lança uma exceção genérica com o conteúdo bruto
                throw new HttpRequestException($"Ops a requisição falhou, entre em contato com o suporte técnico! StatusCode:{response.StatusCode}, Response: {errorResponseContent}");
            }
        }

        // Método específico para download de arquivo
        public static async Task<T> DownloadFileAsync<T>(string requestUri, string authToken = null)
        {
            return await SendAsync<T>(HttpMethod.Get, requestUri, null, authToken);
        }

        // Outros métodos de requisição...
        public static async Task<T> GetAsync<T>(string requestUri, string authToken = null)
        {
            return await SendAsync<T>(HttpMethod.Get, requestUri, null, authToken);
        }

        public static async Task<T> PostAsync<T>(string requestUri, object content, string authToken = null)
        {
            return await SendAsync<T>(HttpMethod.Post, requestUri, content, authToken);
        }

        public static async Task<T> PutAsync<T>(string requestUri, object content, string authToken = null)
        {
            return await SendAsync<T>(HttpMethod.Put, requestUri, content, authToken);
        }

        public static async Task<T> DeleteAsync<T>(string requestUri, string authToken = null)
        {
            return await SendAsync<T>(HttpMethod.Delete, requestUri, null, authToken);
        }

        public static async Task<T> PatchAsync<T>(string requestUri, object content, string authToken = null)
        {
            return await SendAsync<T>(new HttpMethod("PATCH"), requestUri, content, authToken);
        }
    }
}
