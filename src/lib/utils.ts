import { type ClassValue, clsx } from "clsx"
import { twMerge } from "tailwind-merge"
 
export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}

export function formatRupiah(angka: number) {
  const reverse = angka.toString().split("").reverse().join("");
  const ribuan = reverse.match(/\d{1,3}/g);
  const formatted = ribuan?.join(".").split("").reverse().join("");
  return "Rp " + formatted;
}

