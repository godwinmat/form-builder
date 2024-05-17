import { type ClassValue, clsx } from "clsx";
import { twMerge } from "tailwind-merge";
import { v4 as uuidv4 } from "uuid";

export function cn(...inputs: ClassValue[]) {
    return twMerge(clsx(inputs));
}

export function generateId() {
    return uuidv4();
}

export function capitalizeFirstLetter(word: string) {
    if (typeof word !== "string" || word.length === 0) {
        return word; // Return the original value if it's not a string or if it's empty
    }
    return word.charAt(0).toUpperCase() + word.slice(1);
}

export function getObjectWithKeys<T extends object, K extends keyof T>(
    keys: K[],
    obj: T
): Pick<T, K> {
    return keys.reduce((result, key) => {
        if (key in obj) {
            result[key] = obj[key];
        }
        return result;
    }, {} as Pick<T, K>);
}
