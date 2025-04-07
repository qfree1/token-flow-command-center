
import Web3 from 'web3';
import { CLAIM_CONTRACT_ADDRESS, tokenABI } from '../constants';
import { getWeb3, isAdminWallet } from '../web3Provider';
import { getClaimContract } from './claimContract';

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
