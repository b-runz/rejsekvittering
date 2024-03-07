'use client'

import { ReactElement } from "react"

interface CheckboxProps {
    identity: string
}

export default function SelectTripCheckbox({ identity }: CheckboxProps): ReactElement<any, any> {
    function toggleBorder(identity: string, checkboxEvent: React.ChangeEvent<HTMLInputElement>){
        const checkbox = checkboxEvent.target;
        const identityElement = document.getElementById(identity)!;
        if (checkbox.checked) {
          // Checkbox is checked, set border to green using Tailwind class
          identityElement.classList.add('border-green-500');
          identityElement.classList.remove('border-green-100');
        } else {
          // Checkbox is unchecked, remove green border
          identityElement.classList.add('border-gray-100');
          identityElement.classList.remove('border-green-500');
        }
      }

    return (
        <input 
        onChange={event => toggleBorder(identity, event)} style={{margin:3}} 
        id={"ch_" + identity}
        type="checkbox" 
        value="" 
        className="absolute top-0 right-0 w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 dark:focus:ring-blue-600 dark:ring-offset-gray-800 focus:ring-2 dark:bg-gray-700 dark:border-gray-600"></input>
    )
}