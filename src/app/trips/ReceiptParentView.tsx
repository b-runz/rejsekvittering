'use client'
import React, { ReactElement, useEffect, useCallback, useState } from "react";
import { Trip, cookiefyString, getTravelHistory, NextPage, getTravelHistoryNextPage } from '@/lib/RejseplanRequest';
import { getCookie } from 'cookies-next'
import { getPictureBytes } from '@/lib/PicturePrint';
import ReceiptBigScreen from './ReceiptBigScreen';
import ReceiptSmallScreen from './ReceiptSmallScreen';
import { getGuid, printName } from "@/lib/util";
import {useLocalStorage} from '@/lib/util';;

export default function ReceiptParentView(): ReactElement<any, any> {
    const [checkedReceipts, setCheckedReceipts] = React.useState(new Set<string>());
    const [checkPersisted, setCheckPersisted] = useLocalStorage("", new Set<string>())

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

    function setTripToPrinted(identity: string) {
        const moddedTrips = trips.map(t => {
            if (getGuid(t) == identity) {
                t.printed = true
                setCheckPersisted(prev => prev.add(identity))
            }
            return t
        })
        setTrips(moddedTrips)
    }

    async function printAll() {
        const JSZip = require('jszip');
        const zip = new JSZip();
        const pictureIds = [...checkedReceipts];
        for (const pictureId of pictureIds) {
            setTripToPrinted(pictureId)
            const trip = trips.find(trip => pictureId === getGuid(trip))!;
            const pictureBytes = await getPictureBytes(pictureId);

            zip.file(`${printName(trip)}.png`, pictureBytes);
        }

        const zipContent = await zip.generateAsync({ type: 'blob' });
        const link = document.createElement('a');
        link.href = URL.createObjectURL(zipContent);
        link.download = 'receipts.zip';
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    }

    const [trips, setTrips] = React.useState<Trip[]>([])
    const [isMounted, setIsMounted] = React.useState(false);
    const [loading, setLoading] = useState(false)
    const [width, setWidth] = React.useState(0);
    let nextPage: NextPage | null = null;

    const loadTrips = useCallback(async () => {
        setLoading(true);
        await new Promise(resolve => setTimeout(resolve, 10));
        window.scrollTo({
            top: document.body.scrollHeight,
            behavior: 'smooth'
        });
        let data: Trip[] = [];
        if (nextPage == null) {
            const rkCookie = getCookie("rklogin")!
            const cookie = await cookiefyString(rkCookie)
            const tripsAndNextPage = await getTravelHistory(cookie);
            data = tripsAndNextPage.trips;
            nextPage = tripsAndNextPage.nextPage
        }
        else {
            const tripsAndNextPage = await getTravelHistoryNextPage(nextPage);
            data = tripsAndNextPage.trips;
            nextPage = tripsAndNextPage.nextPage
        }
        for(const t of data){
            if(checkPersisted.has(getGuid(t))){
                t.printed = true
            }
        }
        setTrips(prevTrips => [...prevTrips, ...data]);
        setLoading(false);

    }, []);

    useEffect(() => {
        setIsMounted(true);
    }, []);

    useEffect(() => {
        if (isMounted) {
            setWidth(window.innerWidth);
            loadTrips();
        }
    }, [isMounted]);

    return (
        <div className="flex flex-col h-screen">
            <div className="flex items-center justify-center pb-16">
                <p className="text-4xl font-bold">Receipts</p>
            </div>
            <div className="flex-none">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8 w-full">

                    {trips.map((trip, id) => (
                        width < 768 ?
                            <ReceiptSmallScreen trip={trip} identity={getGuid(trip)} key={id} addRemoveFunc={{ add: addCheckedFromPrintAll, remove: removeCheckedFromPrintAll, checkPrinted: setTripToPrinted }}></ReceiptSmallScreen>
                            :
                            <ReceiptBigScreen trip={trip} identity={getGuid(trip)} key={id} addRemoveFunc={{ add: addCheckedFromPrintAll, remove: removeCheckedFromPrintAll, checkPrinted: setTripToPrinted }}></ReceiptBigScreen>
                    ))}

                    {loading ? (
                        <div className="pb-2 mx-auto border-2 rounded shadow-md bg-white">
                            <div style={{ width: 380, height: 350 }} className="flex flex-col items-center justify-center">
                                <div className="w-16 h-16 border-t-4 border-blue-500 rounded-full animate-spin"></div>
                                <p>Loading...</p>
                            </div>
                        </div>
                    ) : null}
                </div>

            </div>
            <div className="flex-grow"></div>
            <footer className="bg-gray-200 flex justify-center items-center mt-8">
                <button onClick={loadTrips} className="bg-white hover:bg-blue-500 text-blue-700 font-semibold hover:text-white m-2 py-2 px-4 border border-blue-500 hover:border-transparent rounded">Load More Receipts</button>
            </footer>


            {checkedReceipts.size > 0 && (
                <div className="fixed bottom-0 w-full bg-gray-200 flex justify-center items-center">
                    <button onClick={printAll} className="bg-white hover:bg-blue-500 text-blue-700 font-semibold hover:text-white m-2 py-2 px-4 border border-blue-500 hover:border-transparent rounded">Print Selected Receipts</button>
                </div>
            )}

        </div>
    )
}