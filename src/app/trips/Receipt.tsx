'use client'

import React, {ReactElement} from "react";
import { Trip } from '@/lib/RejseplanRequest'
import styles from './Receipt.module.css'
import PrintButton from "./PrintButton";
import Image from 'next/image'
import SelectTripCheckbox from "./SelectTripCheckbox";

interface ReceiptProps {
  trip: Trip;
  identity: string;
  addRemoveFunc: {add: (checked: string) => void, remove: (checked: string)  => void}
}
export default function Receipt({ trip, identity, addRemoveFunc  }: ReceiptProps): ReactElement<any, any> {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  };
  
  const [borderColor, setBorderColor] = React.useState('border-gray-100')

  function toggleBorder(checkboxEvent: React.ChangeEvent<HTMLInputElement>, identity: string){
    const checkbox = checkboxEvent.target;
    if (checkbox.checked) {
      setBorderColor('border-blue-500');
      addRemoveFunc.add(identity);
    } else {
      setBorderColor('border-gray-100');
      addRemoveFunc.remove(identity);
    }
  }

  return (
    <div>
      <div className={`bg-white pb-2 rounded shadow-md max-w-96 mx-auto ${borderColor} border-2`} id={identity}>
        <div className="relative w-full">
          <Image src={'/rk.svg'} alt="Logo" width={180} height={27} style={{ paddingLeft: 25 }} className="absolute top-0 left-0 p-3"></Image>
          <SelectTripCheckbox parentAction={toggleBorder} identity={identity}></SelectTripCheckbox>
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