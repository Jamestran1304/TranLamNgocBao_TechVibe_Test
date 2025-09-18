import React from 'react';
import Select, { components } from 'react-select';
import type { SingleValue, ActionMeta } from 'react-select';
import type { CurrencyOption } from '../types/currency';
import './CurrencySelector.css';

interface CurrencySelectorProps {
  options: CurrencyOption[];
  value: CurrencyOption | null;
  onChange: (option: CurrencyOption | null, actionMeta: ActionMeta<CurrencyOption>) => void;
  placeholder?: string;
  isDisabled?: boolean;
  error?: string;
}

const CustomOption = (props: any) => {
  const { data, isSelected, isFocused } = props;
  
  return (
    <components.Option {...props}>
      <div className={`currency-option ${isSelected ? 'selected' : ''} ${isFocused ? 'focused' : ''}`}>
        <div className="currency-icon">
          <img 
            src={data.icon} 
            alt={data.label}
            onError={(e) => {
              // Fallback to a default icon if the token icon fails to load
              e.currentTarget.src = '/src/assets/icon/Token.svg';
            }}
          />
        </div>
        <div className="currency-info">
          <span className="currency-symbol">{data.label}</span>
          <span className="currency-price">${data.price.toFixed(6)}</span>
        </div>
      </div>
    </components.Option>
  );
};

const CustomSingleValue = (props: any) => {
  const { data } = props;
  
  return (
    <components.SingleValue {...props}>
      <div className="currency-single-value">
        <div className="currency-icon">
          <img 
            src={data.icon} 
            alt={data.label}
            onError={(e) => {
              e.currentTarget.src = '/src/assets/icon/Token.svg';
            }}
          />
        </div>
        <span className="currency-symbol">{data.label}</span>
      </div>
    </components.SingleValue>
  );
};

const CustomControl = (props: any) => {
  return (
    <components.Control {...props} className="currency-control">
      {props.children}
    </components.Control>
  );
};

const CurrencySelector: React.FC<CurrencySelectorProps> = ({
  options,
  value,
  onChange,
  placeholder = "Select currency",
  isDisabled = false,
  error
}) => {
  return (
    <div className="currency-selector">
      <Select
        value={value}
        onChange={onChange}
        options={options}
        components={{
          Option: CustomOption,
          SingleValue: CustomSingleValue,
          Control: CustomControl,
          IndicatorSeparator: () => null,
        }}
        placeholder={placeholder}
        isDisabled={isDisabled}
        isSearchable={true}
        isClearable={false}
        className={`currency-select ${error ? 'error' : ''}`}
        classNamePrefix="currency-select"
        styles={{
          control: (provided) => ({
            ...provided,
            border: error ? '2px solid #ef4444' : '2px solid #e5e7eb',
            borderRadius: '12px',
            minHeight: '60px',
            boxShadow: 'none',
            '&:hover': {
              border: error ? '2px solid #ef4444' : '2px solid #d1d5db',
            },
            '&:focus-within': {
              border: error ? '2px solid #ef4444' : '2px solid #3b82f6',
              boxShadow: error ? '0 0 0 3px rgba(239, 68, 68, 0.1)' : '0 0 0 3px rgba(59, 130, 246, 0.1)',
            },
          }),
          valueContainer: (provided) => ({
            ...provided,
            padding: '8px 16px',
          }),
          input: (provided) => ({
            ...provided,
            margin: 0,
            padding: 0,
          }),
          menu: (provided) => ({
            ...provided,
            borderRadius: '12px',
            border: '1px solid #e5e7eb',
            boxShadow: '0 10px 25px -5px rgba(0, 0, 0, 0.1), 0 10px 10px -5px rgba(0, 0, 0, 0.04)',
            marginTop: '4px',
          }),
          menuList: (provided) => ({
            ...provided,
            padding: '8px',
            maxHeight: '300px',
          }),
          option: (provided, state) => ({
            ...provided,
            backgroundColor: state.isSelected 
              ? '#3b82f6' 
              : state.isFocused 
                ? '#f3f4f6' 
                : 'transparent',
            borderRadius: '8px',
            margin: '2px 0',
            padding: '12px',
            cursor: 'pointer',
            '&:hover': {
              backgroundColor: state.isSelected ? '#3b82f6' : '#f3f4f6',
            },
          }),
        }}
      />
      {error && <div className="error-message">{error}</div>}
    </div>
  );
};

export default CurrencySelector;
