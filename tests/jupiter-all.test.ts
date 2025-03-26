import { assertEquals } from "https://deno.land/std@0.220.1/assert/assert_equals.ts";
import { ServiceAPIBase } from "./service-api-base.ts";

const tests = [
     /*1*/ // `Get All Tokens. Input none. Output: Token Information.`,
     /*3*/ `Get Token Information. Input: Address or Symbol. Output: Token Information including name, symbol, mint address, decimals, and other platform-specific information.`,
    `Get Token Price. Input: Token Address or Symbol. Output: Current market price of the token in a specified currency (e.g., USD, ETH).`,
    `Get Market Data. Input: Token Pair (e.g., ETH-USDT) or Market Identifier. Output: Market data including trading volumes, liquidity, order books, and recent trades.`,
    `Get Liquidity Pools. Input: Token Pair or Pool Identifier. Output: Information about available liquidity pools, including pool composition, liquidity provider tokens (LP tokens), and pool balances.`,
    `Create/Manage Liquidity Pools. Input: Token Pair, Amounts to Deposit, and Pool Configuration. Output: Confirmation of pool creation or update, including new LP token balance.`,
    `Swap Tokens. Input: Source Token, Destination Token, Amount to Swap. Output: Swap result including transaction ID, amount received, and any applicable fees.`,
    `Get Transaction History. Input: User Address or Transaction Filter (e.g., token, time range). Output: List of past transactions, including swap details, transaction IDs, timestamps, and amounts.`,
    `Get Wallet Balance. Input: User Address, Token Address or Symbol. Output: Current balance of the specified token in the user's wallet.`,
    `Deposit/Withdraw Tokens. Input: Token Address, Amount to Deposit/Withdraw, User Address. Output: Confirmation of deposit or withdrawal transaction, including transaction ID.`,
    `Get Trading Fees. Input: Token Pair or Market Identifier. Output: Trading fees associated with swaps, including maker and taker fees.`,
    `Get Market Trends. Input: Token Pair or Market Identifier, Time Range. Output: Insights into market trends, including price movements, trading volumes, and liquidity changes over time.`,
    `Place Orders. Input: Order Type (Limit/Market), Token Pair, Amount, Price. Output: Order ID and confirmation of order placement.`,
    `Cancel Orders. Input: Order ID. Output: Confirmation of order cancellation.`,
    `Get Order Status. Input: Order ID. Output: Status of the order (e.g., Open, Filled, Cancelled).`,
    `Get Gas Fees. Input: Transaction Details (e.g., token, amount). Output: Estimated gas fees for the transaction.`,
    `Broadcast Transactions. Input: Signed Transaction Data. Output: Transaction ID and confirmation of broadcast.`,
    `Get Blockchain Events. Input: Event Filter (e.g., transaction hash, block range). Output: Notifications about blockchain events, such as transaction confirmations.`,
    `Automated Market Making (AMM). Input: Pool Configuration, Token Pair, Liquidity Amount. Output: Confirmation of AMM setup, including pool address and LP token details.`,
    `Algorithmic Trading. Input: Trading Strategy Parameters (e.g., entry/exit conditions, risk management). Output: Execution results of the trading strategy, including profit/loss and transaction history.`,
    `DEX Aggregation. Input: Token Pair, Amount to Swap, DEXs to Aggregate. Output: Best available swap rate across aggregated DEXs, along with transaction details.`,

    /*2*/`Get All Markets. Input none, output: Market information Array.`,

];


const testData = `
For testing use the following information:
<test-data>
market 8oy1uJCWeVhaDAvEtxXsVchdK2Q91JhD7sP7TxkjXpNp/mints
token1 So11111111111111111111111111111111111111112
token2 3DrkogqGWYTuyQaH3Xe4NkQEioDH1uvArSm3jXLUpump
token3 [ETH (wrapped)] 7vfCXTUXx5WJV5JADk17DUJ4ksgau7utNKj4b963voxs

JUPITER_API_URL: https://api.jup.ag
</test-data>
`;

const documentation = `
IMPORTANT ADD TO REQUIREMENTS: For documentation use the content of the following URL: https://shinkai-agent-knowledge-base.pages.dev/protocols/jupiter/ 
`;

for (const [index, test] of tests.entries()) {
    const prompt = `
For Jupiter DEX create a tool that exactly does the following, and nothing else:
${test}

${documentation}

${testData}
    `;

    const serviceAPIBase = new ServiceAPIBase();
    await serviceAPIBase.startTest(prompt, 'typescript', `jupiter-${index}`, false, {
        feedback: (feedbackString: string) => {
            assertEquals(feedbackString.includes('https://shinkai-agent-knowledge-base.pages.dev/protocols/jupiter/'), true, 'feedbackString.includes documentation url');
        }
    });
}