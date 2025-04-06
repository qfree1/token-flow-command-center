
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

// Placeholder: In a real implementation, this would call your backend API
export const distributeTokens = async (wallets: string[], amount: string): Promise<void> => {
  try {
    // This is a placeholder for the backend API call
    // In a production app, you would call your secured backend API here
    console.log(`Distributing ${amount} tokens to ${wallets.length} wallets`);
    
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

// Types to help with TypeScript
declare global {
  interface Window {
    ethereum: any;
  }
}
