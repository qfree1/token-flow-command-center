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
  if (!window.ethereum) {
    throw new Error("No Ethereum browser extension detected. Please install MetaMask.");
  }
  
  try {
    // Check if MetaMask is locked
    const accounts = await window.ethereum.request({ method: 'eth_accounts' });
    if (!accounts || accounts.length === 0) {
      // Explicitly request account access to prompt user to unlock
      console.log("No accounts found. Requesting access...");
      await window.ethereum.request({ method: 'eth_requestAccounts' });
    }
    
    // Get current chain ID
    const chainId = await window.ethereum.request({ method: 'eth_chainId' });
    const targetChainId = `0x${CURRENT_CHAIN_ID.toString(16)}`;
    
    console.log(`Current chainId: ${chainId}, Target chainId: ${targetChainId}`);
    
    // Switch to BSC if needed
    if (chainId !== targetChainId) {
      console.log(`Switching to BSC chain ID: ${targetChainId}`);
      
      try {
        // Try to switch to BSC
        await window.ethereum.request({
          method: 'wallet_switchEthereumChain',
          params: [{ chainId: targetChainId }],
        });
        
        // Verify the chain was switched
        const newChainId = await window.ethereum.request({ method: 'eth_chainId' });
        console.log(`New chainId after switching: ${newChainId}`);
        
        if (newChainId !== targetChainId) {
          throw new Error(`Failed to switch network. Please manually switch to BSC in your wallet.`);
        }
      } catch (switchError: any) {
        console.error("Error switching chain:", switchError);
        
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
          
          // Wait a moment for the network to be added
          await new Promise(resolve => setTimeout(resolve, 1000));
          
          // Verify the chain was added and selected
          const newChainId = await window.ethereum.request({ method: 'eth_chainId' });
          console.log(`Chain ID after adding network: ${newChainId}`);
          
          if (newChainId !== targetChainId) {
            throw new Error("Failed to switch to BSC network. Please manually switch in your wallet.");
          }
        } else {
          throw new Error(`Network switching failed: ${switchError.message || "Unknown error"}`);
        }
      }
    }
    
    // Create Web3 instance with connected provider
    const provider = window.ethereum;
    const web3 = new Web3(provider);
    
    // Verify accounts again after network switch
    const finalAccounts = await web3.eth.getAccounts();
    if (!finalAccounts || finalAccounts.length === 0) {
      throw new Error("No accounts accessible. Please unlock your wallet.");
    }
    
    console.log("Web3 initialized with provider and accounts:", finalAccounts[0]);
    
    // Listen for account changes
    window.ethereum.on('accountsChanged', (accounts: string[]) => {
      console.log('Account changed:', accounts[0]);
      if (!accounts || accounts.length === 0) {
        console.log('Wallet disconnected or locked');
        // Could trigger a UI update here
      }
    });
    
    // Listen for chain changes
    window.ethereum.on('chainChanged', (chainId: string) => {
      console.log('Network changed:', chainId);
      // Could reload the page here or update UI
    });
    
    return web3;
  } catch (error) {
    console.error("Error initializing Web3 with wallet:", error);
    
    if (error instanceof Error) {
      throw new Error(`Wallet connection error: ${error.message}`);
    } else {
      throw new Error("User denied account access or wallet connection failed");
    }
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
    // Log the chainId after connecting to confirm correct network
    const chainId = await web3.eth.getChainId();
    console.log(`Connected to chainId: ${chainId} (${chainId.toString(16)})`);
    return accounts[0];
  } catch (error) {
    console.error("Wallet connection error:", error);
    throw error;
  }
};

export const isAdminWallet = (address: string): boolean => {
  if (!address) return false;
  return address.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
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
