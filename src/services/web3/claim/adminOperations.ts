import Web3 from 'web3';
import { claimContractABI, CLAIM_CONTRACT_ADDRESS, tokenABI } from '../constants';
import { getWeb3, isAdminWallet } from '../web3Provider';
import { getClaimContract } from './claimContract';

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
    
    console.log("Preparing to set claim list for wallets:", wallets);
    console.log("With amounts:", amounts);
    
    // Convert token amounts to Wei (assuming 18 decimals)
    const amountsInWei = amounts.map(amt => web3.utils.toWei(amt, 'ether'));
    
    // Get contract
    const claimContract = await getClaimContract(true);
    console.log("Claim contract created successfully:", CLAIM_CONTRACT_ADDRESS);
    
    try {
      console.log("Getting transaction count for nonce...");
      const nonce = await web3.eth.getTransactionCount(adminAddress, 'latest');
      console.log("Current nonce:", nonce);
      
      // Get gas price with boost
      const gasPriceWei = await web3.eth.getGasPrice();
      const gasPriceGwei = Number(web3.utils.fromWei(String(gasPriceWei), 'gwei'));
      console.log("Current gas price (Gwei):", gasPriceGwei);
      
      // Apply gas boost (20%)
      const boostedGasPriceGwei = Math.ceil(gasPriceGwei * 1.2);
      const boostedGasPriceWei = web3.utils.toWei(String(boostedGasPriceGwei), 'gwei');
      console.log("Boosted gas price (Gwei):", boostedGasPriceGwei);

      // Use a higher fixed gas limit to avoid estimation issues
      const gasLimit = 5000000; // This is a high value that should work for most cases
      console.log("Using fixed gas limit:", gasLimit);
      
      console.log("Sending setClaimList transaction with params:", {
        from: adminAddress,
        gas: String(gasLimit),
        gasPrice: String(boostedGasPriceWei),
        nonce: nonce
      });
      
      // Execute the transaction
      const tx = await claimContract.methods.setClaimList(wallets, amountsInWei).send({
        from: adminAddress,
        gas: String(gasLimit),
        gasPrice: String(boostedGasPriceWei),
        nonce: nonce
      });
      
      console.log(`Claim list set successfully. Transaction: ${tx.transactionHash}`);
      return true;
    } catch (error) {
      console.error("Error in setClaimList transaction:", error);
      
      // Enhanced error logging
      if (error instanceof Error) {
        const errorMsg = error.message;
        console.error("Error message:", errorMsg);
        
        // Check for common errors
        if (errorMsg.includes("insufficient funds")) {
          throw new Error("Insufficient funds for gas. Please add more BNB to your wallet.");
        } else if (errorMsg.includes("nonce too low") || errorMsg.includes("replacement transaction underpriced")) {
          throw new Error("Transaction with same nonce already pending. Please wait for it to complete or speed it up in MetaMask.");
        } else if (errorMsg.includes("gas required exceeds allowance")) {
          throw new Error("Gas limit too low. Try again with higher gas limit.");
        }
      }
      
      throw new Error(`Failed to set claim list: ${error instanceof Error ? error.message : "Unknown error"}`);
    }
  } catch (error) {
    console.error("Error setting claim list:", error);
    throw error;
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
    
    // Get the token address with proper type handling
    const tokenAddressResult = await claimContract.methods.web3dToken().call();
    const tokenAddress = String(tokenAddressResult || '');
    console.log(`Token address from contract: ${tokenAddress}`);
    
    if (!tokenAddress || tokenAddress === '0x' || tokenAddress === '0x0') {
      throw new Error("Invalid token address returned from contract");
    }
    
    // Create token contract instance
    const tokenContract = new web3.eth.Contract(tokenABI as any, tokenAddress);
    
    // Get balance of claim contract
    const balanceInWei = await tokenContract.methods.balanceOf(CLAIM_CONTRACT_ADDRESS).call();
    const balanceStr = String(balanceInWei || '0');
    const balance = web3.utils.fromWei(balanceStr, 'ether');
    
    console.log(`Contract token balance: ${balance}`);
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
          const amount = claimed ? "0 (Claimed)" : web3.utils.fromWei(String(amountInWei || '0'), 'ether');
          
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
    
    // Get the token address with proper type handling
    const tokenAddressResult = await claimContract.methods.web3dToken().call();
    const tokenAddress = String(tokenAddressResult || '');
    
    if (!tokenAddress || tokenAddress === '0x' || tokenAddress === '0x0') {
      throw new Error("Invalid token address returned from contract");
    }
    
    // Create token contract instance
    const tokenContract = new web3.eth.Contract(tokenABI as any, tokenAddress);
    
    // Convert amount to wei
    const amountInWei = web3.utils.toWei(amount, 'ether');
    
    // Check admin balance first
    const adminBalanceWei = await tokenContract.methods.balanceOf(adminAddress).call();
    const adminBalanceStr = String(adminBalanceWei || '0');
    
    if (BigInt(adminBalanceStr) < BigInt(amountInWei)) {
      throw new Error("Insufficient token balance");
    }
    
    // Get gas estimate
    const gasEstimate = await tokenContract.methods.transfer(CLAIM_CONTRACT_ADDRESS, amountInWei).estimateGas({
      from: adminAddress
    });
    
    // Apply gas boost
    const gasLimit = String(Math.ceil(Number(gasEstimate) * 1.5));
    
    // Get gas price
    const gasPriceWei = await web3.eth.getGasPrice();
    const gasPriceWeiStr = String(gasPriceWei || '0');
    
    console.log("Funding claim contract with parameters:", {
      contract: CLAIM_CONTRACT_ADDRESS,
      from: adminAddress,
      amount: amount,
      gas: gasLimit,
      gasPrice: gasPriceWeiStr
    });
    
    // Send tokens to claim contract
    const tx = await tokenContract.methods.transfer(CLAIM_CONTRACT_ADDRESS, amountInWei).send({
      from: adminAddress,
      gas: gasLimit,
      gasPrice: gasPriceWeiStr
    });
    
    console.log(`Claim contract funded with ${amount} tokens. Transaction: ${tx.transactionHash}`);
    return true;
  } catch (error) {
    console.error("Error funding claim contract:", error);
    throw error;
  }
};
