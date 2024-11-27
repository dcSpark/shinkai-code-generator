import { TestData } from "../types.ts";

export const realEstateTests: TestData[] = [
  {
    code: `search-rental-properties`,
    prompt:
      `Generate a tool that can search for rental properties in a specified city.`,
    prompt_type:
      "type INPUT = { city: string, max_price?: number, min_bedrooms?: number }",
    inputs: {
      city: "San Francisco",
      max_price: 3000,
      min_bedrooms: 2,
    },
    tools: [],
    config: {},
  },
  {
    code: `find-best-rentals`,
    prompt:
      `Generate a tool that can find and rank the best rental properties in a city based on criteria.`,
    prompt_type:
      "type INPUT = { city: string, criteria: Array<{factor: string, weight: number}> }",
    inputs: {
      city: "Austin",
      criteria: [
        { factor: "price", weight: 0.4 },
        { factor: "location", weight: 0.3 },
        { factor: "amenities", weight: 0.3 },
      ],
    },
    tools: [],
    config: {},
  },
  {
    code: `search-apartments`,
    prompt:
      `Generate a tool that can search for apartments with specific criteria.`,
    prompt_type:
      "type INPUT = { location: string, price_range: [number, number], requirements: string[] }",
    inputs: {
      location: "Seattle, WA",
      price_range: [1500, 2500],
      requirements: ["pet-friendly", "in-unit-washer", "parking"],
    },
    tools: [],
    config: {},
  },
  {
    code: `generate-landlord-email`,
    prompt:
      `Generate a tool that can create and send a professional email to a landlord requesting a discount.`,
    prompt_type:
      "type INPUT = { landlord_email: string, property_address: string, desired_discount: number }",
    inputs: {
      landlord_email: "landlord@email.com",
      property_address: "456 Pine St",
      desired_discount: 100,
    },
    tools: [],
    config: {},
  },
];
