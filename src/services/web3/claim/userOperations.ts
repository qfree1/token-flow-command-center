
import Web3 from 'web3';
import { claimContractABI, CLAIM_CONTRACT_ADDRESS } from '../constants';
import { getWeb3 } from '../web3Provider';
import { getClaimContract } from './claimContract';

// For users: Check claimable amount
export const checkClaimableAmount = async (address: string): Promise<string> => {
  try {
    if (!address || !address.startsWith('0x')) {
      throw new Error("Invalid address");
    }
    
    // Get contract (no signer needed for view functions)
    const claimContract = await getClaimContract();
    console.log(`Checking claimable amount for: ${address}`);
    
    // Call the contract to get claimable amount for the address
    try {
      const amountInWei = await claimContract.methods.claimableAmount(address).call();
      console.log(`Claimable amount in wei: ${amountInWei}`);
      
      // Check if already claimed
      const hasClaimed = await claimContract.methods.claimed(address).call();
      console.log(`Has claimed status: ${hasClaimed}`);
      
      if (hasClaimed) {
        return "0"; // Already claimed
      }
      
      // Convert from Wei to token amount (assuming 18 decimals)
      const web3 = new Web3();
      const amount = web3.utils.fromWei(String(amountInWei || '0'), 'ether');
      console.log(`Claimable amount in tokens: ${amount}`);
      
      return amount;
    } catch (error) {
      console.error("Contract call error in checkClaimableAmount:", error);
      return "0"; // Return 0 on error
    }
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
    
    console.log(`Attempting to claim tokens for ${address} from connected wallet ${userAddress}`);
    
    if (userAddress.toLowerCase() !== address.toLowerCase()) {
      throw new Error("Connected wallet doesn't match the claim address");
    }
    
    // Check if there are tokens to claim
    const claimable = await checkClaimableAmount(address);
    console.log(`Claimable amount: ${claimable}`);
    
    if (claimable === "0") {
      throw new Error("No tokens available to claim or already claimed");
    }
    
    // Get contract and call claim method
    const claimContract = await getClaimContract(true);
    console.log("Claim contract instance created for claim transaction");
    
    // Try to estimate gas to see if the operation would succeed
    console.log("Estimating gas for claim transaction...");
    const gasEstimate = await claimContract.methods.claim().estimateGas({
      from: userAddress
    });
    
    console.log("Gas estimation successful:", gasEstimate);
    
    // Apply gas boost
    const gasLimit = String(Math.ceil(Number(gasEstimate) * 1.5));
    
    // Get gas price
    const gasPriceWei = await web3.eth.getGasPrice();
    const gasPriceWeiStr = String(gasPriceWei || '0');
    
    console.log("Sending claim transaction with gas:", {
      limit: gasLimit,
      price: gasPriceWeiStr
    });
    
    // Execute the claim transaction
    const tx = await claimContract.methods.claim().send({
      from: userAddress,
      gas: gasLimit,
      gasPrice: gasPriceWeiStr
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
    console.log(`Claim status for ${address}: ${hasClaimedStatus}`);
    
    return Boolean(hasClaimedStatus);
  } catch (error) {
    console.error("Error checking claim status:", error);
    return false;
  }
};
