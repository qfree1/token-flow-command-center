import Web3 from 'web3';
import { claimContractABI, CLAIM_CONTRACT_ADDRESS, isDevelopment, tokenABI } from './constants';
import { getWeb3, isAdminWallet } from './web3Provider';

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
    console.log("Claim contract created successfully");
    
    // First try to estimate gas to see if the operation would succeed
    try {
      console.log("Estimating gas for setClaimList...");
      const gasEstimate = await claimContract.methods.setClaimList(wallets, amountsInWei).estimateGas({
        from: adminAddress
      });
      
      console.log("Gas estimation successful:", gasEstimate);
      
      // Convert gas estimate to proper hexadecimal format with no decimal points
      const gasLimit = '0x' + Math.ceil(Number(gasEstimate) * 1.2).toString(16);
      
      // Get gas price and convert to proper hex format
      const gasPriceWei = await web3.eth.getGasPrice();
      const gasPrice = '0x' + BigInt(gasPriceWei).toString(16);
      
      console.log("Sending setClaimList transaction with gas:", {
        limit: gasLimit,
        price: gasPrice
      });
      
      // Execute the transaction
      const tx = await claimContract.methods.setClaimList(wallets, amountsInWei).send({
        from: adminAddress,
        gas: gasLimit,
        gasPrice: gasPrice
      });
      
      console.log(`Claim list set successfully. Transaction: ${tx.transactionHash}`);
      return true;
    } catch (error) {
      console.error("Error in setClaimList transaction:", error);
      throw new Error(`Failed to set claim list: ${error.message || "Unknown error"}`);
    }
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
      const amount = web3.utils.fromWei(String(amountInWei), 'ether');
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
    
    // Convert gas estimate to proper hexadecimal format with no decimal points
    const gasLimit = '0x' + Math.ceil(Number(gasEstimate) * 1.2).toString(16);
    
    // Get gas price and convert to proper hex format
    const gasPriceWei = await web3.eth.getGasPrice();
    const gasPrice = '0x' + BigInt(gasPriceWei).toString(16);
    
    console.log("Sending claim transaction with gas:", {
      limit: gasLimit,
      price: gasPrice
    });
    
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
    console.log(`Claim status for ${address}: ${hasClaimedStatus}`);
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
    
    // Get the token address with proper type handling
    const tokenAddressResult = await claimContract.methods.web3dToken().call();
    
    // Make sure we have a valid token address
    if (!tokenAddressResult) {
      throw new Error("Failed to get token address from contract");
    }
    
    // Safely convert to string
    const tokenAddress = String(tokenAddressResult);
    console.log(`Token address from contract: ${tokenAddress}`);
    
    // Create token contract instance
    const tokenContract = new web3.eth.Contract(
      tokenABI as any, 
      tokenAddress
    );
    
    // Get balance of claim contract with proper type handling
    const balanceInWei = await tokenContract.methods.balanceOf(CLAIM_CONTRACT_ADDRESS).call();
    
    // Safely convert to string before using fromWei
    const balanceStr = String(balanceInWei || '0');
    const balance = web3.utils.fromWei(balanceStr, 'ether');
    
    console.log(`Contract token balance: ${balance}`);
    return balance;
  } catch (error) {
    console.error("Error getting contract token balance:", error);
    return "0";
  }
};

// Get token name and symbol from contract
export const getTokenInfo = async (): Promise<{name: string, symbol: string}> => {
  try {
    const claimContract = await getClaimContract();
    
    // Get the token address from the claim contract
    const tokenAddress = await claimContract.methods.web3dToken().call();
    console.log(`Token address: ${tokenAddress}`);
    
    if (!tokenAddress) {
      return { name: "Unknown", symbol: "???" };
    }
    
    const web3 = new Web3(new Web3.providers.HttpProvider('https://bsc-dataseed.binance.org/'));
    const tokenContract = new web3.eth.Contract(tokenABI as any, tokenAddress);
    
    try {
      // Get token name and symbol
      const name = await tokenContract.methods.name().call();
      const symbol = await tokenContract.methods.symbol().call();
      
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
    
    // Get token address
    const tokenAddress = await claimContract.methods.web3dToken().call();
    console.log("Token address:", tokenAddress);
    
    // Get claim data for the user
    const claimAmount = await claimContract.methods.claimableAmount(address).call();
    const hasClaimed = await claimContract.methods.claimed(address).call();
    
    // Get admin address
    const adminAddress = await claimContract.methods.admin().call();
    
    return {
      contractAddress: CLAIM_CONTRACT_ADDRESS,
      tokenAddress,
      adminAddress,
      userAddress: address,
      claimAmount: web3.utils.fromWei(String(claimAmount || '0'), 'ether'),
      hasClaimed
    };
  } catch (error) {
    console.error("Error debugging contract:", error);
    return { error: error.message || "Unknown error debugging contract" };
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
    
    // Make sure we have a valid token address
    if (!tokenAddressResult) {
      throw new Error("Failed to get token address from contract");
    }
    
    // Safely convert to string
    const tokenAddress = String(tokenAddressResult);
    
    // Create token contract instance
    const tokenContract = new web3.eth.Contract(
      tokenABI as any, 
      tokenAddress
    );
    
    // Convert amount to wei
    const amountInWei = web3.utils.toWei(amount, 'ether');
    
    // Check admin balance first with proper type handling
    const adminBalance = await tokenContract.methods.balanceOf(adminAddress).call();
    
    // Safely convert to string for BigInt comparison
    const adminBalanceStr = String(adminBalance || '0');
    
    if (BigInt(adminBalanceStr) < BigInt(amountInWei)) {
      throw new Error("Insufficient token balance");
    }
    
    // Get gas estimate
    const gasEstimate = await tokenContract.methods.transfer(CLAIM_CONTRACT_ADDRESS, amountInWei).estimateGas({
      from: adminAddress
    });
    
    // Convert gas estimate to proper hexadecimal format
    const gasLimit = '0x' + Math.ceil(Number(gasEstimate) * 1.2).toString(16);
    
    // Get gas price and convert to proper hex format
    const gasPriceWei = await web3.eth.getGasPrice();
    const gasPrice = '0x' + BigInt(gasPriceWei).toString(16);
    
    // Send tokens to claim contract
    const tx = await tokenContract.methods.transfer(CLAIM_CONTRACT_ADDRESS, amountInWei).send({
      from: adminAddress,
      gas: gasLimit,
      gasPrice: gasPrice
    });
    
    console.log(`Claim contract funded with ${amount} tokens. Transaction: ${tx.transactionHash}`);
    return true;
  } catch (error) {
    console.error("Error funding claim contract:", error);
    throw error;
  }
};
