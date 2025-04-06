
import Web3 from 'web3';

// ABI for ERC20 token (simplified)
const tokenABI = [
  {
    "constant": true,
    "inputs": [],
    "name": "name",
    "outputs": [{ "name": "", "type": "string" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  },
  {
    "constant": false,
    "inputs": [
      { "name": "_to", "type": "address" },
      { "name": "_value", "type": "uint256" }
    ],
    "name": "transfer",
    "outputs": [{ "name": "", "type": "bool" }],
    "payable": false,
    "stateMutability": "nonpayable",
    "type": "function"
  },
  {
    "constant": true,
    "inputs": [{ "name": "_owner", "type": "address" }],
    "name": "balanceOf",
    "outputs": [{ "name": "balance", "type": "uint256" }],
    "payable": false,
    "stateMutability": "view",
    "type": "function"
  }
];

// Web3D token contract address on BSC
const TOKEN_CONTRACT_ADDRESS = '0x7eD9054C48088bb8Cfc5C5fbC32775b9455A13f7';
// Admin wallet address
const ADMIN_ADDRESS = '0x4A58ad9EdaC24762D3eA8eB76ab1E2C114cBB4d4';
// Default BSC RPC endpoint
const BSC_RPC_URL = 'https://bsc-dataseed.binance.org/';
// API base URL - this would be your deployed backend URL in production
const API_BASE_URL = process.env.NODE_ENV === 'production' 
  ? 'https://your-backend-api.com/api' 
  : 'http://localhost:3001/api';

// Environment check for dev/prod modes
const isDevelopment = process.env.NODE_ENV !== 'production';

// For frontend only operations
export const getWeb3 = async (): Promise<Web3> => {
  if (window.ethereum) {
    try {
      // Request account access
      await window.ethereum.request({ method: 'eth_requestAccounts' });
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

// Load token allocations from localStorage with improved error handling and debugging
const loadTokenAllocations = (): Map<string, string> => {
  try {
    const saved = localStorage.getItem('tokenAllocations');
    console.log("Raw localStorage for tokenAllocations:", saved);
    
    if (!saved) {
      console.log("No token allocations found in localStorage");
      return new Map<string, string>();
    }
    
    // Convert from saved JSON object format back to Map with proper type checking
    const parsed = JSON.parse(saved);
    if (typeof parsed !== 'object' || parsed === null) {
      console.error("Invalid data format in localStorage:", parsed);
      return new Map<string, string>();
    }
    
    // Ensure we're properly typing the entries as [string, string]
    const entries = Object.entries(parsed).map(([key, value]) => {
      // Ensure value is a string
      return [key, String(value)] as [string, string];
    });
    
    const allocations = new Map<string, string>(entries);
    
    console.log("Successfully loaded token allocations:", Object.fromEntries(allocations.entries()));
    return allocations;
  } catch (error) {
    console.error("Error loading token allocations:", error);
    // If there's an error, return an empty Map rather than letting the error propagate
    return new Map<string, string>();
  }
};

// Save token allocations to localStorage with improved error handling
const saveTokenAllocations = (allocations: Map<string, string>): void => {
  try {
    if (!allocations || allocations.size === 0) {
      console.log("Warning: Attempting to save empty token allocations");
    }
    
    // Convert Map to plain object for JSON serialization
    const allocationsObject = Object.fromEntries(allocations.entries());
    const jsonString = JSON.stringify(allocationsObject);
    
    localStorage.setItem('tokenAllocations', jsonString);
    console.log("Successfully saved token allocations:", allocationsObject);
    console.log("JSON string saved to localStorage:", jsonString);
  } catch (error) {
    console.error("Error saving token allocations:", error);
  }
};

// Initialize token allocations from localStorage
let tokenAllocations = loadTokenAllocations();

// API interaction functions for production use
const api = {
  async setAllocations(wallets: string[], amount: string) {
    const response = await fetch(`${API_BASE_URL}/allocations/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wallets, amount }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to set allocations');
    }
    
    return await response.json();
  },
  
  async checkAllocation(address: string) {
    const response = await fetch(`${API_BASE_URL}/allocations/check?address=${address}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No allocation found
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to check allocation');
    }
    
    const data = await response.json();
    return data.amount;
  },
  
  async claimTokens(address: string) {
    const response = await fetch(`${API_BASE_URL}/tokens/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to claim tokens');
    }
    
    return await response.json();
  }
};

// Function for admin to set token allocations
export const setTokenAllocations = async (wallets: string[], amount: string): Promise<void> => {
  if (!wallets || !amount || wallets.length === 0 || isNaN(Number(amount))) {
    console.error("Invalid wallets or amount");
    throw new Error("Invalid wallets or amount");
  }

  // Filter valid wallet addresses
  const validWallets = wallets.filter(wallet => wallet && wallet.startsWith('0x') && wallet.length === 42);
  if (validWallets.length === 0) {
    console.error("No valid wallet addresses provided");
    throw new Error("No valid wallet addresses provided");
  }

  if (isDevelopment) {
    // Development mode: use localStorage
    console.log("Development mode: Setting allocations in localStorage");
    
    // First, ensure we have the latest allocations
    tokenAllocations = loadTokenAllocations();

    console.log("Setting allocations for wallets:", validWallets);
    console.log("Amount per wallet:", amount);
    
    validWallets.forEach(wallet => {
      const normalizedWallet = wallet.toLowerCase();
      tokenAllocations.set(normalizedWallet, amount);
      console.log(`Added allocation for wallet ${normalizedWallet}: ${amount} tokens`);
    });
    
    // Save updated allocations to localStorage
    saveTokenAllocations(tokenAllocations);
    
    // Force a reload from localStorage to verify persistence
    const reloaded = loadTokenAllocations();
    console.log(`Verification - Reloaded allocations after save:`, Object.fromEntries(reloaded.entries()));
    
    return;
  } else {
    // Production mode: use backend API
    console.log("Production mode: Setting allocations via API");
    try {
      await api.setAllocations(validWallets, amount);
      console.log(`Successfully set allocations for ${validWallets.length} wallets via API`);
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
};

// Function for users to check if they have an allocation
export const checkTokenAllocation = async (address: string): Promise<string | null> => {
  if (!address || !address.startsWith('0x') || address.length !== 42) {
    console.error("Invalid wallet address for allocation check:", address);
    return null;
  }
  
  const walletAddress = address.toLowerCase();
  console.log(`Checking allocation for wallet: ${walletAddress}`);
  
  if (isDevelopment) {
    // Development mode: check localStorage
    // Always reload from localStorage to ensure we have the latest data
    tokenAllocations = loadTokenAllocations();
    
    const allocation = tokenAllocations.get(walletAddress);
    
    console.log(`Allocation result for ${walletAddress}: ${allocation || 'None'}`);
    console.log("All current allocations:", Object.fromEntries(tokenAllocations.entries()));
    
    return allocation || null;
  } else {
    // Production mode: use backend API
    try {
      const allocation = await api.checkAllocation(walletAddress);
      console.log(`API allocation result for ${walletAddress}: ${allocation || 'None'}`);
      return allocation;
    } catch (error) {
      console.error("API Error:", error);
      return null;
    }
  }
};

// Function for users to claim their tokens
export const claimTokens = async (userAddress: string): Promise<boolean> => {
  if (!userAddress || !userAddress.startsWith('0x') || userAddress.length !== 42) {
    console.error("Invalid wallet address for claiming tokens");
    throw new Error("Invalid wallet address");
  }
  
  const walletAddress = userAddress.toLowerCase();
  console.log(`Attempting to claim tokens for: ${walletAddress}`);
  
  if (isDevelopment) {
    // Development mode: simulate claiming from localStorage
    try {
      // Always reload from localStorage to ensure we have the latest data
      tokenAllocations = loadTokenAllocations();
      
      console.log("Before claim - All allocations:", Object.fromEntries(tokenAllocations.entries()));
      const allocation = tokenAllocations.get(walletAddress);
      
      console.log(`Token allocation for ${walletAddress}: ${allocation || 'None'}`);
      
      if (!allocation) {
        console.error(`No allocation found for wallet: ${walletAddress}`);
        throw new Error("No token allocation found for this wallet");
      }
      
      // Simulate a delay for the transaction
      console.log("Processing token claim transaction...");
      await new Promise(resolve => setTimeout(resolve, 2000));
      
      // Remove the allocation after claiming
      tokenAllocations.delete(walletAddress);
      // Save updated allocations to localStorage
      saveTokenAllocations(tokenAllocations);
      
      // Verify the allocation was actually removed
      const verifyAllocation = loadTokenAllocations().get(walletAddress);
      if (verifyAllocation) {
        console.error("Failed to remove allocation from localStorage!");
      } else {
        console.log("Allocation successfully removed from localStorage");
      }
      
      console.log(`Successfully claimed tokens for ${walletAddress}. Allocation removed.`);
      console.log("After claim - All allocations:", Object.fromEntries(tokenAllocations.entries()));
      
      return true;
    } catch (error) {
      console.error("Error claiming tokens:", error);
      throw error;
    }
  } else {
    // Production mode: use backend API
    try {
      await api.claimTokens(walletAddress);
      console.log(`Successfully claimed tokens for ${walletAddress} via API`);
      return true;
    } catch (error) {
      console.error("API Error:", error);
      throw error;
    }
  }
};

// Distribute tokens function (for admin use)
export const distributeTokens = async (wallets: string[], amount: string): Promise<void> => {
  // This is just a wrapper around setTokenAllocations for now
  await setTokenAllocations(wallets, amount);
  console.log(`Tokens successfully allocated for distribution`);
};

// Get token balance for a wallet (read-only operation)
export const getTokenBalance = async (address: string): Promise<string> => {
  try {
    // Get web3 instance (read-only is fine for this operation)
    const web3 = window.ethereum ? await getWeb3() : getWeb3ReadOnly();
    
    // Create contract instance
    const tokenContract = new web3.eth.Contract(tokenABI as any, TOKEN_CONTRACT_ADDRESS);
    
    // Call balanceOf function
    const balance = await tokenContract.methods.balanceOf(address).call();
    
    // Make sure balance is valid before converting
    if (balance === undefined || balance === null) {
      return "0";
    }
    
    // Convert from wei to tokens (assuming 18 decimals)
    // Ensure balance is passed as a string to avoid type issues
    const tokenBalance = web3.utils.fromWei(String(balance), 'ether');
    
    console.log(`Token balance for ${address}: ${tokenBalance}`);
    return tokenBalance;
  } catch (error) {
    console.error("Error getting token balance:", error);
    return "0";
  }
};
