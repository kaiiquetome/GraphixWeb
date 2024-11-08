using GraphixWeb.Enums;
using System.ComponentModel.DataAnnotations;

namespace GraphixWeb.Models
{
    public class User : BaseModel
    {
        [Required(ErrorMessage = "Nome é obrigatório")]
        public string Name { get; set; }

        [Required(ErrorMessage = "Login é obrigatório")]
        public string Login { get; set; }

        [Required(ErrorMessage = "Senha é obrigatória")]
        [StringLength(10, MinimumLength = 4, ErrorMessage = "A senha deve ter entre 4 e 10 caracteres")]
        [DataType(DataType.Password)]
        public string Password { get; set; }
        public UserProfile Profile { get; set; }
    }
}
