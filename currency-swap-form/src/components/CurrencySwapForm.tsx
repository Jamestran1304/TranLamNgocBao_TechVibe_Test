import React, { useEffect, useState, useCallback } from 'react';
import { useForm, Controller } from 'react-hook-form';
import { yupResolver } from '@hookform/resolvers/yup';
import * as yup from 'yup';
import { ArrowUpDown, Loader2, AlertCircle, CheckCircle } from 'lucide-react';
import CurrencySelector from './CurrencySelector';
import { CurrencyService } from '../services/currencyService';
import type { CurrencyOption, SwapFormData } from '../types/currency';
import './CurrencySwapForm.css';

const schema = yup.object().shape({
  fromCurrency: yup.string().required('Please select a currency to swap from'),
  toCurrency: yup.string().required('Please select a currency to swap to'),
  amount: yup
    .number()
    .required('Amount is required')
    .positive('Amount must be greater than 0')
    .min(0.000001, 'Amount must be at least 0.000001'),
});

const CurrencySwapForm: React.FC = () => {
  const [currencyOptions, setCurrencyOptions] = useState<CurrencyOption[]>([]);
  const [isLoading, setIsLoading] = useState(true);
  const [isSwapping, setIsSwapping] = useState(false);
  const [swapResult, setSwapResult] = useState<{
    amount: number;
    fromCurrency: string;
    toCurrency: string;
    rate: number;
  } | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [exchangeRate, setExchangeRate] = useState<number | null>(null);

  const currencyService = CurrencyService.getInstance();

  const {
    control,
    handleSubmit,
    watch,
    setValue,
    formState: { errors },
  } = useForm<SwapFormData>({
    resolver: yupResolver(schema),
    defaultValues: {
      fromCurrency: '',
      toCurrency: '',
      amount: 0,
    },
  });

  const watchedValues = watch();

  // Fetch currencies on component mount
  useEffect(() => {
    const fetchCurrencies = async () => {
      try {
        setIsLoading(true);
        setError(null);
        const options = await currencyService.fetchCurrencies();
        setCurrencyOptions(options);
      } catch (err) {
        setError('Failed to load currency data. Please try again later.');
        console.error('Error fetching currencies:', err);
      } finally {
        setIsLoading(false);
      }
    };

    fetchCurrencies();
  }, [currencyService]);

  // Calculate exchange rate when currencies change
  useEffect(() => {
    if (watchedValues.fromCurrency && watchedValues.toCurrency) {
      const rate = currencyService.calculateExchangeRate(
        watchedValues.fromCurrency,
        watchedValues.toCurrency
      );
      setExchangeRate(rate);
    } else {
      setExchangeRate(null);
    }
  }, [watchedValues.fromCurrency, watchedValues.toCurrency, currencyService]);

  const handleSwapCurrencies = useCallback(() => {
    const fromCurrency = watchedValues.fromCurrency;
    const toCurrency = watchedValues.toCurrency;
    
    if (fromCurrency && toCurrency) {
      setValue('fromCurrency', toCurrency);
      setValue('toCurrency', fromCurrency);
    }
  }, [watchedValues.fromCurrency, watchedValues.toCurrency, setValue]);

  const onSubmit = async (data: SwapFormData) => {
    try {
      setIsSwapping(true);
      setError(null);
      
      // Simulate API call delay for better UX
      await new Promise(resolve => setTimeout(resolve, 1500));
      
      const swapAmount = currencyService.calculateSwapAmount(
        data.amount,
        data.fromCurrency,
        data.toCurrency
      );

      const rate = currencyService.calculateExchangeRate(
        data.fromCurrency,
        data.toCurrency
      );

      setSwapResult({
        amount: swapAmount,
        fromCurrency: data.fromCurrency,
        toCurrency: data.toCurrency,
        rate: rate,
      });
    } catch (err) {
      setError('Failed to process swap. Please try again.');
      console.error('Error processing swap:', err);
    } finally {
      setIsSwapping(false);
    }
  };

  const formatAmount = (amount: number | string | null | undefined): string => {
    if (amount === null || amount === undefined) {
      return '0.000000';
    }
    
    const numAmount = typeof amount === 'string' ? parseFloat(amount) : amount;
    
    if (isNaN(numAmount)) {
      return '0.000000';
    }
    
    if (numAmount >= 1) {
      return numAmount.toFixed(6);
    } else if (numAmount >= 0.01) {
      return numAmount.toFixed(8);
    } else {
      return numAmount.toExponential(6);
    }
  };

  if (isLoading) {
    return (
      <div className="currency-swap-form loading">
        <div className="loading-container">
          <Loader2 className="loading-spinner" />
          <p>Loading currencies...</p>
        </div>
      </div>
    );
  }

  return (
    <div className="currency-swap-form">
      <div className="form-header">
        <h1>Currency Swap</h1>
        <p>Exchange your assets instantly with real-time rates</p>
      </div>

      <form onSubmit={handleSubmit(onSubmit)} className="swap-form">
        <div className="form-section">
          <label className="form-label">From</label>
          <Controller
            name="fromCurrency"
            control={control}
            render={({ field }) => (
              <CurrencySelector
                options={currencyOptions}
                value={currencyOptions.find(option => option.value === field.value) || null}
                onChange={(option) => field.onChange(option?.value || '')}
                placeholder="Select currency to swap from"
                error={errors.fromCurrency?.message}
              />
            )}
          />
        </div>

        <div className="swap-button-container">
          <button
            type="button"
            className="swap-currencies-btn"
            onClick={handleSwapCurrencies}
            disabled={!watchedValues.fromCurrency || !watchedValues.toCurrency}
            title="Swap currencies"
          >
            <ArrowUpDown size={20} />
          </button>
        </div>

        <div className="form-section">
          <label className="form-label">To</label>
          <Controller
            name="toCurrency"
            control={control}
            render={({ field }) => (
              <CurrencySelector
                options={currencyOptions}
                value={currencyOptions.find(option => option.value === field.value) || null}
                onChange={(option) => field.onChange(option?.value || '')}
                placeholder="Select currency to swap to"
                error={errors.toCurrency?.message}
              />
            )}
          />
        </div>

        <div className="form-section">
          <label className="form-label">Amount</label>
          <Controller
            name="amount"
            control={control}
            render={({ field }) => (
              <div className="amount-input-container">
                <input
                  {...field}
                  type="number"
                  step="any"
                  min="0"
                  placeholder="0.00"
                  className={`amount-input ${errors.amount ? 'error' : ''}`}
                />
                {watchedValues.fromCurrency && (
                  <div className="currency-balance">
                    {currencyOptions.find(opt => opt.value === watchedValues.fromCurrency)?.label}
                  </div>
                )}
              </div>
            )}
          />
          {errors.amount && (
            <div className="error-message">{errors.amount.message}</div>
          )}
        </div>

        {exchangeRate && watchedValues.amount > 0 && (
          <div className="exchange-rate-info">
            <div className="rate-display">
              <span>Exchange Rate:</span>
              <span>1 {watchedValues.fromCurrency} = {formatAmount(exchangeRate)} {watchedValues.toCurrency}</span>
            </div>
            <div className="estimated-amount">
              <span>Estimated Amount:</span>
              <span>{formatAmount(watchedValues.amount * exchangeRate)} {watchedValues.toCurrency}</span>
            </div>
          </div>
        )}

        {error && (
          <div className="error-banner">
            <AlertCircle size={20} />
            <span>{error}</span>
          </div>
        )}

        <button
          type="submit"
          className={`submit-button ${isSwapping ? 'swapping' : ''}`}
          disabled={isSwapping || !watchedValues.fromCurrency || !watchedValues.toCurrency || !watchedValues.amount}
        >
          {isSwapping ? (
            <>
              <Loader2 className="button-spinner" />
              Processing Swap...
            </>
          ) : (
            'Swap Currencies'
          )}
        </button>
      </form>

      {swapResult && (
        <div className="swap-result">
          <div className="result-header">
            <CheckCircle className="success-icon" />
            <h3>Swap Successful!</h3>
          </div>
          <div className="result-details">
            <div className="result-row">
              <span>You swapped:</span>
              <span>{formatAmount(watchedValues.amount || 0)} {swapResult.fromCurrency}</span>
            </div>
            <div className="result-row">
              <span>You received:</span>
              <span>{formatAmount(swapResult.amount)} {swapResult.toCurrency}</span>
            </div>
            <div className="result-row">
              <span>Exchange Rate:</span>
              <span>1 {swapResult.fromCurrency} = {formatAmount(swapResult.rate)} {swapResult.toCurrency}</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default CurrencySwapForm;
