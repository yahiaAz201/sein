const PROJECT_ID_WC = process.env.PROJECT_ID_WC; //Wallet Connect project key
const OWLRACLE_API_KEY = process.env.OWLRACLE_API_KEY; //Your free API key for OWLRACLE, required for gas estimation on certain networks

// Your free API keys for explorers, necessary for gas estimation and obtaining ABI tokens on certain networks (you can keep the specified keys, but it's better to obtain your own)
const EXPLORER_ETH_KEY = process.env.EXPLORER_ETH_KEY; //https://etherscan.io/register
const EXPLORER_BSC_KEY = process.env.EXPLORER_BSC_KEY; //https://bscscan.com/register
const EXPLORER_POLYGON_KEY = process.env.EXPLORER_POLYGON_KEY; //https://polygonscan.com/register
const EXPLORER_FANTOM_KEY = process.env.EXPLORER_FANTOM_KEY; //https://ftmscan.com/register
const EXPLORER_OPTIMISM_KEY = process.env.EXPLORER_OPTIMISM_KEY; //https://optimistic.etherscan.io/register
const EXPLORER_ARBITRUM_ONE_KEY = process.env.EXPLORER_ARBITRUM_ONE_KEY; //https://arbiscan.io/register
const EXPLORER_ARBITRUM_NOVA_KEY = process.env.EXPLORER_ARBITRUM_NOVA_KEY; //https://nova.arbiscan.io/register
const EXPLORER_GNOSIS_KEY = process.env.EXPLORER_GNOSIS_KEY; //https://gnosisscan.io/register
const EXPLORER_MOONRIVER_KEY = process.env.EXPLORER_MOONRIVER_KEY; //https://moonriver.moonscan.io/register
const EXPLORER_CELO_KEY = process.env.EXPLORER_CELO_KEY; //https://celoscan.io/register
const EXPLORER_CRONOS_KEY = process.env.EXPLORER_CRONOS_KEY; //https://cronoscan.com/register
const EXPLORER_BASE_KEY = process.env.EXPLORER_BASE_KEY; //https://basescan.org/register
const EXPLORER_BLAST_KEY = process.env.EXPLORER_BLAST_KEY; //https://blastscan.io/register

const CONFIG = {
  wmProjectId: PROJECT_ID_WC,
  chains: {
    eth: {
      chainId: 1,
      chainHexId: "0x1",
      chainName: "Ethereum",
      tokenSymbol: "ETH",
      rpcUrl: "https://rpc.ankr.com/eth",
      explorerApiKey: EXPLORER_ETH_KEY,
      abiUrl:
        "https://api.etherscan.io/api?module=contract&action=getsourcecode&address=",
      gasUrl:
        "https://api.etherscan.io/api?module=gastracker&action=gasoracle&apikey=",
      gasApiType: "explorer",
      explorer: "etherscan.io",
      universalRouter: [
        "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
        "0x65b382653f7C31bC0Af67f188122035461ec9C76",
      ],
      permit2: [
        "0x000000000022D473030F116dDEE9F6B43aC78BA3",
        "0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768",
      ],
      swapRouterV2: [
        "0x7a250d5630B4cF539739dF2C5dAcb4c659F2488D",
        "0xEfF92A263d31888d860bD50809A8D171709b7b1c",
      ],
      swapRouterV3: [
        "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
        "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
      ],
      swapFactoryV2: [
        "0x5C69bEe701ef814a2B6a3EDD4B1652CB9cc5aA6f",
        "0x1097053Fd2ea711dad45caCcc45EfF7548fCB362",
      ],
      swapFactoryV3: [
        "0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7",
        "0x1F98431c8aD98523631AE4a59f267346ea31F984",
      ],
      swapToken: "0xc02aaa39b223fe8d0a0e5c4f27ead9083c756cc2",
      reserveSwapToken: "0x2260FAC5E5542a773Aa44fBCfeDf7C193bc2C599",
    },
    bsc: {
      chainId: 56,
      chainHexId: "0x38",
      chainName: "BNB Smart Chain",
      tokenSymbol: "BNB",
      rpcUrl: "https://rpc.ankr.com/bsc",
      explorerApiKey: EXPLORER_BSC_KEY,
      abiUrl:
        "https://api.bscscan.com/api?module=contract&action=getsourcecode&address=",
      gasUrl:
        "https://api.bscscan.com/api?module=gastracker&action=gasoracle&apikey=",
      gasApiType: "explorer",
      explorer: "bscscan.com",
      universalRouter: [
        "0x4Dae2f939ACf50408e13d58534Ff8c2776d45265",
        "0x1A0A18AC4BECDDbd6389559687d1A73d8927E416",
      ],
      permit2: [
        "0x000000000022D473030F116dDEE9F6B43aC78BA3",
        "0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768",
      ],
      swapRouterV2: [
        "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
        "0x10ED43C718714eb63d5aA57B78B54704E256024E",
      ],
      swapRouterV3: [
        "0xB971eF87ede563556b2ED4b1C0b0019111Dd85d2",
        "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
      ],
      swapFactoryV2: [
        "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
        "0xcA143Ce32Fe78f1f7019d7d551a6402fC5350c73",
      ],
      swapFactoryV3: [
        "0xdB1d10011AD0Ff90774D0C6Bb92e5C5c8b4461F7",
        "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
      ],
      swapToken: "0xbb4CdB9CBd36B01bD1cBaEBF2De08d9173bc095c",
      reserveSwapToken: "0x55d398326f99059fF775485246999027B3197955",
    },
    matic: {
      chainId: 137,
      chainHexId: "0x89",
      chainName: "Polygon Mainnet",
      tokenSymbol: "Matic",
      rpcUrl: "https://rpc.ankr.com/polygon",
      explorerApiKey: EXPLORER_POLYGON_KEY,
      abiUrl:
        "https://api.polygonscan.com/api?module=contract&action=getsourcecode&address=",
      gasUrl:
        "https://api.polygonscan.com/api?module=gastracker&action=gasoracle&apikey=",
      gasApiType: "explorer",
      explorer: "polygonscan.com",
      universalRouter: ["0xec7BE89e9d109e7e3Fec59c222CF297125FEFda2"],
      permit2: ["0x000000000022D473030F116dDEE9F6B43aC78BA3"],
      swapRouterV2: ["0xedf6066a2b290C185783862C7F4776A2C8077AD1"],
      swapRouterV3: ["0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"],
      swapFactoryV2: ["0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C"],
      swapFactoryV3: ["0x1F98431c8aD98523631AE4a59f267346ea31F984"],
      swapToken: "0x0d500B1d8E8eF31E21C99d1Db9A6444d3ADf1270",
      reserveSwapToken: "0x7ceB23fD6bC0adD59E62ac25578270cFf1b9f619",
    },
    ftm: {
      chainId: 250,
      chainHexId: "0xfa",
      chainName: "Fantom Opera",
      tokenSymbol: "FTM",
      rpcUrl: "https://rpc.ankr.com/fantom",
      explorerApiKey: EXPLORER_FANTOM_KEY,
      abiUrl:
        "https://api.ftmscan.com/api?module=contract&action=getsourcecode&address=",
      gasUrl:
        "https://api.ftmscan.com/api?module=gastracker&action=gasoracle&apikey=",
      gasApiType: "explorer",
      explorer: "ftmscan.com",
    },
    avax: {
      chainId: 43114,
      chainHexId: "0xa86a",
      chainName: "Avalanche Network C-Chain",
      tokenSymbol: "AVAX",
      rpcUrl: "https://rpc.ankr.com/avalanche",
      explorerApiKey: "",
      abiUrl:
        "https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api?module=contract&action=getsourcecode&address=",
      gasUrl:
        "https://api.routescan.io/v2/network/mainnet/evm/43114/etherscan/api?module=proxy&action=eth_gasPrice&apikey=",
      gasApiType: "other",
      explorer: "snowtrace.io",
      universalRouter: ["0x4Dae2f939ACf50408e13d58534Ff8c2776d45265"],
      permit2: ["0x000000000022D473030F116dDEE9F6B43aC78BA3"],
      swapRouterV2: ["0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24"],
      swapRouterV3: ["0xbb00FF08d01D300023C629E8fFfFcb65A5a578cE"],
      swapFactoryV2: ["0x9e5A52f57b3038F1B8EeE45F28b3C1967e22799C"],
      swapFactoryV3: ["0x740b1c1de25031C31FF4fC9A62f554A55cdC1baD"],
      swapToken: "0xB31f66AA3C1e785363F0875A1B74E27b85FD66c7",
      reserveSwapToken: "0x49D5c2BdFfac6CE2BFdB6640F4F80f226bc10bAB",
    },
    op: {
      chainId: 10,
      chainHexId: "0xa",
      chainName: "Optimism",
      tokenSymbol: "ETH",
      rpcUrl: "https://rpc.ankr.com/optimism",
      explorerApiKey: EXPLORER_OPTIMISM_KEY,
      abiUrl:
        "https://api-optimistic.etherscan.io/api?module=contract&action=getsourcecode&address=",
      gasUrl: `https://api.owlracle.info/v4/opt/gas?apikey=${OWLRACLE_API_KEY}`,
      gasApiType: "owlracle",
      explorer: "optimistic.etherscan.io",
      universalRouter: ["0xCb1355ff08Ab38bBCE60111F1bb2B784bE25D7e8"],
      permit2: ["0x000000000022D473030F116dDEE9F6B43aC78BA3"],
      swapRouterV2: ["0x4A7b5Da61326A6379179b40d00F57E5bbDC962c2"],
      swapRouterV3: ["0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45"],
      swapFactoryV2: ["0x0c3c1c532F1e39EdF36BE9Fe0bE1410313E074Bf"],
      swapFactoryV3: ["0x1F98431c8aD98523631AE4a59f267346ea31F984"],
      swapToken: "0x4200000000000000000000000000000000000006",
      reserveSwapToken: "0x68f180fcCe6836688e9084f035309E29Bf0A2095",
    },
    arb: {
      chainId: 42161,
      chainHexId: "0xa4b1",
      chainName: "Arbitrum One",
      tokenSymbol: "ETH",
      rpcUrl: "https://rpc.ankr.com/arbitrum",
      explorerApiKey: EXPLORER_ARBITRUM_ONE_KEY,
      abiUrl:
        "https://api.arbiscan.io/api?module=contract&action=getsourcecode&address=",
      gasUrl: `https://api.owlracle.info/v4/arb/gas?apikey=${OWLRACLE_API_KEY}`,
      gasApiType: "owlracle",
      explorer: "arbiscan.io",
      universalRouter: [
        "0x5E325eDA8064b456f4781070C0738d849c824258",
        "0xFE6508f0015C778Bdcc1fB5465bA5ebE224C9912",
      ],
      permit2: [
        "0x000000000022D473030F116dDEE9F6B43aC78BA3",
        "0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768",
      ],
      swapRouterV2: [
        "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
        "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb",
      ],
      swapRouterV3: [
        "0x68b3465833fb72A70ecDF485E0e4C7bD8665Fc45",
        "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
      ],
      swapFactoryV2: [
        "0xf1D7CC64Fb4452F05c498126312eBE29f30Fbcf9",
        "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E",
      ],
      swapFactoryV3: [
        "0x1F98431c8aD98523631AE4a59f267346ea31F984",
        "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
      ],
      swapToken: "0x82aF49447D8a07e3bd95BD0d56f35241523fBab1",
      reserveSwapToken: "0x2f2a2543B76A4166549F7aaB2e75Bef0aefC5B0f",
    },
    xdai: {
      chainId: 100,
      chainHexId: "0x64",
      chainName: "Gnosis",
      tokenSymbol: "xDai",
      rpcUrl: "https://rpc.ankr.com/gnosis",
      explorerApiKey: EXPLORER_GNOSIS_KEY,
      abiUrl:
        "https://api.gnosisscan.io/api?module=contract&action=getsourcecode&address=",
      gasUrl:
        "https://ggnosis.blockscan.com/gasapi.ashx?apikey=key&method=pendingpooltxgweidata",
      gasApiType: "other",
      explorer: "gnosisscan.io",
    },
    movr: {
      chainId: 1285,
      chainHexId: "0x505",
      chainName: "Moonriver",
      tokenSymbol: "MOVR",
      rpcUrl: "https://rpc.moonriver.moonbeam.network",
      explorerApiKey: EXPLORER_MOONRIVER_KEY,
      abiUrl:
        "https://api-moonriver.moonscan.io/api?module=contract&action=getsourcecode&address=",
      gasUrl: `https://api.owlracle.info/v4/movr/gas?apikey=${OWLRACLE_API_KEY}`,
      gasApiType: "owlracle",
      explorer: "moonscan.io",
    },
    celo: {
      chainId: 42220,
      chainHexId: "0xa4ec",
      chainName: "Celo Mainnet",
      tokenSymbol: "CELO",
      rpcUrl: "https://rpc.ankr.com/celo",
      explorerApiKey: EXPLORER_CELO_KEY,
      abiUrl:
        "https://api.celoscan.io/api?module=contract&action=getsourcecode&address=",
      gasUrl: `https://api.owlracle.info/v4/celo/gas?apikey=${OWLRACLE_API_KEY}`,
      gasApiType: "owlracle",
      explorer: "celoscan.io",
      universalRouter: ["0x643770E279d5D0733F21d6DC03A8efbABf3255B4"],
      permit2: ["0x000000000022D473030F116dDEE9F6B43aC78BA3"],
      swapRouterV3: ["0x5615CDAb10dc425a742d643d949a7F474C01abc4"],
      swapFactoryV3: ["0xAfE208a311B21f13EF87E33A90049fC17A7acDEc"],
      swapToken: "0x471EcE3750Da237f93B8E339c536989b8978a43",
      reserveSwapToken: "0x617f3112bf5397D0467D315cC709EF968D9ba546",
    },
    aurora: {
      chainId: 1313161554,
      chainHexId: "0x4e454152",
      chainName: "Aurora Mainnet",
      tokenSymbol: "Aurora ETH",
      rpcUrl: "https://mainnet.aurora.dev",
      abiUrl:
        "https://explorer.mainnet.aurora.dev/api?module=contract&action=getsourcecode&address=",
      gasUrl: `https://api.owlracle.info/v4/aurora/gas?apikey=${OWLRACLE_API_KEY}`,
      gasApiType: "owlracle",
      explorer: "aurorascan.dev",
    },
    cro: {
      chainId: 25,
      chainHexId: "0x19",
      chainName: "Cronos",
      tokenSymbol: "CRO",
      rpcUrl: "https://evm.cronos.org/",
      explorerApiKey: EXPLORER_CRONOS_KEY,
      abiUrl:
        "https://api.cronoscan.com/api?module=contract&action=getsourcecode&address=",
      gasUrl: `https://api.owlracle.info/v4/cro/gas?apikey=${OWLRACLE_API_KEY}`,
      gasApiType: "owlracle",
      explorer: "cronoscan.com",
    },
    nova: {
      chainId: 42170,
      chainHexId: "0xa4ba",
      chainName: "Arbitrum Nova",
      tokenSymbol: "ETH",
      rpcUrl: "https://rpc.ankr.com/arbitrumnova",
      explorerApiKey: EXPLORER_ARBITRUM_NOVA_KEY,
      abiUrl:
        "https://api-nova.arbiscan.io/api?module=contract&action=getsourcecode&address=",
      gasUrl: `https://api.owlracle.info/v4/arb/gas?apikey=${OWLRACLE_API_KEY}`,
      gasApiType: "owlracle",
      explorer: "nova.arbiscan.io",
    },
    era: {
      chainId: 324,
      chainHexId: "0x144",
      chainName: "zkSync",
      tokenSymbol: "ETH",
      rpcUrl: "https://rpc.ankr.com/zksync_era",
      gasUrl: "https://mainnet.era.zksync.io/",
      gasApiType: "other",
      explorer: "explorer.zksync.io",
      universalRouter: [
        "0x28731BCC616B5f51dD52CF2e4dF0E78dD1136C06",
        "0xdAee41E335322C85ff2c5a6745c98e1351806e98",
      ],
      permit2: [
        "0x0000000000225e31d15943971f47ad3022f714fa",
        "0x686FD50007EaA636F01154d660b96110B6bFe351",
      ],
      swapRouterV2: ["", "0x5aEaF2883FBf30f3D62471154eDa3C0c1b05942d"],
      swapRouterV3: [
        "0x99c56385daBCE3E81d8499d0b8d0257aBC07E8A3",
        "0xD70C70AD87aa8D45b8D59600342FB3AEe76E3c68",
      ],
      swapFactoryV2: ["", "0xd03D8D566183F0086d8D09A84E1e30b58Dd5619d"],
      swapFactoryV3: [
        "0x8FdA5a7a8dCA67BBcDd10F02Fa0649A937215422",
        "0x1BB72E0CbbEA93c08f535fc7856E0338D7F7a8aB",
      ],
      swapToken: "0x5aea5775959fbc2557cc8789bc1bf90a239d9a91",
      reserveSwapToken: "0x1d17CBcF0D6D143135aE902365D2E5e2A16538D4",
    },
    base: {
      chainId: 8453,
      chainHexId: "0x2105",
      chainName: "Base",
      tokenSymbol: "ETH",
      rpcUrl: "https://rpc.ankr.com/base",
      explorerApiKey: EXPLORER_BASE_KEY,
      abiUrl:
        "https://api.basescan.org/api?module=contract&action=getsourcecode&address=",
      gasUrl: `https://api.owlracle.info/v4/base/gas?apikey=${OWLRACLE_API_KEY}`,
      gasApiType: "owlracle",
      explorer: "basescan.org",
      universalRouter: [
        "0x3fC91A3afd70395Cd496C647d5a6CC9D4B2b7FAD",
        "0xFE6508f0015C778Bdcc1fB5465bA5ebE224C9912",
      ],
      permit2: [
        "0x000000000022D473030F116dDEE9F6B43aC78BA3",
        "0x31c2F6fcFf4F8759b3Bd5Bf0e1084A055615c768",
      ],
      swapRouterV2: [
        "0x4752ba5dbc23f44d87826276bf6fd6b1c372ad24",
        "0x8cFe327CEc66d1C090Dd72bd0FF11d690C33a2Eb",
      ],
      swapRouterV3: [
        "0x2626664c2603336E57B271c5C0b26F421741e481",
        "0x1b81D678ffb9C0263b24A97847620C99d213eB14",
      ],
      swapFactoryV2: [
        "0x8909Dc15e40173Ff4699343b6eB8132c65e18eC6",
        "0x02a84c1b3BBD7401a5f7fa98a384EBC70bB5749E",
      ],
      swapFactoryV3: [
        "0x33128a8fC17869897dcE68Ed026d694621f6FDfD",
        "0x0BFbCF9fa4f9C56B0F40a671Ad40E0805A091865",
      ],
      swapToken: "0x4200000000000000000000000000000000000006",
      reserveSwapToken: "0x833589fCD6eDb6E08f4c7C32D4f71b54bdA02913",
    },
    blast: {
      chainId: 81457,
      chainHexId: "0x13E31",
      chainName: "Blast",
      tokenSymbol: "ETH",
      rpcUrl: "https://rpc.ankr.com/base",
      explorerApiKey: EXPLORER_BLAST_KEY,
      abiUrl:
        "https://api.blastscan.io/api?module=contract&action=getsourcecode&address=",
      gasUrl: `https://api.owlracle.info/v4/blast/gas?apikey=${OWLRACLE_API_KEY}`,
      gasApiType: "owlracle",
      explorer: "blastscan.io",
      universalRouter: ["0x643770E279d5D0733F21d6DC03A8efbABf3255B4"],
      permit2: ["0x000000000022d473030f116ddee9f6b43ac78ba3"],
      swapRouterV2: ["0xBB66Eb1c5e875933D44DAe661dbD80e5D9B03035"],
      swapRouterV3: ["0x549FEB8c9bd4c12Ad2AB27022dA12492aC452B66"],
      swapFactoryV2: ["0x5C346464d33F90bABaf70dB6388507CC889C1070"],
      swapFactoryV3: ["0x792edAdE80af5fC680d96a2eD80A44247D2Cf6Fd"],
      swapToken: "0x4300000000000000000000000000000000000004",
      reserveSwapToken: "0x4300000000000000000000000000000000000003",
    },
    pls: {
      chainId: 369,
      chainHexId: "0x171",
      chainName: "PulseChain",
      tokenSymbol: "PLS",
      rpcUrl: "https://pulsechain.publicnode.com",
      abiUrl:
        "https://api.scan.pulsechain.com/api?module=contract&action=getabi&address=",
      gasUrl: `https://api.owlracle.info/v4/pulse/gas?apikey=${OWLRACLE_API_KEY}`,
      gasApiType: "owlracle",
      explorer: "scan.pulsechain.com",
    },
  },
};

const get = (req, res) => {
  res.send({
    wmProjectId: PROJECT_ID_WC,
    chains: CONFIG.chains,
  });
};

export default {
  get,
};
