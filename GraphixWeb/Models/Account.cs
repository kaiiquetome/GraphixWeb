﻿using System.ComponentModel.DataAnnotations;

namespace GraphixWeb.Models
{
    public class Account : BaseModel
    {
        public string CorporateName { get; set; }

        public string Cnpj { get; set; }

        public string IE { get; set; }

        public string Phone { get; set; }

        public string Email { get; set; }
    }
}
