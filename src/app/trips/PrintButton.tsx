'use client'

import { ReactElement } from "react"
import { printPicture } from '@/lib/PicturePrint'

interface ButtonProps {
    identity: string
    fileName: string
}

export default function PrintButton({ identity, fileName }: ButtonProps): ReactElement<any, any> {
    return (
        <button onClick={() => {
            printPicture(identity, fileName)
        }} id={"b_" + identity} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" style={{marginLeft: 20}}>Print</button>
    )
}