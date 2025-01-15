using System.ComponentModel;

namespace GraphixWeb.Enums
{
    public enum CashFlowCategory
    {
        [Description("Vendas")]
        Sales = 0,

        [Description("Servicos")]
        Services = 1,

        [Description("Aluguel")]
        Rent = 2,

        [Description("Salarios")]
        Salaries = 3,

        [Description("Marketing")]
        Marketing = 4,

        [Description("Outros")]
        Others = 5
    }

    public enum CashFlowCategoryView
    {
        [Description("--")]
        All = 0,

        [Description("Vendas")]
        Sales = 1,

        [Description("Servicos")]
        Services = 2,

        [Description("Aluguel")]
        Rent = 3,

        [Description("Salarios")]
        Salaries = 4,

        [Description("Marketing")]
        Marketing = 5,

        [Description("Outros")]
        Others = 6
    }
}