// query tokens:
//  eth: https://etherscan.io/address/0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3#readContract
//  getAllReservesTokens() -> find USDT, USDC
// query supply rate (liquidation rate)
//    getReserveData(0xdAC17F958D2ee523a2206206994597C13D831ec7) -> liquidityRate: 54791146622200878732911408
// format rate: https://docs.aave.com/developers/guides/rates-guide
//    rate = 54791146622200878732911408/Math.pow(10,27) == 0.05479114662220088
//    seconds = 365*24*3600
//    rate = Math.pow(1+a/seconds, seconds)-1 == 0.05631997242147069

// rpcs: https://chainlist.org/

import { Web3 } from 'web3';
import { waitWithTimeout } from 'web3-utils';
import POOL_ABI from './abi/Pool.json';
import { AAVEDeployment, AAVEAssetName } from './definitions';
import { AAVEV3DeployedAddresses, CONTRACT_CALL_TIMEOUT } from '../consts';
import HttpProvider from 'web3-providers-http';

// convert ray: 54748256964993253020798668n to float: 0.05479114662220088
// by formula: ray/10**27 == float
function rayToFloat(r: bigint) {
  const maxSafeInt = BigInt(Number.MAX_SAFE_INTEGER);
  const exp = Math.ceil(Math.log10(Number(r / maxSafeInt)));
  const parcial = r / BigInt(10) ** BigInt(exp);
  return Number(parcial) / 10 ** (27 - exp);
}

export async function getAssetSupplyRate(
  rpc: string,
  dataProvider: string,
  asset: string
) {
  const web3 = new Web3(rpc);
  const contract = new web3.eth.Contract(POOL_ABI, dataProvider);
  // ret.liquidityRate == 54748256964993253020798668n
  const ret: any = await waitWithTimeout(
    contract.methods.getReserveData(asset).call(),
    CONTRACT_CALL_TIMEOUT
  );
  const seconds = 365 * 24 * 3600;
  const rate = rayToFloat(ret.currentLiquidityRate);
  return (Math.pow(1 + rate / seconds, seconds) - 1).toFixed(4);
}

export async function getAssertSupplyRateWithRetries(
  rpcs: string[],
  dataProvider: string,
  asset: string,
  retries: number = 5
) {
  while (retries-- > 0) {
    let rpc = rpcs[Math.floor(rpcs.length * Math.random())];
    try {
      return await getAssetSupplyRate(rpc, dataProvider, asset);
    } catch (e) {
      console.error(
        `getAssetSupplyRate(${rpc}, ${dataProvider}, ${asset}): ${e}. Retrying...`
      );
    }
  }
  return '';
}

export async function getAllAssetSupplyRates() {
  const promises = [];
  const getCallback = (d: AAVEDeployment, assetName: AAVEAssetName) => {
    return async (): Promise<string[]> => {
      return [
        d.chainName,
        assetName,
        await getAssertSupplyRateWithRetries(d.rpcs, d.pool, d[assetName]),
      ];
    };
  };
  for (const i of AAVEV3DeployedAddresses) {
    promises.push(getCallback(i, 'USDC'));
    promises.push(getCallback(i, 'USDT'));
  }
  const results = await Promise.allSettled(promises.map((i) => i()));
  return results.filter((i) => i.status === 'fulfilled').map((i) => i.value);
}

// getAllAssetSupplyRates().then(console.dir);
