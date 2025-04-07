
import Web3 from 'web3';
import { BSC_RPC_URL, ADMIN_ADDRESS, BSC_CHAIN_ID, BSC_TESTNET_CHAIN_ID } from './constants';

// For frontend only operations
export const getWeb3 = async (): Promise<Web3> => {
  if (window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
      
      // Check if we're on the right network
      const chainId = await window.ethereum.request({ method: 'eth_chainId' });
      if (chainId !== `0x${BSC_CHAIN_ID.toString(16)}` && chainId !== `0x${BSC_TESTNET_CHAIN_ID.toString(16)}`) {
        try {
          // Try to switch to BSC
          await window.ethereum.request({
            method: 'wallet_switchEthereumChain',
            params: [{ chainId: `0x${BSC_CHAIN_ID.toString(16)}` }],
          });
        } catch (switchError: any) {
          // This error code indicates that the chain has not been added to MetaMask
          if (switchError.code === 4902) {
            await window.ethereum.request({
              method: 'wallet_addEthereumChain',
              params: [
                {
                  chainId: `0x${BSC_CHAIN_ID.toString(16)}`,
                  chainName: 'Binance Smart Chain',
                  nativeCurrency: {
                    name: 'BNB',
                    symbol: 'BNB',
                    decimals: 18
                  },
                  rpcUrls: [BSC_RPC_URL],
                  blockExplorerUrls: ['https://bscscan.com/'],
                },
              ],
            });
          }
        }
      }
      
      const web3 = new Web3(window.ethereum);
      return web3;
    } catch (error) {
      throw new Error("User denied account access");
    }
  } else {
    throw new Error("No Ethereum browser extension detected");
  }
};

// Alternative method to get Web3 instance when MetaMask isn't available
export const getWeb3ReadOnly = (): Web3 => {
  return new Web3(new Web3.providers.HttpProvider(BSC_RPC_URL));
};

export const connectWallet = async (): Promise<string> => {
  const web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

export const isAdminWallet = (address: string): boolean => {
  return address.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
};

// Get BSC chain info for users
export const getBscNetworkInfo = () => {
  return {
    chainId: `0x${BSC_CHAIN_ID.toString(16)}`,
    chainName: 'Binance Smart Chain',
    nativeCurrency: {
      name: 'BNB',
      symbol: 'BNB',
      decimals: 18
    },
    rpcUrls: [BSC_RPC_URL],
    blockExplorerUrls: ['https://bscscan.com/']
  };
};
