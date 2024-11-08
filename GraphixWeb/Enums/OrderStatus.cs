using System.ComponentModel;

namespace GraphixWeb.Enums
{
    public enum OrderStatus
    {
        [Description("Orçamento")]
        pending = 0,

        [Description("Em Execução")]
        running = 1,

        [Description("Finalizado")]
        completed = 2,

        [Description("Recusado")]
        refused = 3
    }
}
