using GraphixWeb.Models;

namespace GraphixWeb.Models.OrderService
{
    public class MachineSetup : BaseModel
    {
        public int OrderServiceId { get; set; }
        public bool InkAdherenceOk { get; set; }
        public bool ColorOk { get; set; }
        public bool LegibleTextOk { get; set; }
        public bool CutOk { get; set; }
        public bool GeneralAspectOk { get; set; }
        public bool InkAdherenceNok { get; set; }
        public bool ColorNok { get; set; }
        public bool LegibleTextNok { get; set; }
        public bool CutNok { get; set; }
        public bool GeneralAspectNok { get; set; }
        public string? InkAdherenceReason { get; set; }
        public string? ColorReason { get; set; }
        public string? LegibleTextReason { get; set; }
        public string? CutReason { get; set; }
        public string? GeneralAspectReason { get; set; }

        public string? PaperCutWidth { get; set; }
        public string? PaperQtdUsed { get; set; }
    }
}
