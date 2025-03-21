import axios from 'npm:axios';

type CONFIG = {
    JUPITER_API_URL: string;
};

type INPUTS = {
    stablecoin: string;
};

type OPPORTUNITY = { pool_a: string; pool_b: string; profit: number };

type OUTPUT = {
    opportunities: OPPORTUNITY[];
};

export async function run(config: CONFIG, inputs: INPUTS): Promise<OUTPUT> {

    async function fetchPools(): Promise<any[]> {
        try {
            const response = await axios.get(config.JUPITER_API_URL);
            return response.data;
        } catch (error) {
            console.error("Error fetching pools:", error);
            return [];
        }
    }

    function filterStablecoinPools(pools: any[], stablecoin: string): any[] {
        return pools.filter(pool => pool.tokens.includes(stablecoin));
    }

    function analyzeArbitrageOpportunities(stablecoinPools: any[]): OUTPUT {
        const opportunities: OPPORTUNITY[] = [];

        // Simple mechanism to illustrate potential opportunities
        stablecoinPools.forEach(poolA => {
            stablecoinPools.forEach(poolB => {
                if (poolA !== poolB) {
                    const potentialProfit = Math.random() * 10; // Dummy logic for profit computation
                    if (poolA.tokens.includes(inputs.stablecoin) && poolB.tokens.includes(inputs.stablecoin) && potentialProfit > 0) {
                        opportunities.push({ pool_a: poolA.id, pool_b: poolB.id, profit: potentialProfit });
                    }
                }
            });
        });

        return { opportunities };
    }

    const pools = await fetchPools();
    const stablecoinPools = filterStablecoinPools(pools, inputs.stablecoin);
    const arbitrageOpportunities = analyzeArbitrageOpportunities(stablecoinPools);

    return arbitrageOpportunities;
}