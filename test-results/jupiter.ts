import axios from 'npm:axios';

type CONFIG = {
  jupiterApiUrl: string;
};

type INPUTS = {
  baseAsset: string;
  walletAddress: string;
};

type Pool = {
  pool: string;
  tokenIn: string;
  tokenOut: string;
  otherDetails?: any; // Placeholder for other pool data
};

type SwapResult = {
  fromPool: string;
  toPool: string;
  profit: number;
  executedAmount: number;
};

type OUTPUT = {
  arbitrageOpportunities: SwapResult[];
  message: string;
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {
  const { baseAsset } = inputs;
  const jupiterApiUrl = config.jupiterApiUrl;

  async function fetchPools(): Promise<Pool[]> {
    try {
      const response = await axios.get(`${jupiterApiUrl}/pools`);
      return response.data;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('API Error:', error.response.data?.message || error.message);
      } else {
        console.error('API Error:', error);
      }
      return [];
    }
  }

  function getStablecoinPools(pools: Pool[]): Pool[] {
    const stablecoinSymbols = new Set(['USDC', 'USDT', 'SUSD']);
    return pools.filter(pool =>
      stablecoinSymbols.has(pool.tokenIn) && stablecoinSymbols.has(pool.tokenOut)
    );
  }

  async function swapSimulate(pool: Pool, amount: number): Promise<number> {
    try {
      const response = await axios.post(`${jupiterApiUrl}/pools/${pool.pool}/swap`, {
        tokenIn: pool.tokenIn,
        tokenOut: pool.tokenOut,
        amount,
        slippageTolerance: 0.005, // 0.5% slippage tolerance
      });
      return response.data.amountOut;
    } catch (error: unknown) {
      if (axios.isAxiosError(error) && error.response) {
        console.error('Swap Simulation Error:', error.response.data?.message || error.message);
      } else {
        console.error('Swap Simulation Error:', error);
      }
      return 0;
    }
  }

  async function calculateArbitrage(pools: Pool[]): Promise<SwapResult[]> {
    const opportunities: SwapResult[] = [];
    const swapAmount = 100; // Base amount for simulation

    for (const pool1 of pools) {
      for (const pool2 of pools) {
        if (pool1.pool !== pool2.pool) {
          const amountFromPool1 = await swapSimulate(pool1, swapAmount);
          const amountFromPool2 = await swapSimulate(pool2, amountFromPool1);

          const profit = (amountFromPool2 / swapAmount - 1) * 100;
          if (profit > 0) {
            opportunities.push({
              fromPool: pool1.pool,
              toPool: pool2.pool,
              profit,
              executedAmount: swapAmount,
            });
          }
        }
      }
    }

    return opportunities.sort((a, b) => b.profit - a.profit);
  }

  const pools = await fetchPools();
  const stablecoinPools = getStablecoinPools(pools);

  const opportunities = await calculateArbitrage(stablecoinPools);

  return {
    arbitrageOpportunities: opportunities,
    message: opportunities.length > 0 
      ? 'Arbitrage opportunities found'
      : 'No arbitrage opportunities detected'
  };
}