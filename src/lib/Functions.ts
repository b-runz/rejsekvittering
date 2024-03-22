'use server'

import { Trip } from "./RejseplanRequest";

export async function loadTripsServer() :Promise<Trip[]> {
    const ipPage = await fetch("http://ipnr.dk")
    const ip = await ipPage.text()

    await new Promise(resolve => setTimeout(resolve, 2000));

    const data : Trip[] = [
        {
            date: new Date(),
            from: "Linje : 118 Aarhus Rutebilstation",
            arrival: new Date(),
            to: "ip",
            amount: "-28,80",
            printed: false,
            id: 42
        },
        {
            date: new Date(),
            from: "Linje : 118 Aarhus Rutebilstation",
            arrival: new Date(),
            to: "ip",
            amount: "-28,80",
            printed: false,
            id: 142
        },
        {
            date: new Date(),
            from: "Linje : 118 Aarhus Rutebilstation",
            arrival: new Date(),
            to: "ip",
            amount: "-28,80",
            printed: false,
            id: 242
        },
        {
            date: new Date(),
            from: "Linje : 118 Aarhus Rutebilstation",
            arrival: new Date(),
            to: "ip",
            amount: "-28,80",
            printed: false,
            id: 342
        },
        {
            date: new Date(),
            from: "Linje : 118 Aarhus Rutebilstation",
            arrival: new Date(),
            to: "ip",
            amount: "-28,80",
            printed: false,
            id: 442
        },
        {
            date: new Date(),
            from: "Linje : 118 Aarhus Rutebilstation",
            arrival: new Date(),
            to: "ip",
            amount: "-28,80",
            printed: false,
            id: 542
        },
    ]

    return data;
}