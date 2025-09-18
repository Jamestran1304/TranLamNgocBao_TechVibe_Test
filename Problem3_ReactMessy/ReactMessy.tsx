import React, { useMemo } from 'react';

interface WalletBalance {
  currency: string;
  amount: number;
  blockchain: BlockchainType;
}

interface FormattedWalletBalance {
  currency: string;
  amount: number;
  formatted: string;
  usdValue: number;
}

interface Props extends BoxProps {}

type BlockchainType = 'Osmosis' | 'Ethereum' | 'Arbitrum' | 'Zilliqa' | 'Neo';

// Move outside component to avoid recreation
const BLOCKCHAIN_PRIORITIES: Record<BlockchainType, number> = {
  'Osmosis': 100,
  'Ethereum': 50,
  'Arbitrum': 30,
  'Zilliqa': 20,
  'Neo': 20,
} as const;

const WalletPage: React.FC<Props> = (props) => {
  const { ...rest } = props;
  const balances = useWalletBalances();
  const prices = usePrices();

  const getPriority = (blockchain: BlockchainType): number => {
    return BLOCKCHAIN_PRIORITIES[blockchain] ?? -99;
  };

  const processedBalances = useMemo(() => {
    return balances
      .filter((balance: WalletBalance) => {
        const priority = getPriority(balance.blockchain);
        return priority > -99 && balance.amount > 0;
      })
      .sort((lhs: WalletBalance, rhs: WalletBalance) => {
        const leftPriority = getPriority(lhs.blockchain);
        const rightPriority = getPriority(rhs.blockchain);
        return rightPriority - leftPriority; // Descending order
      })
      .map((balance: WalletBalance): FormattedWalletBalance => {
        const usdValue = (prices[balance.currency] ?? 0) * balance.amount;
        return {
          ...balance,
          formatted: balance.amount.toFixed(),
          usdValue,
        };
      });
  }, [balances, prices]);

  const rows = processedBalances.map((balance: FormattedWalletBalance) => (
    <WalletRow
      className={classes.row}
      key={`${balance.currency}-${balance.blockchain}`} // Better key
      amount={balance.amount}
      usdValue={balance.usdValue}
      formattedAmount={balance.formatted}
    />
  ));

  return <div {...rest}>{rows}</div>;
};