using GraphixWeb.Contract;
using Microsoft.AspNetCore.Components;
using Microsoft.AspNetCore.Components.Authorization;
using System.IdentityModel.Tokens.Jwt;
using System.Security.Claims;
using System.Security.Principal;
namespace GraphixWeb.Authentication
{
    public class CustomAuthStateProvider : AuthenticationStateProvider
    {
        private readonly IAuthService _authService;
        private readonly ClaimsPrincipal _anonymous = new ClaimsPrincipal(new ClaimsIdentity());
        private readonly NavigationManager _navigation;


        public CustomAuthStateProvider(IAuthService authService, NavigationManager navigationManager)
        {
            _authService = authService;
            _navigation = navigationManager;
        }

        public override async Task<AuthenticationState> GetAuthenticationStateAsync()
        {
            var token = await _authService.GetTokenAsync();

            if (string.IsNullOrWhiteSpace(token))
            {
                await LogoutAsync();
                return new AuthenticationState(_anonymous);
            }
            else
            {
                var identity = new ClaimsIdentity();

                if (!string.IsNullOrEmpty(token))
                {
                    var handler = new JwtSecurityTokenHandler();
                    var jwtToken = handler.ReadJwtToken(token);

                    identity = new ClaimsIdentity(jwtToken.Claims, "jwt");
                }

                return new AuthenticationState(new ClaimsPrincipal(identity));
            }

        }
        public async Task LogoutAsync()
        {
            await _authService.LogoutAsync();

            NotifyAuthenticationStateChanged(Task.FromResult(new AuthenticationState(_anonymous)));

            _navigation.NavigateTo($"{_navigation.BaseUri}login");
        }

        public async Task LoginAsync()
        {
            var authState = await GetAuthenticationStateAsync();
            NotifyAuthenticationStateChanged(Task.FromResult(authState));
        }
        public async Task<bool> IsUserAuthenticatedAsync()
        {
            var authState = await GetAuthenticationStateAsync();
            return authState.User.Identity?.IsAuthenticated ?? false;
        }
    }
}
