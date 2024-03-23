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

  import { useState } from 'react';

export const useLocalStorage = (key: string, initialValue: Set<string>): [Set<string>, (value: Set<string> | ((prevState: Set<string>) => Set<string>)) => void] => {
  const [state, setState] = useState<Set<string>>(() => {
    // Initialize the state
    try {
      const value = window.localStorage.getItem(key);
      // Check if the local storage already has any values,
      // otherwise initialize it with the passed initialValue
      return value ? new Set(JSON.parse(value)) : initialValue;
    } catch (error) {
      console.log(error);
      return initialValue; // Return initialValue in case of error
    }
  });

  const setValue = (value: Set<string> | ((prevState: Set<string>) => Set<string>)) => {
    try {
      // If the passed value is a callback function,
      // then call it with the existing state.
      const valueToStore = value instanceof Function ? value(state) : value;
      window.localStorage.setItem(key, JSON.stringify(Array.from(valueToStore)));
      setState(valueToStore);
    } catch (error) {
      console.log(error);
    }
  };

  return [state, setValue];
};