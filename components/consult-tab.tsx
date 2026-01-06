"use client"

import { Star, MapPin, Calendar, Clock, Video, User } from "lucide-react"

export default function ConsultTab() {
    const doctors = [
        {
            id: 1,
            name: "Dr. Ananya Gupta",
            specialty: "Gynecologist & PCOS Specialist",
            rating: 4.9,
            reviews: 128,
            location: "Mumbai",
            image: "https://images.unsplash.com/photo-1559839734-2b71ea197ec2?q=80&w=200&auto=format&fit=crop",
            nextAvailable: "Today, 4:00 PM"
        },
        {
            id: 2,
            name: "Dr. Sarah Johnson",
            specialty: "Endocrinologist",
            rating: 4.8,
            reviews: 95,
            location: "Online",
            image: "https://images.unsplash.com/photo-1594824476967-48c8b964273f?q=80&w=200&auto=format&fit=crop",
            nextAvailable: "Tomorrow, 10:00 AM"
        },
        {
            id: 3,
            name: "Ms. Leena Nair",
            specialty: "Clinical Nutritionist",
            rating: 4.9,
            reviews: 210,
            location: "Bangalore",
            image: "https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?q=80&w=200&auto=format&fit=crop",
            nextAvailable: "Today, 6:30 PM"
        }
    ]

    return (
        <div className="space-y-6 pb-24">
            <div className="bg-[#ede4d9] p-6 rounded-[2rem]">
                <h2 className="text-xl font-bold text-[#1a4d2e] mb-1">Expert Consultation</h2>
                <p className="text-xs text-[#1a4d2e]/70">Connect with top PCOS specialists.</p>
            </div>

            <div className="space-y-4">
                {doctors.map(doc => (
                    <div key={doc.id} className="bg-white p-4 rounded-[2rem] border border-gray-50 flex gap-4 shadow-sm">
                        <div className="w-20 h-24 rounded-2xl overflow-hidden shrink-0 bg-gray-100">
                            <img src={doc.image} alt={doc.name} className="w-full h-full object-cover" />
                        </div>

                        <div className="flex-1">
                            <div className="flex justify-between items-start">
                                <div>
                                    <h3 className="font-bold text-[#1a4d2e] text-sm">{doc.name}</h3>
                                    <p className="text-[10px] text-gray-400 font-medium mb-1">{doc.specialty}</p>
                                </div>
                                <div className="flex items-center gap-1 bg-amber-50 px-2 py-0.5 rounded-full">
                                    <Star className="w-3 h-3 fill-amber-400 text-amber-400" />
                                    <span className="text-[10px] font-bold text-amber-700">{doc.rating}</span>
                                </div>
                            </div>

                            <div className="flex items-center gap-2 text-[10px] text-gray-400 mb-3">
                                <MapPin className="w-3 h-3" />
                                {doc.location}
                            </div>

                            <div className="flex gap-2">
                                <button className="flex-1 bg-[#1a4d2e] text-white py-2 rounded-xl text-xs font-bold shadow-lg shadow-green-900/10">
                                    Book Now
                                </button>
                                <button className="w-10 flex items-center justify-center border border-gray-100 rounded-xl text-gray-400 hover:text-[#1a4d2e]">
                                    <Video className="w-4 h-4" />
                                </button>
                            </div>
                        </div>
                    </div>
                ))}
            </div>
        </div>
    )
}
