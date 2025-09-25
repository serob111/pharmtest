import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function joinNames(items: { name: string }[]): string {
  return items.map(item => item.name).join(", ")
}

export function generateSecurePassword(): string {
  const upper = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ';
  const lower = 'abcdefghijklmnopqrstuvwxyz';
  const numbers = '0123456789';
  const special = '!?@#$%^&*';
  const all = upper + lower + numbers + special;

  function getRandomChar(str: string) {
    return str[Math.floor(Math.random() * str.length)];
  }

  const required = [
    getRandomChar(upper),
    getRandomChar(lower),
    getRandomChar(numbers),
    getRandomChar(special)
  ];

  const remainingLength = 8 - required.length;
  for (let i = 0; i < remainingLength; i++) {
    required.push(getRandomChar(all));
  }

  return required
    .sort(() => Math.random() - 0.5)
    .join('');
}

export function isErrorWithResponse<T>(error: unknown): error is { response: { data: T } } {
  return typeof error === "object" && error !== null && "response" in error;
}


export function parseDateString(str: string): Date {
  const [datePart, tz] = str.split("+");
  const [day, month, year] = datePart.split(" ")[0].split(".");
  const time = datePart.split(" ")[1];
  return new Date(`${year}-${month}-${day}T${time}+${tz}`);
}