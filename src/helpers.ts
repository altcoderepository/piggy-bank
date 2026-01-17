import type { Payment } from "./types";

export const getTotalAmount = (payments: Payment[]) => 
  payments.reduce((acc, payment) => acc + payment.nominal, 0);

export const getDeposited = (payments: Payment[]) => payments
    .filter((payment) => Boolean(payment.isPaid))
    .reduce((acc, payment) => acc + payment.nominal, 0);

export const getPercent = (deposited: number, totalAmount: number) => 
  Math.floor(deposited / (totalAmount / 100));