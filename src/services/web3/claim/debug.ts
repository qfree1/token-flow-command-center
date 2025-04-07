
import Web3 from 'web3';
import { claimContractABI, CLAIM_CONTRACT_ADDRESS } from '../constants';

// For troubleshooting - check contract state
export const debugClaimContract = async (address: string): Promise<any> => {
  try {
    console.log("Starting claim contract debugging...");
    console.log("Contract address:", CLAIM_CONTRACT_ADDRESS);
    
    const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));
    
    // Basic contract existence check
    const code = await web3.eth.getCode(CLAIM_CONTRACT_ADDRESS);
    if (code === '0x' || code === '0x0') {
      console.error("No contract deployed at this address!");
      return { error: "No contract at this address" };
    }
    
    console.log("Contract exists at the address");
    
    // Create contract instance
    const claimContract = new web3.eth.Contract(claimContractABI as any, CLAIM_CONTRACT_ADDRESS);
    
    // Get token address with proper type handling
    const tokenAddressResult = await claimContract.methods.web3dToken().call();
    const tokenAddressStr = String(tokenAddressResult || '');
    console.log("Token address:", tokenAddressStr);
    
    // Get claim data for the user
    const claimAmount = await claimContract.methods.claimableAmount(address).call();
    const hasClaimed = await claimContract.methods.claimed(address).call();
    
    // Get admin address with proper type handling
    const adminAddressResult = await claimContract.methods.admin().call();
    const adminAddressStr = String(adminAddressResult || '');
    
    return {
      contractAddress: CLAIM_CONTRACT_ADDRESS,
      tokenAddress: tokenAddressStr,
      adminAddress: adminAddressStr,
      userAddress: address,
      claimAmount: web3.utils.fromWei(String(claimAmount || '0'), 'ether'),
      hasClaimed
    };
  } catch (error) {
    console.error("Error debugging contract:", error);
    return { error: error.message || "Unknown error debugging contract" };
  }
};
