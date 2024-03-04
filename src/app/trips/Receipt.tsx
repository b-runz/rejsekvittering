import React from "react";
import {Trip} from '@/lib/RejseplanRequest'
import PrintButton from "./PrintButton"

interface ReceiptProps {
    trip: Trip;
    identity: string
  }
export default async function Receipt({ trip, identity }: ReceiptProps): Promise<JSX.Element> {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
      };
    return(

  <div className="bg-white p-8 rounded shadow-md max-w-md mx-auto" id={identity}>
    <h2 className="text-2xl font-semibold mb-4">Receipt</h2>
    <div className="grid grid-cols-5">
      <div className="col-span-1">
        <div className="mb-4 col-span-1">
          <span className="text-gray-600">Date:</span>
        </div>
        <div className="mb-4">
          <span className="text-gray-600">From:</span>
        </div>
        <div className="mb-4">
          <span className="text-gray-600">Arrival:</span>
        </div>
        <div className="mb-4">
          <span className="text-gray-600">To:</span>
        </div>
      </div>
      <div className="col-span-4">
        <div className="mb-4">
          <span className="font-semibold">{formatDate(trip.date)}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold">{trip.from}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold">{formatDate(trip.arrival)}</span>
        </div>
        <div className="mb-4">
          <span className="font-semibold">{trip.to}</span>
        </div>
      </div>
      <div className="mb-4 col-span-5">
        <hr />
      </div>
      <div className="mb-4 col-span-1">
        <span className="text-lg text-gray-600">Amount:</span>
      </div>
      <div className="mb-4 col-span-4">
        <span className="font-bold text-lg">{trip.amount}</span>
      </div>
      <PrintButton identity={identity}></PrintButton>
    </div>
  </div>      
    )
}