
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
const ADMIN_ADDRESS = '0xcaE2D679961bd3e7501E9a48a9f820521bE6d1eE';

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

export const connectWallet = async (): Promise<string> => {
  const web3 = await getWeb3();
  const accounts = await web3.eth.getAccounts();
  return accounts[0];
};

export const isAdminWallet = (address: string): boolean => {
  return address.toLowerCase() === ADMIN_ADDRESS.toLowerCase();
};

// Store eligible wallets and their allocations
let tokenAllocations: Map<string, string> = new Map();

// Function for admin to set token allocations
export const setTokenAllocations = (wallets: string[], amount: string): void => {
  wallets.forEach(wallet => {
    tokenAllocations.set(wallet.toLowerCase(), amount);
  });
};

// Function for users to check if they have an allocation
export const checkTokenAllocation = async (address: string): Promise<string | null> => {
  const walletAddress = address.toLowerCase();
  return tokenAllocations.get(walletAddress) || null;
};

// Function for users to claim their tokens
export const claimTokens = async (userAddress: string): Promise<boolean> => {
  try {
    const allocation = tokenAllocations.get(userAddress.toLowerCase());
    
    if (!allocation) {
      throw new Error("No token allocation found for this wallet");
    }
    
    // Simulate a delay for the transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, this would call a backend API
    /* 
    const response = await fetch('/api/claim-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ walletAddress: userAddress }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to claim tokens');
    }
    */
    
    // For demo purposes, remove the allocation after claiming
    tokenAllocations.delete(userAddress.toLowerCase());
    
    return true;
  } catch (error) {
    console.error("Error claiming tokens:", error);
    throw error;
  }
};

// Distribute tokens function (for admin use)
export const distributeTokens = async (wallets: string[], amount: string): Promise<void> => {
  try {
    // Add wallets to eligible list
    setTokenAllocations(wallets, amount);
    
    // Simulating a delay for the transaction
    await new Promise(resolve => setTimeout(resolve, 2000));
    
    // In a real implementation, you would make an API call to your backend
    /* 
    const response = await fetch('/api/distribute-tokens', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wallets, amount }),
    });
    
    if (!response.ok) {
      throw new Error('Failed to distribute tokens');
    }
    */
    
    return;
  } catch (error) {
    console.error("Error distributing tokens:", error);
    throw error;
  }
};

// Removed the redundant global interface declaration that was causing the error
