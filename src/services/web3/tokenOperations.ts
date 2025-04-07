
import Web3 from 'web3';
import { api } from './api';
import { isDevelopment, tokenABI, TOKEN_CONTRACT_ADDRESS } from './constants';
import { getWeb3, getWeb3ReadOnly, isAdminWallet } from './web3Provider';
import { loadTokenAllocations, saveTokenAllocations } from './tokenStorage';

// Initialize token allocations from localStorage
let tokenAllocations = loadTokenAllocations();

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
    // Development mode: use localStorage but also perform actual transfer
    console.log("Development mode: Setting allocations in localStorage and performing transfer");
    
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

// Distribute tokens function (for admin use) - now with actual token transfer
export const distributeTokens = async (wallets: string[], amount: string): Promise<void> => {
  try {
    if (!wallets || !amount || wallets.length === 0 || isNaN(Number(amount))) {
      throw new Error("Invalid wallets or amount");
    }
    
    // Filter valid wallet addresses
    const validWallets = wallets.filter(wallet => wallet && wallet.startsWith('0x') && wallet.length === 42);
    if (validWallets.length === 0) {
      throw new Error("No valid wallet addresses provided");
    }
    
    // Get web3 instance from connected wallet
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const adminAddress = accounts[0];
    
    if (!isAdminWallet(adminAddress)) {
      throw new Error("Only the admin wallet can distribute tokens");
    }
    
    // Create contract instance
    const tokenContract = new web3.eth.Contract(tokenABI as any, TOKEN_CONTRACT_ADDRESS);
    
    // Convert token amount to wei (assuming 18 decimals)
    const amountInWei = web3.utils.toWei(amount, 'ether');
    
    console.log(`Starting transfer of ${amount} tokens to ${validWallets.length} wallets`);
    
    // Set allocations
    await setTokenAllocations(validWallets, amount);
    
    // Perform actual transfers
    for (const wallet of validWallets) {
      console.log(`Transferring ${amount} tokens to ${wallet}`);
      
      try {
        // Get gas estimate
        const gasEstimate = await tokenContract.methods.transfer(wallet, amountInWei).estimateGas({ from: adminAddress });
        
        // Convert gas estimate to proper hexadecimal format
        const gasLimit = '0x' + Math.ceil(Number(gasEstimate) * 1.2).toString(16);
        
        // Get gas price and convert to proper hex format
        const gasPriceWei = await web3.eth.getGasPrice();
        const gasPrice = '0x' + BigInt(gasPriceWei).toString(16);
        
        // Send transaction
        const txResult = await tokenContract.methods.transfer(wallet, amountInWei).send({
          from: adminAddress,
          gas: gasLimit,
          gasPrice: gasPrice
        });
        
        console.log(`Transfer successful: ${txResult.transactionHash}`);
      } catch (error) {
        console.error(`Error transferring tokens to ${wallet}:`, error);
        throw error;
      }
    }
    
    console.log(`Tokens successfully transferred to ${validWallets.length} wallets`);
  } catch (error) {
    console.error("Error in distributeTokens:", error);
    throw error;  // Re-throw to propagate the error to the UI
  }
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
