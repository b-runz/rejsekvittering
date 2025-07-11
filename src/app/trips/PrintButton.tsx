'use client'

import { ReactElement } from "react"
import { printPicture } from '@/lib/PicturePrint'

interface ButtonProps {
    identity: string
    fileName: string
    checkPrinted: (identity :string) => void;
}

export default function PrintButton({ identity, fileName, checkPrinted }: ButtonProps) {
    return (
        <button onClick={() => {
            printPicture(identity, fileName)
            checkPrinted(identity)
        }} id={"b_" + identity} className="bg-transparent hover:bg-blue-500 text-blue-700 font-semibold hover:text-white py-2 px-4 border border-blue-500 hover:border-transparent rounded" style={{marginLeft: 20}}>Print</button>
    )
}