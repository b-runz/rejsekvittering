'use client'

import React, { ReactElement } from "react";
import { Trip } from '@/lib/RejseplanRequest'
import { AddRemoveFunction, toggleBorder } from '@/lib/AddRemoveFunction'
import ReceiptCommon from './ReceiptCommon'

interface ReceiptProps {
  trip: Trip;
  identity: string;
  addRemoveFunc: AddRemoveFunction
}
export default function ReceiptSmallScreen({ trip, identity, addRemoveFunc }: ReceiptProps): ReactElement<any, any> {
  const [borderColor, setBorderColor] = React.useState('border-gray-100')
  const [folded, setFolded] = React.useState(!trip.printed)
  const [rotate, setRotate] = React.useState('')

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
          <ReceiptCommon trip={trip} parentAction={toggleBorder} identity={identity} addRemoveFunc={addRemoveFunc} setBorderColor={setBorderColor}></ReceiptCommon>
        </div>
      </div>
    </div>
  )
}