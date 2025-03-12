import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatPrice(num: number): string {
  if (isNaN(num)) {
    throw new Error("Invalid number");
  }

  // Convert the number to a string
  const numStr = num.toString();

  // Split the number into parts before and after the decimal point
  const parts = numStr.split(".");
  const integerPart = parts[0];
  const decimalPart = parts.length > 1 ? `.${parts[1]}` : "";

  // Format the integer part according to the Indian system
  let lastThree = integerPart.slice(-3);
  const otherNumbers = integerPart.slice(0, -3);

  if (otherNumbers !== "") {
    lastThree = "," + lastThree;
  }

  const result =
    otherNumbers.replace(/\B(?=(\d{2})+(?!\d))/g, ",") +
    lastThree +
    decimalPart;

  return result;
}