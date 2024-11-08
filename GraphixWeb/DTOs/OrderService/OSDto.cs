using GraphixWeb.DTOs;
using GraphixWeb.Enums;

namespace GraphixWeb.DTOs.OrderService
{
    public class OSDto : BaseDto
    {
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
        public MachineSetupDto Machine { get; set; }
        public List<InkMixDto> InkMixs { get; set; }
        public List<RewindingDto> Rewindings { get; set; }
        public List<TraceabilityDto> Traceabilitys { get; set; }
        public List<AniloxDto> Aniloxs { get; set; }
    }
}
