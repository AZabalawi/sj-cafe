"use client";

import { MinusIcon, PlusIcon } from "@/components/icons";

type QuantityStepperProps = {
  qty: number;
  onIncrement: () => void;
  onDecrement: () => void;
  size?: "sm" | "lg";
};

export function QuantityStepper({ qty, onIncrement, onDecrement, size = "sm" }: QuantityStepperProps) {
  const isLg = size === "lg";
  const buttonSize = isLg ? "h-10 w-10" : "h-7 w-7";
  const iconSize = isLg ? "h-4 w-4" : "h-3 w-3";
  const textSize = isLg ? "min-w-[2ch] text-base" : "min-w-[1.5ch] text-sm";

  return (
    <div
      className={`inline-flex items-center gap-1 rounded-full bg-brand-navy text-white shadow-sm ${isLg ? "p-1" : "p-0.5"}`}
    >
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onDecrement();
        }}
        aria-label="Decrease quantity"
        className={`flex ${buttonSize} items-center justify-center rounded-full transition-colors hover:bg-white/15 active:scale-95`}
      >
        <MinusIcon className={iconSize} />
      </button>
      <span className={`text-center font-bold tabular-nums ${textSize}`}>{qty}</span>
      <button
        type="button"
        onClick={(e) => {
          e.stopPropagation();
          onIncrement();
        }}
        aria-label="Increase quantity"
        className={`flex ${buttonSize} items-center justify-center rounded-full transition-colors hover:bg-white/15 active:scale-95`}
      >
        <PlusIcon className={iconSize} />
      </button>
    </div>
  );
}
