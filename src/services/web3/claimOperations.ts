
import Web3 from 'web3';
import { claimContractABI, CLAIM_CONTRACT_ADDRESS, isDevelopment, tokenABI } from './constants';
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
    
    // Convert gas estimate from BigInt to string with buffer
    const gasLimit = (Number(gasEstimate) * 1.2).toString();
    
    // Get gas price and convert to string
    const gasPrice = (await web3.eth.getGasPrice()).toString();
    
    // Create a transaction with gas parameters
    const tx = await claimContract.methods.setClaimList(wallets, amountsInWei).send({
      from: adminAddress,
      gas: gasLimit,
      gasPrice: gasPrice
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
    // Ensure amountInWei is properly converted to string before using fromWei
    const amountInWeiStr = String(amountInWei);
    const amount = web3.utils.fromWei(amountInWeiStr, 'ether');
    
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
    
    // Convert gas estimate from BigInt to string with buffer
    const gasLimit = (Number(gasEstimate) * 1.2).toString();
    
    // Get gas price and convert to string
    const gasPrice = (await web3.eth.getGasPrice()).toString();
    
    // Execute the claim transaction with gas parameters
    const tx = await claimContract.methods.claim().send({
      from: userAddress,
      gas: gasLimit,
      gasPrice: gasPrice
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

// For admin: Get token balance of contract
export const getContractTokenBalance = async (): Promise<string> => {
  try {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const adminAddress = accounts[0];
    
    if (!isAdminWallet(adminAddress)) {
      throw new Error("Only admin can check contract balance");
    }
    
    const claimContract = await getClaimContract();
    // Fix: Ensure tokenAddress is a string by using type assertion or validation
    const tokenAddress = await claimContract.methods.web3dToken().call();
    
    if (!tokenAddress || typeof tokenAddress !== 'string') {
      throw new Error("Invalid token address returned from contract");
    }
    
    // Create token contract instance
    const tokenContract = new web3.eth.Contract(
      tokenABI as any, 
      tokenAddress
    );
    
    // Get balance of claim contract
    const balanceInWei = await tokenContract.methods.balanceOf(CLAIM_CONTRACT_ADDRESS).call();
    // Ensure balanceInWei is converted to string before using fromWei
    const balance = web3.utils.fromWei(balanceInWei.toString(), 'ether');
    
    return balance;
  } catch (error) {
    console.error("Error getting contract token balance:", error);
    return "0";
  }
};

// For admin: Check if users are in claim list
export const checkUsersInClaimList = async (addresses: string[]): Promise<{[address: string]: string}> => {
  try {
    const result: {[address: string]: string} = {};
    const claimContract = await getClaimContract();
    
    // Check each address one by one
    for (const address of addresses) {
      if (address && address.startsWith('0x')) {
        try {
          const amountInWei = await claimContract.methods.claimableAmount(address).call();
          const claimed = await claimContract.methods.claimed(address).call();
          
          const web3 = new Web3();
          const amount = claimed ? "0 (Claimed)" : web3.utils.fromWei(String(amountInWei), 'ether');
          
          result[address] = amount;
        } catch (err) {
          result[address] = "Error";
        }
      } else {
        result[address] = "Invalid Address";
      }
    }
    
    return result;
  } catch (error) {
    console.error("Error checking claim list:", error);
    throw error;
  }
};

// For admin: Send tokens directly to claim contract
export const fundClaimContract = async (amount: string): Promise<boolean> => {
  try {
    const web3 = await getWeb3();
    const accounts = await web3.eth.getAccounts();
    const adminAddress = accounts[0];
    
    if (!isAdminWallet(adminAddress)) {
      throw new Error("Only admin can fund the claim contract");
    }
    
    // Get claim contract instance to get token address
    const claimContract = await getClaimContract();
    // Fix: Ensure tokenAddress is a string by using type assertion or validation
    const tokenAddress = await claimContract.methods.web3dToken().call();
    
    if (!tokenAddress || typeof tokenAddress !== 'string') {
      throw new Error("Invalid token address returned from contract");
    }
    
    // Create token contract instance
    const tokenContract = new web3.eth.Contract(
      tokenABI as any, 
      tokenAddress
    );
    
    // Convert amount to wei
    const amountInWei = web3.utils.toWei(amount, 'ether');
    
    // Check admin balance first
    const adminBalance = await tokenContract.methods.balanceOf(adminAddress).call();
    if (BigInt(adminBalance) < BigInt(amountInWei)) {
      throw new Error("Insufficient token balance");
    }
    
    // Get gas estimate
    const gasEstimate = await tokenContract.methods.transfer(CLAIM_CONTRACT_ADDRESS, amountInWei).estimateGas({
      from: adminAddress
    });
    
    // Send tokens to claim contract
    const tx = await tokenContract.methods.transfer(CLAIM_CONTRACT_ADDRESS, amountInWei).send({
      from: adminAddress,
      gas: (Number(gasEstimate) * 1.2).toString(),
      gasPrice: (await web3.eth.getGasPrice()).toString()
    });
    
    console.log(`Claim contract funded with ${amount} tokens. Transaction: ${tx.transactionHash}`);
    return true;
  } catch (error) {
    console.error("Error funding claim contract:", error);
    throw error;
  }
};
