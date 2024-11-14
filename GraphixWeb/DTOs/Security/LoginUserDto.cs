using System.ComponentModel.DataAnnotations;

namespace GraphixWeb.DTOs.Security
{
    public class LoginUserDto
    {
        [Required(ErrorMessage = "Login é obrigatório")]
        public string Login { get; set; }
        [Required(ErrorMessage = "Senha é obrigatória")]
        [StringLength(10, MinimumLength = 4, ErrorMessage = "A senha deve ter entre 4 e 10 caracteres")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
    }
}
