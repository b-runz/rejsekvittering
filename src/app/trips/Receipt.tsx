import React from "react";
import { Trip } from '@/lib/RejseplanRequest'
import styles from './Receipt.module.css'
import PrintButton from "./PrintButton";
import Image from 'next/image'
import SelectTripCheckbox from "./SelectTripCheckBox";

interface ReceiptProps {
  trip: Trip;
  identity: string
}
export default async function Receipt({ trip, identity }: ReceiptProps): Promise<JSX.Element> {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  };

  return (
    <div>
      <div className="bg-white pb-2 rounded shadow-md max-w-96 mx-auto border-gray-100 border-2" id={identity}>
        <div className="relative w-full">
          <Image src={'/rk.svg'} alt="Logo" width={180} height={27} style={{ paddingLeft: 25 }} className="absolute top-0 left-0 p-3"></Image>
          <SelectTripCheckbox identity={identity}></SelectTripCheckbox>
        </div>
        <div className="pt-8">
          <table>
            <tbody>
              <tr>
                <th>Date:</th>
                <td>{formatDate(trip.date)}</td>
              </tr>
              <tr>
                <th>From:</th>
                <td>{trip.from}</td>
              </tr>
              <tr>
                <th>Arrival:</th>
                <td>{formatDate(trip.arrival)}</td>
              </tr>
              <tr>
                <th>To:<div className={styles.spacer}></div></th>
                <td>{trip.to}<div className={styles.spacer}></div></td>
              </tr>
              <tr className={styles.amountBorder}>
                <th><div className="text-xl">Amount:</div></th>
                <td><div className="text-xl">{trip.amount}</div></td>
              </tr>
            </tbody>
          </table>
        </div>
        <PrintButton identity={identity}></PrintButton>
      </div>
    </div>
  )
}