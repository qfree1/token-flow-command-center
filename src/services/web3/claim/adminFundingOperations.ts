
import Web3 from 'web3';
import { CLAIM_CONTRACT_ADDRESS, tokenABI } from '../constants';
import { getWeb3, isAdminWallet } from '../web3Provider';
import { getClaimContract } from './claimContract';

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
