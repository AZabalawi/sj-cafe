// Demo order submission — no backend yet. `submitOrder` is the one function
// a real API call would replace later (kitchen backend, payment capture,
// etc.); everything upstream of it (checkout form, validation) shouldn't
// need to change when that happens.

import type { CartLine } from "@/lib/cart";

const STORAGE_KEY = "sj-cafe-last-order";

export type OrderType = "pickup" | "car-pickup";

export type OrderCustomer = {
  name: string;
  mobile: string;
};

export type OrderCar = {
  model: string;
  plate: string;
};

export type DemoOrder = {
  reference: string;
  createdAt: string;
  customer: OrderCustomer;
  orderType: OrderType;
  car?: OrderCar;
  note?: string;
  items: CartLine[];
  subtotalFils: number;
  totalFils: number;
  // Reserved for the real payment integration (Phase 2): a card/Apple Pay
  // order would carry "unpaid" until the webhook confirms, then flip to
  // "paid". Cash orders are conceptually "unpaid" until collected in person.
  payment: {
    method: "cash-at-restaurant";
    status: "unpaid";
  };
};

function generateReference(): string {
  const n = Math.floor(1000 + Math.random() * 9000);
  return `SJ-${n}`;
}

export type SubmitOrderInput = {
  customer: OrderCustomer;
  orderType: OrderType;
  car?: OrderCar;
  note?: string;
  items: CartLine[];
  subtotalFils: number;
  totalFils: number;
};

// Synchronous today (nothing to await), but returns a Promise so swapping in
// a real `fetch("/api/orders", ...)` later is a drop-in change at the call
// site in app/checkout/page.tsx.
export async function submitOrder(input: SubmitOrderInput): Promise<DemoOrder> {
  const order: DemoOrder = {
    reference: generateReference(),
    createdAt: new Date().toISOString(),
    ...input,
    payment: { method: "cash-at-restaurant", status: "unpaid" },
  };
  window.sessionStorage.setItem(STORAGE_KEY, JSON.stringify(order));
  return order;
}

export function getLastOrder(reference: string): DemoOrder | null {
  try {
    const raw = window.sessionStorage.getItem(STORAGE_KEY);
    if (!raw) return null;
    const parsed = JSON.parse(raw) as DemoOrder;
    return parsed.reference === reference ? parsed : null;
  } catch {
    return null;
  }
}
