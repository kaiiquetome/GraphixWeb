namespace GraphixWeb.DTOs.Security
{
    public class AuthenticationDto
    {
        public string Name { get; set; }
        public string JwtToken { get; set; }
        public string RefreshToken { get; set; }
        public IList<string> Roles { get; set; }
    }
}
