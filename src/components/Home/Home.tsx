"use client";
import { useState } from "react";
import { ServiceCard } from "@/types/user";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Search } from "lucide-react";


export default function Home() {
  const services: ServiceCard[] = [
    { id: 1, title: "Beach Travel", description: "Enjoy the most beautiful beaches with crystal clear water.", imageUrl: "https://images.unsplash.com/photo-1507525428034-b723cf961d3e" },
    { id: 2, title: "Mountain Trekking", description: "Adventure trekking with professional guides.", imageUrl: "https://images.unsplash.com/photo-1501785888041-af3ef285b470" },
    { id: 3, title: "City Tour", description: "Discover iconic city spots with guided tours.", imageUrl: "https://images.unsplash.com/photo-1483683804023-6ccdb62f86ef" },
    { id: 4, title: "Desert Safari", description: "Feel the thrill of sand dunes and camel rides.", imageUrl: "https://images.unsplash.com/photo-1524492412937-b28074a5d7da" },
    { id: 5, title: "Forest Camping", description: "Stay close to nature with eco-friendly camping.", imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad" },
    { id: 6, title: "Luxury Cruise", description: "Experience premium cruise vacations with fine dining.", imageUrl: "https://images.unsplash.com/photo-1503220317375-aaad61436b1b" },
    { id: 7, title: "Wildlife Safari", description: "Explore wildlife with professional tour guides.", imageUrl: "https://images.unsplash.com/photo-1469474968028-56623f02e42e" },
    { id: 8, title: "Road Trip", description: "Plan your perfect road trip with our best routes.", imageUrl: "https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad" },
  ];

  const [searchQuery, setSearchQuery] = useState("");

  // 🔍 Search title filter
  const filteredServices = services.filter((s) =>
    s.title.toLowerCase().includes(searchQuery.toLowerCase())
  );

  return (
    <>
      <div className="py-10 mt-15">
        <h2 className="text-center text-3xl font-bold mb-5">Our Services</h2>

     {/*  Search Bar */}
<div className="w-full flex justify-center sm:justify-start mt-10 px-4 sm:px-8 md:px-16">
  <div className="relative w-full sm:w-[400px] max-w-[400px]">
    <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-5 w-5 text-gray-500" />
    <Input
      placeholder="Search services..."
      className="pl-10 py-5 text-lg border border-gray-300 focus-visible:ring-blue-600 w-full"
      value={searchQuery}
      onChange={(e) => setSearchQuery(e.target.value)}
    />
  </div>
</div>
 {/*  card section*/}
        <div className="w-full mt-7">
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 px-16">
            {filteredServices.length > 0 ? (
              filteredServices.map((s) => (
                <div
                  key={s.id}
                  className="bg-white rounded-xl shadow-lg overflow-hidden hover:scale-105 duration-300 mx-2"
                >
                  <img className="w-full h-56 object-cover" src={s.imageUrl} alt={s.title} />
                  <div className="p-6">
                    <h3 className="text-2xl font-semibold">{s.title}</h3>
                    <p className="text-gray-600 mt-3">{s.description}</p>
                    <Button className="mt-6 w-full h-12 bg-green-300">Book Now</Button>
                  </div>
                </div>
              ))
            ) : (
              <p className="text-center text-gray-500 col-span-full text-xl">
                No services found 
              </p>
            )}
          </div>
        </div>
      </div>
    </>
  );
}
