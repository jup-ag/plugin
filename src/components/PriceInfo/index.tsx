import { TransactionFeeInfo, calculateFeeForSwap } from '@jup-ag/react-hook';
import { TokenInfo } from '@solana/spl-token-registry';
import Decimal from 'decimal.js';
import JSBI from 'jsbi';
import { useEffect, useMemo, useState } from 'react';
import { useWalletPassThrough } from 'src/contexts/WalletPassthroughProvider';
import { useAccounts } from 'src/contexts/accounts';
import { formatNumber } from 'src/misc/utils';
import ExchangeRate from '../ExchangeRate';
import Deposits from './Deposits';
import Fees from './Fees';
import TransactionFee from './TransactionFee';
import { QuoteResponse } from 'src/contexts/SwapContext';
import { cn } from 'src/misc/cn';
import { useUltraRouters } from 'src/queries/useUltraRouter';

const Index = ({
  quoteResponse,
  fromTokenInfo,
  toTokenInfo,
  loading,
  showFullDetails = false,
  containerClassName,
}: {
  quoteResponse: QuoteResponse;
  fromTokenInfo: TokenInfo;
  toTokenInfo: TokenInfo;
  loading: boolean;
  showFullDetails?: boolean;
  containerClassName?: string;
}) => {
  const rateParams = {
    inAmount: quoteResponse?.quoteResponse.inAmount || JSBI.BigInt(0), // If there's no selectedRoute, we will use first route value to temporarily calculate
    inputDecimal: fromTokenInfo.decimals,
    outAmount: quoteResponse?.quoteResponse.outAmount || JSBI.BigInt(0), // If there's no selectedRoute, we will use first route value to temporarily calculate
    outputDecimal: toTokenInfo.decimals,
  };

  const { data: routerInfo } = useUltraRouters({
    select: (data) => {
      if (!quoteResponse) {
        return null;
      }
      return data.find((router) => router.id === quoteResponse.quoteResponse.router);
    },
  });

  const priceImpact = formatNumber.format(
    new Decimal(quoteResponse?.quoteResponse.priceImpactPct || 0).mul(100).toDP(2),
  );

  const priceImpactText = Number(priceImpact) < 0.01 ? undefined : `-${priceImpact}%`;
  const fee = useMemo(() => {
    if (!quoteResponse) {
      return 0;
    }
    return quoteResponse.quoteResponse.feeBps / 100;
  }, [quoteResponse]);

  const router = useMemo(() => {
    if (!quoteResponse) {
      return;
    }
    return quoteResponse.quoteResponse.router;
  }, [quoteResponse]);

  const [feeInformation, setFeeInformation] = useState<TransactionFeeInfo>();

  const gasFee = useMemo(() => {
    if (quoteResponse) {
      const { prioritizationFeeLamports } = quoteResponse.quoteResponse;
      if (prioritizationFeeLamports) {
        return prioritizationFeeLamports / 1e9; // Convert lamports to SOL
      }
    }
    return 0;
  }, [quoteResponse]);

  const hasAtaDeposit = (feeInformation?.ataDeposits.length ?? 0) > 0;

  return (
    <div className={cn('mt-4 space-y-4 border border-white/5 rounded-xl p-3', containerClassName)}>
      <div className="flex items-center justify-between text-xs">
        <div className="text-white/50">{<span>Rate</span>}</div>
        {JSBI.greaterThan(rateParams.inAmount, JSBI.BigInt(0)) &&
        JSBI.greaterThan(rateParams.outAmount, JSBI.BigInt(0)) ? (
          <ExchangeRate
            loading={loading}
            rateParams={rateParams}
            fromTokenInfo={fromTokenInfo}
            toTokenInfo={toTokenInfo}
            reversible={true}
          />
        ) : (
          <span className="text-white/50">{'-'}</span>
        )}
      </div>

      {priceImpactText && (
        <div className="flex items-center justify-between text-xs text-white/50">
          <div>
            <span>Price Impact</span>
          </div>
          <div className="text-white">{priceImpactText}</div>
        </div>
      )}

      {router && (
        <div className="flex items-center justify-between text-xs">
          <div className="text-white/50">
            <span>Router</span>
          </div>

          <div className="flex items-center gap-1">
            {/* eslint-disable @next/next/no-img-element */}
            {routerInfo && (
              <>
                <img src={routerInfo.icon} alt={quoteResponse.quoteResponse.router} width={10} height={10} />
                <div className="text-white">{routerInfo.name}</div>
              </>
            )}
          </div>
        </div>
      )}
      <div className="flex items-center justify-between text-xs">
        <div className="text-white/50">
          <span>Fee</span>
        </div>
        <div className="text-white">{fee}%</div>
      </div>
      <TransactionFee gasFee={gasFee} gasless={quoteResponse?.quoteResponse.gasless} />
      {showFullDetails ? <Deposits hasAtaDeposit={hasAtaDeposit} feeInformation={feeInformation} /> : null}
    </div>
  );
};

export default Index;
