'use client'

import React, { ReactElement } from "react"
import { ParentActionWithBorderChange } from '@/lib/AddRemoveFunction'

interface CheckboxProps {
  parentActionWithBorderChange: ParentActionWithBorderChange;
  identity: string; 
}

export default function SelectTripCheckbox({ identity, parentActionWithBorderChange}: CheckboxProps): ReactElement<any, any> {
    return (
        <input 
        onChange={event => parentActionWithBorderChange.toggleBorder(event, identity, parentActionWithBorderChange.addRemoveBorderColor)} style={{margin:3}} 
        id={"ch_" + identity}
        type="checkbox" 
        value="" 
        className="absolute top-0 right-0 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
    )
}