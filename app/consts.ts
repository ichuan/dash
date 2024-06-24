import { AAVEDeployment } from "./lib/definitions";

// 5min kline
export const KV_KEY_PRICE: string = "price";
export const KV_CHART_MAX_ITEMS: number = 200;

export const CURRENCIES = ["usdc", "dai"] as const;

export const KV_KEY_AAVE: string = "aave";
export const AAVE_RANGES = ["1d", "7d", "30d"];
// https://docs.aave.com/developers/deployed-contracts/v3-mainnet
export const AAVEV3DeployedAddresses: AAVEDeployment[] = [
  {
    chainName: "Ethereum",
    rpcs: [
      "https://eth.llamarpc.com",
      "https://rpc.ankr.com/eth",
      "https://endpoints.omniatech.io/v1/eth/mainnet/public",
      "https://ethereum-rpc.publicnode.com",
      "https://1rpc.io/eth",
    ],
    dataProvider: "0x7B4EB56E7CD4b454BA8ff71E4518426369a138a3",
    USDC: "0xA0b86991c6218b36c1d19D4a2e9Eb0cE3606eB48",
    USDT: "0xdAC17F958D2ee523a2206206994597C13D831ec7",
  },
  {
    chainName: "Optimism",
    rpcs: [
      "https://optimism.llamarpc.com",
      "wss://optimism-rpc.publicnode.com",
      "https://optimism.gateway.tenderly.co",
      "https://optimism.blockpi.network/v1/rpc/public",
    ],
    dataProvider: "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654",
    USDC: "0x0b2c639c533813f4aa9d7837caf62653d097ff85",
    USDT: "0x94b008aA00579c1307B0EF2c499aD98a8ce58e58",
  },
  {
    chainName: "Arbitrum",
    rpcs: [
      "https://arbitrum.llamarpc.com",
      "https://public.stackup.sh/api/v1/node/arbitrum-one",
      "https://arbitrum.meowrpc.com",
      "wss://arbitrum-one.publicnode.com",
      "https://endpoints.omniatech.io/v1/arbitrum/one/public",
    ],
    dataProvider: "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654",
    USDC: "0xaf88d065e77c8cC2239327C5EDb3A432268e5831",
    USDT: "0xFd086bC7CD5C481DCC9C85ebE478A1C0b69FCbb9",
  },
  {
    chainName: "Polygon",
    rpcs: [
      "https://polygon.llamarpc.com",
      "wss://polygon-bor-rpc.publicnode.com",
      "https://polygon-mainnet.public.blastapi.io",
      "https://rpc.ankr.com/polygon",
      "https://polygon-pokt.nodies.app",
    ],
    dataProvider: "0x69FA688f1Dc47d4B5d8029D5a35FB7a548310654",
    USDC: "0x3c499c542cEF5E3811e1192ce70d8cC03d5c3359",
    USDT: "0xc2132D05D31c914a87C6611C10748AEb04B58e8F",
  },
];
export const AAVEV3Chains = AAVEV3DeployedAddresses.map((i) => i.chainName);
export const CONTRACT_CALL_TIMEOUT: number = 5000;
