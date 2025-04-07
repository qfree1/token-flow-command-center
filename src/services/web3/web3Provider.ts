
import Web3 from 'web3';
import { 
  BSC_RPC_URL, 
  BSC_RPC_URLS, 
  ADMIN_ADDRESS, 
  CURRENT_CHAIN_ID, 
  BSC_CHAIN_ID, 
  BSC_TESTNET_CHAIN_ID 
} from './constants';

// Try different RPC URLs if one fails
let currentRpcUrlIndex = 0;

// Helper function to get the next available RPC URL
const getNextRpcUrl = (): string => {
  currentRpcUrlIndex = (currentRpcUrlIndex + 1) % BSC_RPC_URLS.length;
  return BSC_RPC_URLS[currentRpcUrlIndex];
};

// For frontend only operations
export const getWeb3 = async (): Promise<Web3> => {
  if (window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check if we're on the right network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      const targetChainId = `0x${CURRENT_CHAIN_ID.toString(16)}`;
      
      if (chainId !== targetChainId) {
        try {
          console.log(`Switching to BSC chain ID: ${targetChainId}`);
          // Try to switch to BSC
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: targetChainId }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            console.log("Adding BSC network to wallet...");
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: targetChainId,
                  chainName: CURRENT_CHAIN_ID === BSC_CHAIN_ID ? 'Binance Smart Chain' : 'BSC Testnet',
                  nativeCurrency: {
                    name: 'BNB',
                    symbol: 'BNB',
                    decimals: 18
                  },
                  rpcUrls: BSC_RPC_URLS,
                  blockExplorerUrls: [
                    CURRENT_CHAIN_ID === BSC_CHAIN_ID 
                      ? 'https://bscscan.com/' 
                      : 'https://testnet.bscscan.com/'
                  ],
                },
              ],
            });
          } else {
            throw switchError;
          }
        }
      }
      
      const web3 = new Web3(window.ethereum);
      return web3;
    } catch (error) {
      console.error("Error initializing Web3 with wallet:", error);
      throw new Error("User denied account access or wallet connection failed");
    }
  } else {
    throw new Error("No Ethereum browser extension detected. Please install MetaMask.");
  }
};

// Alternative method to get Web3 instance when MetaMask isn't available
export const getWeb3ReadOnly = (): Web3 => {
  try {
    return new Web3(new Web3.providers.HttpProvider(BSC_RPC_URL));
  } catch (error) {
    // If the default RPC fails, try next one
    console.warn("Failed to connect to default RPC, trying alternative RPC...");
    return new Web3(new Web3.providers.HttpProvider(getNextRpcUrl()));
  }
};

export const connectWallet = async (): Promise<string> => {
  try {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    if (!accounts || accounts.length === 0) {
      throw new Error("No accounts found. Please check your wallet connection.");
    }
    return accounts[0];
  } catch (error) {
    console.error("Wallet connection error:", error);
    throw error;
  }
};

export const isAdminWallet = (address: string): boolean => {
  return address && address.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
};

// Get BSC chain info for users
export const getBscNetworkInfo = () => {
  return {
    chainId: `0x${CURRENT_CHAIN_ID.toString(16)}`,
    chainName: CURRENT_CHAIN_ID === BSC_CHAIN_ID ? 'Binance Smart Chain' : 'BSC Testnet',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: BSC_RPC_URLS,
    blockExplorerUrls: [
      CURRENT_CHAIN_ID === BSC_CHAIN_ID 
        ? 'https://bscscan.com/' 
        : 'https://testnet.bscscan.com/'
    ]
  };
};
