
import Web3 from 'web3';
import { claimContractABI, CLAIM_CONTRACT_ADDRESS, isDevelopment } from './constants';
import { getWeb3, isAdminWallet } from './web3Provider';

// Function to get claim contract instance
export const getClaimContract = async (requireSigner = false) => {
  try {
    const web3 = requireSigner ? await getWeb3() : new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));
    return new web3.eth.Contract(claimContractABI as any, CLAIM_CONTRACT_ADDRESS);
  } catch (error) {
    console.error("Error getting claim contract:", error);
    throw new Error("Failed to initialize claim contract");
  }
};

// For admin: Set claim list (multiple users and amounts)
export const setClaimList = async (wallets: string[], amounts: string[]): Promise<boolean> => {
  try {
    // Validate inputs
    if (!wallets || !amounts || wallets.length === 0 || amounts.length === 0) {
      throw new Error("Invalid wallets or amounts");
    }
    
    if (wallets.length !== amounts.length) {
      throw new Error("Wallets and amounts arrays must be the same length");
    }
    
    // Get web3 instance with signer
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const adminAddress = accounts[0];
    
    if (!isAdminWallet(adminAddress)) {
      throw new Error("Only the admin wallet can set claim lists");
    }
    
    // Convert token amounts to Wei (assuming 18 decimals)
    const amountsInWei = amounts.map(amt => web3.utils.toWei(amt, 'ether'));
    
    // Get contract and call setClaimList
    const claimContract = await getClaimContract(true);
    
    // Get gas estimate for the transaction
    const gasEstimate = await claimContract.methods.setClaimList(wallets, amountsInWei).estimateGas({
      from: adminAddress
    });
    
    // Create a transaction with gas parameters
    const tx = await claimContract.methods.setClaimList(wallets, amountsInWei).send({
      from: adminAddress,
      gas: Math.floor(gasEstimate * 1.2), // Add 20% buffer for gas estimation
      gasPrice: await web3.eth.getGasPrice()
    });
    
    console.log(`Claim list set successfully. Transaction: ${tx.transactionHash}`);
    return true;
  } catch (error) {
    console.error("Error setting claim list:", error);
    throw error;
  }
};

// For users: Check claimable amount
export const checkClaimableAmount = async (address: string): Promise<string> => {
  try {
    if (!address || !address.startsWith('0x')) {
      throw new Error("Invalid address");
    }
    
    // Get contract (no signer needed for view functions)
    const claimContract = await getClaimContract();
    
    // Call the contract to get claimable amount for the address
    const amountInWei = await claimContract.methods.claimableAmount(address).call();
    
    // Check if already claimed
    const hasClaimed = await claimContract.methods.claimed(address).call();
    if (hasClaimed) {
      return "0"; // Already claimed
    }
    
    // Convert from Wei to token amount (assuming 18 decimals)
    const web3 = new Web3();
    const amount = web3.utils.fromWei(amountInWei.toString(), 'ether');
    
    return amount;
  } catch (error) {
    console.error("Error checking claimable amount:", error);
    return "0";
  }
};

// For users: Claim tokens
export const claimTokens = async (address: string): Promise<boolean> => {
  try {
    if (!address || !address.startsWith('0x')) {
      throw new Error("Invalid address");
    }
    
    // Get web3 instance with signer
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const userAddress = accounts[0];
    
    if (userAddress.toLowerCase() !== address.toLowerCase()) {
      throw new Error("Connected wallet doesn't match the claim address");
    }
    
    // Check if there are tokens to claim
    const claimable = await checkClaimableAmount(address);
    if (claimable === "0") {
      throw new Error("No tokens available to claim or already claimed");
    }
    
    // Get contract and call claim method
    const claimContract = await getClaimContract(true);
    
    // Get gas estimate for the transaction
    const gasEstimate = await claimContract.methods.claim().estimateGas({
      from: userAddress
    });
    
    // Execute the claim transaction with gas parameters
    const tx = await claimContract.methods.claim().send({
      from: userAddress,
      gas: Math.floor(gasEstimate * 1.2), // Add 20% buffer for gas estimation
      gasPrice: await web3.eth.getGasPrice()
    });
    
    console.log(`Tokens claimed successfully. Transaction: ${tx.transactionHash}`);
    return true;
  } catch (error) {
    console.error("Error claiming tokens:", error);
    throw error;
  }
};

// Get claim status (whether an address has claimed)
export const getClaimStatus = async (address: string): Promise<boolean> => {
  try {
    if (!address || !address.startsWith('0x')) {
      return false;
    }
    
    // Get contract (no signer needed for view functions)
    const claimContract = await getClaimContract();
    
    // Call the claimed mapping
    const hasClaimedStatus = await claimContract.methods.claimed(address).call();
    // Ensure we're returning a boolean
    return Boolean(hasClaimedStatus);
  } catch (error) {
    console.error("Error checking claim status:", error);
    return false;
  }
};
