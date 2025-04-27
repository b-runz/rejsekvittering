'use client'

import React, { ReactElement } from "react";
import { Trip } from '@/lib/RejseplanRequest'
import styles from './Receipt.module.css'
import PrintButton from "./PrintButton";
import Image from 'next/image'
import SelectTripCheckbox from "./SelectTripCheckbox";
import { ParentActionWithBorderChange} from '@/lib/AddRemoveFunction'
import { printName } from "@/lib/util";

interface ReceiptProps {
    trip: Trip;
    identity: string;
    parentActionWithBorderChange: ParentActionWithBorderChange;
}
export default function ReceiptCommon({ trip, identity, parentActionWithBorderChange }: ReceiptProps): ReactElement<any, any> {
    const formatDate = (date: Date) => {
        return new Intl.DateTimeFormat('en-US', { 
            month: 'long', 
            day: 'numeric', 
            year: 'numeric',
            hour: '2-digit', 
            minute: '2-digit',
            hour12: false, // Set to true for 12-hour clock, false for 24-hour clock
            timeZone: 'Europe/Paris'
        }).format(date);
    };
    
    return (
        <div>
            <div className="relative w-full">
                <Image src={'/rk.svg'} alt="Logo" width={180} height={27} style={{ paddingLeft: 25 }} className="absolute top-0 left-0 p-3"></Image>
                <SelectTripCheckbox identity={identity} parentActionWithBorderChange={parentActionWithBorderChange}></SelectTripCheckbox>
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
            <PrintButton identity={identity} fileName={printName(trip)} checkPrinted={parentActionWithBorderChange.addRemoveBorderColor.addRemoveFunc.checkPrinted}></PrintButton>
        </div>
    )
}
