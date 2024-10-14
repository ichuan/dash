import { CURRENCIES } from '@/app/consts';

export type KlineData = Array<{
  ts: number | Date;
}>;

export type Currency = (typeof CURRENCIES)[number];

export type AAVEDeployment = {
  chainName: string;
  rpcs: string[];
  pool: string;
  USDC: string;
  USDT: string;
};
export type AAVEAssetName = 'USDC' | 'USDT';
