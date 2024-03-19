'use client'

import React, { ReactElement } from "react"
import { AddRemoveFunction } from '@/lib/AddRemoveFunction'

interface CheckboxProps {
  parentAction: (checkboxEvent: React.ChangeEvent<HTMLInputElement>, identity: string, addRemoveFunc: AddRemoveFunction, 
    setBorderColor: React.Dispatch<React.SetStateAction<string>>) => void ;
  identity: string; 
  addRemoveFunc: AddRemoveFunction  
  setBorderColor: React.Dispatch<React.SetStateAction<string>>;
}

export default function SelectTripCheckbox({ parentAction, identity, addRemoveFunc, setBorderColor}: CheckboxProps): ReactElement<any, any> {
    return (
        <input 
        onChange={event => parentAction(event, identity, addRemoveFunc, setBorderColor)} style={{margin:3}} 
        id={"ch_" + identity}
        type="checkbox" 
        value="" 
        className="absolute top-0 right-0 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
    )
}