import { Trip } from '@/lib/RejseplanRequest'
import ReceiptParentView from './ReceiptParentView'
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
      to: "Linje : 5118 Trige Trige Trige Trige Trige TrigeTrigeTrige Trige  Trige Trige Trige Trige TrigeTrigeTrigeTrige   Trige Trige Trige Trige/Randersvej (Aarhus Kom)",
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
    <div className="w-full bg-gray-100" style={{zIndex: 4}}>
      <div className="flex items-center justify-center pb-16">
        <p className="text-4xl font-bold">Receipts</p>
      </div>
      <ReceiptParentView trips={trips}></ReceiptParentView>
    </div>
  );
}