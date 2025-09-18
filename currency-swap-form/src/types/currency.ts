export interface Currency {
  currency: string;
  price: number;
}

export interface CurrencyOption {
  label: string;
  value: string;
  price: number;
  icon: string;
}

export interface SwapFormData {
  fromCurrency: string;
  toCurrency: string;
  amount: number;
}

export interface ExchangeRate {
  rate: number;
  fromCurrency: string;
  toCurrency: string;
}
