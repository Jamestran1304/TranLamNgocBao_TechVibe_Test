# Currency Swap Form

A modern, responsive currency swap application built with React, TypeScript, and Vite. This application allows users to swap between different cryptocurrencies with real-time exchange rates.

## Features

- **Real-time Exchange Rates**: Fetches live currency prices from the Switcheo API
- **Token Icons**: Displays authentic token icons from the Switcheo token-icons repository
- **Interactive UI**: Modern, gradient-based design with smooth animations
- **Form Validation**: Comprehensive input validation with error messages
- **Responsive Design**: Works seamlessly on desktop and mobile devices
- **TypeScript**: Full type safety throughout the application
- **Loading States**: Smooth loading animations and user feedback

## Technologies Used

- **React 19** - Modern React with latest features
- **TypeScript** - Type-safe development
- **Vite** - Fast build tool and development server
- **React Hook Form** - Efficient form handling
- **Yup** - Schema validation
- **React Select** - Customizable select components
- **Axios** - HTTP client for API requests
- **Lucide React** - Beautiful icons
- **CSS3** - Modern styling with gradients and animations

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- Yarn package manager

### Installation

1. Clone the repository
2. Navigate to the project directory:
   ```bash
   cd currency-swap-form
   ```

3. Install dependencies:
   ```bash
   yarn install
   ```

4. Start the development server:
   ```bash
   yarn dev
   ```

5. Open your browser and navigate to `http://localhost:5173`

## Usage

1. **Select From Currency**: Choose the currency you want to swap from
2. **Select To Currency**: Choose the currency you want to swap to
3. **Enter Amount**: Input the amount you want to swap
4. **View Exchange Rate**: See the real-time exchange rate and estimated amount
5. **Swap**: Click the "Swap Currencies" button to process the transaction

## API Integration

The application integrates with:
- **Switcheo Prices API**: `https://interview.switcheo.com/prices.json` for real-time currency prices
- **Switcheo Token Icons**: `https://raw.githubusercontent.com/Switcheo/token-icons/main/tokens/` for token images

## Project Structure

```
src/
├── components/
│   ├── CurrencySelector.tsx      # Custom currency selector component
│   ├── CurrencySelector.css      # Styling for currency selector
│   ├── CurrencySwapForm.tsx      # Main swap form component
│   └── CurrencySwapForm.css      # Styling for swap form
├── services/
│   └── currencyService.ts        # Currency data service
├── types/
│   └── currency.ts               # TypeScript type definitions
├── App.tsx                       # Main application component
├── App.css                       # Global application styles
└── main.tsx                      # Application entry point
```

## Features in Detail

### Currency Selection
- Dropdown with search functionality
- Token icons for visual identification
- Real-time price display
- Error handling for missing icons

### Form Validation
- Required field validation
- Positive number validation
- Minimum amount validation
- Real-time error display

### Exchange Rate Calculation
- Real-time rate calculation
- Estimated amount preview
- Rate display with proper formatting

### User Experience
- Loading states during data fetching
- Smooth animations and transitions
- Responsive design for all screen sizes
- Error handling with user-friendly messages

## Development

### Available Scripts

- `yarn dev` - Start development server
- `yarn build` - Build for production
- `yarn preview` - Preview production build
- `yarn lint` - Run ESLint

### Code Quality

The project uses:
- ESLint for code linting
- TypeScript for type checking
- Prettier for code formatting (recommended)

## Browser Support

- Chrome (latest)
- Firefox (latest)
- Safari (latest)
- Edge (latest)

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is open source and available under the [MIT License](LICENSE).