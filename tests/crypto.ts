import { TestData } from "../types.ts";

export const cryptoTests: TestData[] = [
  {
    code: `get-crypto-info`,
    prompt:
      `Generate a tool that can retrieve current cryptocurrency information.`,
    prompt_type: "type INPUT = { crypto_symbol: string }",
    inputs: {
      crypto_symbol: "BTC",
    },
    tools: [
      "local:::shinkai_tool_token_price:::shinkai__token_price_using_chainlink__limited_",
      "local:::shinkai_tool_perplexity_api:::shinkai__perplexity_api",
      "local:::rust_toolkit:::shinkai_llm_prompt_processor"
    ],
    config: {},
  },
  {
    code: `get-wallet-tokens`,
    prompt:
      `Generate a tool that can get the amount of tokens in a cryptocurrency wallet.`,
    prompt_type: "type INPUT = { wallet_address: string, blockchain: string }",
    inputs: {
      wallet_address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      blockchain: "ethereum",
    },
    tools: [
      "local:::shinkai_tool_ethplorer_tokens:::token_balance_for_evm_ethereum_address___based_on_ethplorer"
    ],
    config: {},
  },
  {
    code: `list-token-prices`,
    prompt:
      `Generate a tool that can list all tokens and their current prices in a wallet.`,
    prompt_type: "type INPUT = { wallet_address: string, blockchain: string }",
    inputs: {
      wallet_address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      blockchain: "ethereum",
    },
    tools: [
      "local:::shinkai_tool_ethplorer_tokens:::token_balance_for_evm_ethereum_address___based_on_ethplorer",
      "local:::shinkai_tool_token_price:::shinkai__token_price_using_chainlink__limited_"
    ],
    config: {},
  },
  {
    code: `list-wallet-nfts`,
    prompt: `Generate a tool that can get a list of all NFTs in a wallet.`,
    prompt_type: "type INPUT = { wallet_address: string, blockchain: string }",
    inputs: {
      wallet_address: "0x742d35Cc6634C0532925a3b844Bc454e4438f44e",
      blockchain: "ethereum",
    },
    tools: [
      "local:::shinkai_tool_ethplorer_tokens:::token_balance_for_evm_ethereum_address___based_on_ethplorer"
    ],
    config: {},
  },
  {
    code: `create-meme-token`,
    prompt:
      `Generate a tool that can create and deploy a meme cryptocurrency token.`,
    prompt_type:
      "type INPUT = { token_name: string, initial_supply: number, blockchain: string }",
    inputs: {
      token_name: "DogeCoin2",
      initial_supply: 1000000,
      blockchain: "ethereum",
    },
    tools: [
      "local:::rust_toolkit:::shinkai_llm_prompt_processor",
      "local:::shinkai_tool_coinbase_create_wallet:::shinkai__coinbase_wallet_creator",
      "local:::rust_toolkit:::shinkai_sqlite_query_executor",
      "local:::shinkai_tool_coinbase_send_tx:::shinkai__coinbase_transaction_sender"
    ],
    config: {},
  },
];
