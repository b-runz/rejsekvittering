'use client'

import React, { ReactElement } from "react";
import { Trip } from '@/lib/RejseplanRequest'
import ReceiptCommon from './ReceiptCommon'
import { AddRemoveFunction, toggleBorder } from '@/lib/AddRemoveFunction'

interface ReceiptProps {
  trip: Trip;
  identity: string;
  addRemoveFunc: AddRemoveFunction;
}
export default function ReceiptBigScreen({ trip, identity, addRemoveFunc }: ReceiptProps): ReactElement<any, any> {
  const [borderColor, setBorderColor] = React.useState('border-gray-100')


  return (
    <div>
      <div className={`${trip.printed ? 'bg-gray-400' : 'bg-white'} pb-2 rounded shadow-md max-w-96 mx-auto ${borderColor} border-2`} id={identity}>
        <ReceiptCommon trip={trip} parentAction={toggleBorder} identity={identity} addRemoveFunc={addRemoveFunc} setBorderColor={setBorderColor}></ReceiptCommon>
      </div>
    </div>
  )
}