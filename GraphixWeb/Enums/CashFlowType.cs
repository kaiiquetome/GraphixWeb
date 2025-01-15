using System.ComponentModel;

namespace GraphixWeb.Enums
{
    public enum CashFlowType
    {
        [Description("Entrada")]
        Input = 0,

        [Description("Saida")]
        Output = 1,
    }

    public enum CashFlowTypeView
    {
        [Description("--")]
        All = 0,

        [Description("Entrada")]
        Input = 1,

        [Description("Saida")]
        Output = 2,
    }
}