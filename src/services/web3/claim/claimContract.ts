
import Web3 from 'web3';
import { claimContractABI, CLAIM_CONTRACT_ADDRESS } from '../constants';
import { getWeb3 } from '../web3Provider';

// Function to get claim contract instance
export const getClaimContract = async (requireSigner = false) => {
  try {
    const web3 = requireSigner ? await getWeb3() : new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));
    console.log("Creating claim contract instance at:", CLAIM_CONTRACT_ADDRESS);
    return new web3.eth.Contract(claimContractABI as any, CLAIM_CONTRACT_ADDRESS);
  } catch (error) {
    console.error("Error getting claim contract:", error);
    throw new Error("Failed to initialize claim contract");
  }
};
