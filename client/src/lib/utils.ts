import { clsx, type ClassValue } from "clsx"
import { twMerge } from "tailwind-merge";
import animationData from "@/assets/lottie-json.json"

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs))
}


export const colors:string[]=[
  "bg-[#712c4a57] text-[#ff006e] border-[1px] border-[#ff006faa]",
  "bg-[#ffd60a2a] text-[#ffd60a] border-[1px] border-[#ffd60abb]",
  "bg-[#06d6a02a] text-[#06d6a0] border-[1px] border-[#06d6a0bb]",
  "bg-[#4cc9f02a] text-[#4cc9f0] border-[1px] border-[#4cc9f099]"
]

export const getColor=(color:unknown):string=>{
  if(typeof color === "number"&&color>0 && color<colors.length){
    return colors[color]
  }

  return colors[0];
}

export const animationDefaultOption={
  loop:true,
  autoplay:true,
  animationData
}