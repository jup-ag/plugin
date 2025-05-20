import { ASSOCIATED_TOKEN_PROGRAM_ID, TOKEN_PROGRAM_ID } from '@solana/spl-token';
import { PublicKey } from '@solana/web3.js';
import BN from 'bn.js';
import Decimal from 'decimal.js';
import JSBI from 'jsbi';
import { RefObject, useEffect, useRef, useState } from 'react';

const userLocale =
  typeof window !== 'undefined'
    ? navigator.languages && navigator.languages.length
      ? navigator.languages[0]
      : navigator.language
    : 'en-US';

export const numberFormatter = new Intl.NumberFormat(userLocale, {
  style: 'decimal',
  minimumFractionDigits: 0,
  maximumFractionDigits: 9,
});

const getDecimalCount = (value: string) => {
  const parts = value.split('.');
  return parts.length > 1 ? parts[1].length : 0;
};

export const formatNumber = {
  format: (val?: string | Decimal, precision?: number): string => {
    if (!val) {
      return '';
    }

    // Use the default precision if not provided
    const defaultDecimals = getDecimalCount(val.toString());
    // format it against user locale
    const numberFormatter = new Intl.NumberFormat(userLocale, {
      maximumFractionDigits: precision ?? defaultDecimals,
    });
    return numberFormatter.format(val.toString());
  },
};

export function shortenAddress(address: string, chars = 4): string {
  return `${address.slice(0, chars)}...${address.slice(-chars)}`;
}

export function fromLamports(lamportsAmount: JSBI | BN | number | bigint, decimals: number): number {
  return new Decimal(lamportsAmount.toString())
    .div(10 ** decimals)
    .toDP(decimals, Decimal.ROUND_DOWN)
    .toNumber();
}

export function toLamports(lamportsAmount: JSBI | BN | number, decimals: number): number {
  return new Decimal(lamportsAmount.toString())
    .mul(10 ** decimals)
    .floor()
    .toNumber();
}

// https://usehooks.com/useEventListener/
export function useReactiveEventListener(
  eventName: string,
  handler: (event: any) => void,
  element = typeof window !== 'undefined' ? window : null,
) {
  // Create a ref that stores handler
  const savedHandler = useRef<React.Ref<any>>();
  // Update ref.current value if handler changes.
  // This allows our effect below to always get latest handler ...
  // ... without us needing to pass it in effect deps array ...
  // ... and potentially cause effect to re-run every render.
  useEffect(() => {
    savedHandler.current = handler;
  }, [handler]);
  useEffect(
    () => {
      if (typeof window !== 'undefined') {
        // Make sure element supports addEventListener
        // On
        const isSupported = element && element.addEventListener;
        if (!isSupported) return;
        // Create event listener that calls handler function stored in ref
        const eventListener = (event: any) => typeof savedHandler.current === 'function' && savedHandler.current(event);
        // Add event listener
        element.addEventListener(eventName, eventListener);
        // Remove event listener on cleanup
        return () => {
          element.removeEventListener(eventName, eventListener);
        };
      }
    },
    [eventName, element], // Re-run if eventName or element changes
  );
}

export const isMobile = () => typeof window !== 'undefined' && screen && screen.width <= 480;

export const detectedSeparator = formatNumber.format('1.1').substring(1, 2);

export function useDebounce<T>(value: T, delay: number): T {
  const [debouncedValue, setDebouncedValue] = useState(value);
  useEffect(
    () => {
      // Update debounced value after delay
      const handler = setTimeout(() => {
        setDebouncedValue(value);
      }, delay);
      // Cancel the timeout if value changes (also on delay change or unmount)
      return () => {
        clearTimeout(handler);
      };
    },
    [value, delay], // Only re-call effect if value or delay changes
  );
  return debouncedValue;
}

export function useOutsideClick(ref: RefObject<HTMLElement>, handler: (e: MouseEvent) => void) {
  useEffect(() => {
    const listener = (event: any) => {
      // Do nothing if clicking ref's element or descendent elements
      if (!ref.current || ref.current.contains(event.target)) {
        return;
      }
      handler(event);
    };
    document.addEventListener('mouseup', listener);
    return () => {
      document.removeEventListener('mouseup', listener);
    };
  }, [ref, handler]);
}

export function splitIntoChunks<T>(array: T[], size: number): T[][] {
  return Array.apply<number, T[], T[][]>(0, new Array(Math.ceil(array.length / size))).map((_, index) =>
    array.slice(index * size, (index + 1) * size),
  );
}

export const hasNumericValue = (amount: string | number) => {
  if (amount && !Number.isNaN(Number(amount))) {
    return true;
  }
  return false;
};

export function jsonToBase64(object: Object) {
  try {
    const json = JSON.stringify(object);
    return Buffer.from(json).toString('base64');
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function base64ToJson(base64String: string) {
  try {
    const json = Buffer.from(base64String, 'base64').toString();
    return JSON.parse(json);
  } catch (error) {
    console.log(error);
    return null;
  }
}

export function getAssociatedTokenAddressSync(mint: PublicKey, owner: PublicKey, tokenProgramId = TOKEN_PROGRAM_ID) {
  const [ata] = PublicKey.findProgramAddressSync(
    [owner.toBuffer(), tokenProgramId.toBuffer(), mint.toBuffer()],
    ASSOCIATED_TOKEN_PROGRAM_ID,
  );
  return ata;
}

export function isValidSolanaAddress(address: string) {
  try {
    new PublicKey(address);
    return true;
  } catch (error) {
    console.error('Invalid Solana address:', error);
    return false;
  }
}