using System.ComponentModel;

namespace GraphixWeb.Enums
{
    public enum UserProfile
    {
        [Description("Administrador")]
        Administrator = 0,
        [Description("Operador")]
        Operator = 1
    }
}
