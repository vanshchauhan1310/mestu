"use client"

interface ConsultationHistoryProps {
  consultations: any[]
}

export default function ConsultationHistory({ consultations }: ConsultationHistoryProps) {
  const getStatusColor = (status: string) => {
    switch (status) {
      case "confirmed":
        return "bg-green-100 text-green-800"
      case "pending":
        return "bg-yellow-100 text-yellow-800"
      case "completed":
        return "bg-blue-100 text-blue-800"
      case "cancelled":
        return "bg-red-100 text-red-800"
      default:
        return "bg-gray-100 text-gray-800"
    }
  }

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "confirmed":
        return "✅"
      case "pending":
        return "⏳"
      case "completed":
        return "✔️"
      case "cancelled":
        return "❌"
      default:
        return "📋"
    }
  }

  if (consultations.length === 0) {
    return (
      <div className="text-center py-12">
        <div className="text-6xl mb-4">📋</div>
        <h3 className="text-xl font-semibold text-foreground mb-2">No Consultations Yet</h3>
        <p className="text-muted-foreground">Book your first consultation with a gynecologist to get started.</p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <h3 className="text-lg font-semibold text-foreground mb-4">Your Consultations</h3>
      {consultations.map((consultation) => (
        <div key={consultation.id} className="border border-border rounded-lg p-4 hover:shadow-md transition-smooth">
          <div className="flex items-start justify-between mb-3">
            <div>
              <h4 className="font-semibold text-foreground">{consultation.doctorName}</h4>
              <p className="text-sm text-muted-foreground">{consultation.doctorSpecialty}</p>
            </div>
            <span className={`px-3 py-1 rounded-full text-xs font-semibold ${getStatusColor(consultation.status)}`}>
              {getStatusIcon(consultation.status)}{" "}
              {consultation.status.charAt(0).toUpperCase() + consultation.status.slice(1)}
            </span>
          </div>

          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-3 text-sm">
            <div>
              <p className="text-muted-foreground text-xs">Date</p>
              <p className="font-semibold text-foreground">{consultation.date}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Time</p>
              <p className="font-semibold text-foreground">{consultation.time}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Type</p>
              <p className="font-semibold text-foreground capitalize">{consultation.consultationType}</p>
            </div>
            <div>
              <p className="text-muted-foreground text-xs">Reason</p>
              <p className="font-semibold text-foreground">{consultation.reason}</p>
            </div>
          </div>

          {consultation.notes && (
            <div className="bg-gray-50 p-3 rounded text-sm mb-3">
              <p className="text-muted-foreground text-xs mb-1">Notes:</p>
              <p className="text-foreground">{consultation.notes}</p>
            </div>
          )}

          <div className="flex gap-2">
            <button className="flex-1 bg-primary/10 hover:bg-primary/20 text-primary font-semibold py-2 px-3 rounded transition-smooth text-sm">
              View Details
            </button>
            <button className="flex-1 bg-accent-warm/10 hover:bg-accent-warm/20 text-accent-warm font-semibold py-2 px-3 rounded transition-smooth text-sm">
              Reschedule
            </button>
          </div>
        </div>
      ))}
    </div>
  )
}
