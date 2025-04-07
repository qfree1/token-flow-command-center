
import Web3 from 'web3';
import { claimContractABI, CLAIM_CONTRACT_ADDRESS } from '../constants';
import { getWeb3 } from '../web3Provider';

// Function to get claim contract instance
export const getClaimContract = async (requireSigner = false) => {
  try {
    // Use appropriate web3 instance based on whether we need a signer or not
    const web3 = requireSigner 
      ? await getWeb3() 
      : new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));
    
    console.log("Creating claim contract instance at:", CLAIM_CONTRACT_ADDRESS);
    
    if (!CLAIM_CONTRACT_ADDRESS || CLAIM_CONTRACT_ADDRESS === '0x0' || CLAIM_CONTRACT_ADDRESS === '0x') {
      throw new Error("Invalid claim contract address");
    }
    
    // Verify ABI is valid
    if (!claimContractABI || !Array.isArray(claimContractABI) || claimContractABI.length === 0) {
      throw new Error("Invalid claim contract ABI");
    }
    
    // Create contract instance with validated parameters
    return new web3.eth.Contract(claimContractABI, CLAIM_CONTRACT_ADDRESS);
  } catch (error) {
    console.error("Error getting claim contract:", error);
    throw new Error(`Failed to initialize claim contract: ${error instanceof Error ? error.message : "Unknown error"}`);
  }
};
