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
            printed: false
        },
        {
            date: new Date(),
            from: "Linje : 118 Aarhus Rutebilstation",
            arrival: new Date(),
            to: "ip",
            amount: "-28,80",
            printed: false
        },
        {
            date: new Date(),
            from: "Linje : 118 Aarhus Rutebilstation",
            arrival: new Date(),
            to: "ip",
            amount: "-28,80",
            printed: false
        },
        {
            date: new Date(),
            from: "Linje : 118 Aarhus Rutebilstation",
            arrival: new Date(),
            to: "ip",
            amount: "-28,80",
            printed: false
        },
        {
            date: new Date(),
            from: "Linje : 118 Aarhus Rutebilstation",
            arrival: new Date(),
            to: "ip",
            amount: "-28,80",
            printed: false
        },
        {
            date: new Date(),
            from: "Linje : 118 Aarhus Rutebilstation",
            arrival: new Date(),
            to: "ip",
            amount: "-28,80",
            printed: false
        },
    ]

    return data;
}