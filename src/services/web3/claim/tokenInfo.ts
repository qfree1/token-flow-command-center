
import Web3 from 'web3';
import { claimContractABI, CLAIM_CONTRACT_ADDRESS, tokenABI } from '../constants';
import { getClaimContract } from './claimContract';

// Get token name and symbol from contract
export const getTokenInfo = async (): Promise<{name: string, symbol: string}> => {
  try {
    const claimContract = await getClaimContract();
    
    // Get the token address from the claim contract
    const tokenAddressResult = await claimContract.methods.web3dToken().call();
    const tokenAddress = String(tokenAddressResult || '');
    console.log(`Token address: ${tokenAddress}`);
    
    if (!tokenAddress || tokenAddress === '0x' || tokenAddress === '0x0') {
      return { name: "Web3D Token", symbol: "W3D" };
    }
    
    const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));
    const tokenContract = new web3.eth.Contract(tokenABI as any, tokenAddress);
    
    try {
      // Get token name and symbol
      const nameResult = await tokenContract.methods.name().call();
      const symbolResult = await tokenContract.methods.symbol().call();
      
      const name = typeof nameResult === 'string' ? nameResult : "Web3D Token";
      const symbol = typeof symbolResult === 'string' ? symbolResult : "W3D";
      
      console.log(`Token info - Name: ${name}, Symbol: ${symbol}`);
      return { name, symbol };
    } catch (error) {
      console.error("Error getting token info:", error);
      return { name: "Web3D Token", symbol: "W3D" };
    }
  } catch (error) {
    console.error("Error in getTokenInfo:", error);
    return { name: "Web3D Token", symbol: "W3D" };
  }
};
