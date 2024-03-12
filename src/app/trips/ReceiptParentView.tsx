'use client'
import React, { ReactElement } from "react";
import { Trip, getGuid } from '@/lib/RejseplanRequest'
import { getPictureBytes } from '@/lib/PicturePrint'
import Receipt from './Receipt';

interface ReceiptProps {
    trips: Trip[];
}

export default function ReceiptParentView({ trips }: ReceiptProps): ReactElement<any, any> {
    const [checkedReceipts, setCheckedReceipts] = React.useState(new Set<string>());

    function removeCheckedFromPrintAll(checked: string): void {
        setCheckedReceipts(function (prev: Set<string>): Set<string> {
            const filteredArray = Array.from(prev).filter(x => x !== checked);
            return new Set(filteredArray);
        });
    }

    function addCheckedFromPrintAll(checked: string): void {
        setCheckedReceipts(function (prev) {
            const newSet = new Set(prev);
            newSet.add(checked);
            return newSet;
        });
    }

    async function printAll() {
        const JSZip = require('jszip');
        const zip = new JSZip();
        const pictureIds = [...checkedReceipts];
        for (const pictureId of pictureIds) {
            const pictureBytes = await getPictureBytes(pictureId);

            zip.file(`${pictureId}.png`, pictureBytes);
        }

        const zipContent = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipContent);
        link.download = 'receipts.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    return (

        <div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">
                {trips.map((trip, id) => (
                    <Receipt trip={trip} identity={getGuid(trip)} key={id} addRemoveFunc={{ add: addCheckedFromPrintAll, remove: removeCheckedFromPrintAll }}></Receipt>
                ))}
            </div>
            recpts: {checkedReceipts.size}

            {checkedReceipts.size > 0 && (
                <div className="fixed bottom-0 w-full">
                    <button onClick={printAll}>TETSTST</button>
                </div>
            )}

        </div>
    )
}