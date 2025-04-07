
import Web3 from 'web3';
import { claimContractABI, CLAIM_CONTRACT_ADDRESS } from '../constants';
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
      // Convert to string to fix the bigint type error
      const boostedGasPriceWei = web3.utils.toWei(String(boostedGasPriceGwei), 'gwei');
      // Convert the bigint to string to fix the error
      const boostedGasPriceWeiStr = boostedGasPriceWei.toString();
      console.log("Boosted gas price (Gwei):", boostedGasPriceGwei);

      // Use a higher fixed gas limit to avoid estimation issues
      const gasLimit = "5000000"; // Using a string directly
      console.log("Using fixed gas limit:", gasLimit);
      
      console.log("Sending setClaimList transaction with params:", {
        from: adminAddress,
        gas: gasLimit,
        gasPrice: boostedGasPriceWeiStr,
        nonce: nonce
      });
      
      // Execute the transaction
      const tx = await claimContract.methods.setClaimList(wallets, amountsInWei).send({
        from: adminAddress,
        gas: gasLimit,
        gasPrice: boostedGasPriceWeiStr,
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
