import axios from 'axios';
import type { Currency, CurrencyOption } from '../types/currency';

const PRICES_API_URL = 'https://interview.switcheo.com/prices.json';
const TOKEN_ICON_BASE_URL = '/src/assets/icon';

export class CurrencyService {
  private static instance: CurrencyService;
  private currencies: Currency[] = [];
  private currencyOptions: CurrencyOption[] = [];

  private constructor() {}

  public static getInstance(): CurrencyService {
    if (!CurrencyService.instance) {
      CurrencyService.instance = new CurrencyService();
    }
    return CurrencyService.instance;
  }

  public async fetchCurrencies(): Promise<CurrencyOption[]> {
    try {
      const response = await axios.get<Currency[]>(PRICES_API_URL);
      this.currencies = response.data;
      this.currencyOptions = this.transformToOptions(response.data);
      return this.currencyOptions;
    } catch (error) {
      console.error('Error fetching currencies:', error);
      throw new Error('Failed to fetch currency data');
    }
  }

  private transformToOptions(currencies: Currency[]): CurrencyOption[] {
    return currencies.map(currency => ({
      label: currency.currency,
      value: currency.currency,
      price: currency.price,
      icon: `${TOKEN_ICON_BASE_URL}/${currency.currency}.svg`
    }));
  }

  public getCurrencyOptions(): CurrencyOption[] {
    return this.currencyOptions;
  }

  public getCurrencyBySymbol(symbol: string): CurrencyOption | undefined {
    return this.currencyOptions.find(option => option.value === symbol);
  }

  public calculateExchangeRate(fromSymbol: string, toSymbol: string): number {
    const fromCurrency = this.getCurrencyBySymbol(fromSymbol);
    const toCurrency = this.getCurrencyBySymbol(toSymbol);

    if (!fromCurrency || !toCurrency) {
      return 0;
    }

    // Convert from currency to USD, then from USD to target currency
    return fromCurrency.price / toCurrency.price;
  }

  public calculateSwapAmount(amount: number, fromSymbol: string, toSymbol: string): number {
    const rate = this.calculateExchangeRate(fromSymbol, toSymbol);
    return amount * rate;
  }
}
