using GraphixWeb.Enums;

namespace GraphixWeb.Models
{
    public class CashFlow
    {
        public int Id { get; set; }
        public int? OrderId { get; set; }
        public int? InstallmentNumber { get; set; }
        public string Description { get; set; }
        public CashFlowType Type { get; set; }
        public CashFlowCategory Category { get; set; }
        public DateTime? ExpectedDateReceive { get; set; }
        public decimal ExpectedValueReceive { get; set; }
        public decimal? ValueReceive { get; set; }
        public DateTime? DateReceive { get; set; }
        public DateTime CreatedAt { get; set; } = DateTime.Now;
        public DateTime StartDate { get; set; }
        public DateTime EndDate { get; set; }
    }
}