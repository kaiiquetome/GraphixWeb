using GraphixWeb.Enums;
using GraphixWeb.Models;

namespace GraphixWeb.Models.OrderService
{
    public class OS : BaseModel
    {
        public OS()
        {
            Machine = new MachineSetup();
            InkMixs = new List<InkMix>();
            Rewindings = new List<Rewinding>();
            Aniloxs = new List<Anilox>();
        }
        public int OrderId { get; set; }
        public int CustomerId { get; set; }
        public string? Observation { get; set; }
        public DateTime? DeliveryDeadline { get; set; }
        public string? Quantity { get; set; }
        public string? RollQuantityKg { get; set; }
        public string? RollQuantityMeters { get; set; }
        public DateTime? ProductionStartDate { get; set; }
        public DateTime? ProductionEndDate { get; set; }
        public string? Operator { get; set; }
        public OSStatus Status { get; set; }
        public LabelOrientation LabelOrientation { get; set; }
        public MachineSetup Machine { get; set; }
        public List<InkMix> InkMixs { get; set; }
        public List<Rewinding> Rewindings { get; set; }
        public List<Traceability> Traceabilitys { get; set; }
        public List<Anilox> Aniloxs { get; set; }
        public Order Order { get; set; }
        public Customer Customer { get; set; }
    }
}
