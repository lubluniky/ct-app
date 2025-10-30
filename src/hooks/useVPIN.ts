/**
 * useVPIN hook for fetching VPIN data with SWR
 */

import useSWR from 'swr';
import type { VPINData } from '@/lib/vpin/calculateVPIN';

interface UseVPINOptions {
  symbol?: string;
  timeframe?: string;
  hours?: number;
  refreshInterval?: number;
}

const fetcher = async (url: string): Promise<VPINData> => {
  const res = await fetch(url);
  
  if (!res.ok) {
    const error = await res.json().catch(() => ({ error: 'Failed to fetch' }));
    throw new Error(error.error || `HTTP ${res.status}`);
  }
  
  return res.json();
};

export function useVPIN(options: UseVPINOptions = {}) {
  const {
    symbol = 'BTCUSDT',
    timeframe = 'm5',
    hours = 24,
    refreshInterval = 60000, // 1 minute
  } = options;

  const apiUrl = `/api/vpin?symbol=${symbol}&tf=${timeframe}&hours=${hours}`;

  const { data, error, isLoading, mutate } = useSWR<VPINData>(
    apiUrl,
    fetcher,
    {
      refreshInterval,
      revalidateOnFocus: false,
      revalidateOnReconnect: true,
      dedupingInterval: 60000, // Dedupe requests within 1 minute
      shouldRetryOnError: true,
      errorRetryCount: 3,
      errorRetryInterval: 5000,
    }
  );

  return {
    data,
    isLoading,
    error: error ? (error instanceof Error ? error.message : 'Unknown error') : null,
    mutate,
    lastUpdated: data?.lastUpdate ? new Date(data.lastUpdate) : null,
  };
}
