import { Trip } from '@/lib/RejseplanRequest'
import Receipt from './Receipt';
async function fetchTrips(): Promise<Trip[]> {
  return [
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
    {
      date: new Date(),
      from: "Linje : 118 Aarhus Rutebilstation",
      arrival: new Date(),
      to: "Linje : 118 Trige/Randersvej (Aarhus Kom)",
      amount: "-28,80"
    },
  ]
}

export default async function Page() {
  const trips: Trip[] = await fetchTrips()

  return (
    <div className="p-8 w-full">
      <div className="flex items-center justify-center pb-16">
        <p className="text-4xl font-bold">Receipts</p>
      </div>
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
        {trips.map((trip, id) => (
          <Receipt trip={trip} key={id}></Receipt>
        ))}
      </div>
    </div>
  );
}