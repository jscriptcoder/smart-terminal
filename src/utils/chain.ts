import Schema from "validate"

export const CHAIN_STORAGE_KEY = 'smart-terminal_chains'

export const chainSchema = new Schema({
  id: {
    type: Number,
    required: true
  },
  name: {
    type: String,
    required: true
  },
  network: {
    type: String,
    required: true
  },
  nativeCurrency: {
    name: {
      type: String,
      required: true
    },
    symbol: {
      type: String,
      required: true,
      length: { min: 2, max: 6 }
    },
    decimals: {
      type: Number,
      required: true
    }
  },
  rpcUrls: {
    default: {
      http: [
        {
          type: String,
          required: true
        }
      ],
      webSocket: [
        {
          type: String
        }
      ]
    },
    public: {
      http: [
        {
          type: String,
          required: true
        }
      ],
      webSocket: [
        {
          type: String
        }
      ]
    }
  },
  blockExplorers: {
    default: {
      name: {
        type: String
      },
      url: {
        type: String
      }
    }
  },

  // TODO: contracts are missing

  testnet: {
    type: Boolean
  }
})
