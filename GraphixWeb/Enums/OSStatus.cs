using System.ComponentModel;

namespace GraphixWeb.Enums
{
    public enum OSStatus
    {
        [Description("Pendente")]
        pending = 0,

        [Description("Em Execução")]
        running = 1,

        [Description("Finalizado")]
        completed = 2
    }
}
