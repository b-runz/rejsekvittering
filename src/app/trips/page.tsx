import { Trip, getGuid } from '@/lib/RejseplanRequest'
import Receipt from './Receipt';
import { zIndex } from 'html2canvas/dist/types/css/property-descriptors/z-index';
async function fetchTrips(): Promise<Trip[]> {
  return [
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 0118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 1118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 2118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 3118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 4118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 5118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 6118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 7118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 8118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 9118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 10118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
  ]
}

export default async function Page() {
  const trips: Trip[] = await fetchTrips()

  return (
    <div className="p-8 w-full bg-gray-100" style={{zIndex: 4}}>
      <div className="flex items-center justify-center pb-16">
        <p className="text-4xl font-bold">Receipts</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {trips.map((trip, id) => (
          <Receipt trip={trip} identity={getGuid(trip)} key={id}></Receipt>
        ))}
      </div>
    </div>
  );
}