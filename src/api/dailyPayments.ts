import type { Payment } from "../types";

export const getPayments = (resolve: (data: Payment[]) => void, reject: () => void) => {
  return fetch('http://localhost:3000/dailyPayments')
      .then((response) => {
        if (!response.ok) {
          throw new Error('Error occurred!')
        }
        return response.json();
      })
      .then(resolve)
      .catch(reject);
}