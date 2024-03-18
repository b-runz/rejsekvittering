'use client'

import React, { ReactElement } from "react";
import { Trip } from '@/lib/RejseplanRequest'
import styles from './Receipt.module.css'
import PrintButton from "./PrintButton";
import Image from 'next/image'
import SelectTripCheckbox from "./SelectTripCheckbox";

interface ReceiptProps {
  trip: Trip;
  identity: string;
  addRemoveFunc: { add: (checked: string) => void, remove: (checked: string) => void }
}
export default function ReceiptSmallScreen({ trip, identity, addRemoveFunc }: ReceiptProps): ReactElement<any, any> {
  const formatDate = (date: Date) => {
    return new Intl.DateTimeFormat('en-US', { month: 'long', day: 'numeric', year: 'numeric' }).format(date);
  };

  const [borderColor, setBorderColor] = React.useState('border-gray-100')
  const [folded, setFolded] = React.useState(!trip.printed)
  const [rotate, setRotate] = React.useState('')

  function toggleBorder(checkboxEvent: React.ChangeEvent<HTMLInputElement>, identity: string) {
    const checkbox = checkboxEvent.target;
    if (checkbox.checked) {
      setBorderColor('border-blue-500');
      addRemoveFunc.add(identity);
    } else {
      setBorderColor('border-gray-100');
      addRemoveFunc.remove(identity);
    }
  }

  function fold() {
    setFolded(!folded)
    setRotate(rotate == '' ? 'rotate-180' : '')
  }

  return (
    <div>
      <div className={`${trip.printed ? 'bg-gray-400' : 'bg-white'} pb-2 rounded shadow-md max-w-96 mx-auto ${borderColor} border-2`} id={identity}>

        <div onClick={fold}>
          <div className="flex items-center">
            <svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 20 20" fill="currentColor"
              className={`w-6 h-6 transform transition-transform ${trip.printed ? '' : 'hidden'} ${rotate}`} id="arrow">
              <path fillRule="evenodd"
                d="M10.293 14.293a1 1 0 0 1-1.414 0l-5-5a1 1 0 0 1 1.414-1.414L10 11.586l4.293-4.293a1 1 0 1 1 1.414 1.414l-5 5z" />
            </svg>
            <div className={`${folded ? 'hidden' : ''} ml-3`}>
              <span className="font-bold">From: </span><span>{trip.from}</span>
            </div>

          </div>
        </div>
        <div className={`${folded ? '' : 'hidden'}`}>

          <div className="relative w-full">
            <Image src={'/rk.svg'} alt="Logo" width={180} height={27} style={{ paddingLeft: 25 }} className="absolute top-0 left-0 p-3"></Image>
            <SelectTripCheckbox parentAction={toggleBorder} identity={identity}></SelectTripCheckbox>
          </div>
          <div className="pt-8">
            {trip.printed && <h1 className="text-xl font-bold text-center">This trip is printed</h1>}
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
    </div>
  )
}