using System.ComponentModel.DataAnnotations;

namespace GraphixWeb.Models
{
    public class Account : BaseModel
    {
        [Required(ErrorMessage = "Razão Social é obrigatória")]
        public string CorporateName { get; set; }

        [Required(ErrorMessage = "CNPJ é obrigatório")]
        public string Cnpj { get; set; }


        [Required(ErrorMessage = "Inscrição Estadual é obrigatória")]
        [StringLength(9, ErrorMessage = "A Inscrição Estadual não pode exceder 9 caracteres")]
        public string IE { get; set; }

        [Required(ErrorMessage = "Telefone é obrigatório")]
        public string Phone { get; set; }

        [Required(ErrorMessage = "Email é obrigatório")]
        [EmailAddress(ErrorMessage = "Email inválido")]
        public string Email { get; set; }
    }
}
