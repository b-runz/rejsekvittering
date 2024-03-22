import { Trip } from "./RejseplanRequest";
import crypto from 'crypto';

export function printName(trip: Trip): string {
    const formattedDate = `${trip.date.getFullYear().toString().slice(-2)}-${(
      "0" +
      (trip.date.getMonth() + 1)
    ).slice(-2)}-${("0" + trip.date.getDate()).slice(-2)}`;
    const formattedAmount = Math.abs(parseFloat(trip.amount)).toFixed(2);
    return `${formattedDate}_${trip.id}_${formattedAmount}`;
  }

  export function getGuid(trip: Trip): string {
    const hasher = crypto.createHash('sha256');
    const data = `${trip.to}${trip.amount}${trip.id}`; // concatenate the strings
    hasher.update(data);
    return hasher.digest('hex');
  }