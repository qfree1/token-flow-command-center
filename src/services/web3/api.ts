
import { API_BASE_URL } from './constants';

// API interaction functions for production use
export const api = {
  async setAllocations(wallets: string[], amount: string) {
    const response = await fetch(`${API_BASE_URL}/allocations/set`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ wallets, amount }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to set allocations');
    }
    
    return await response.json();
  },
  
  async checkAllocation(address: string) {
    const response = await fetch(`${API_BASE_URL}/allocations/check?address=${address}`, {
      method: 'GET',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      if (response.status === 404) {
        return null; // No allocation found
      }
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to check allocation');
    }
    
    const data = await response.json();
    return data.amount;
  },
  
  async claimTokens(address: string) {
    const response = await fetch(`${API_BASE_URL}/tokens/claim`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({ address }),
    });
    
    if (!response.ok) {
      const errorData = await response.json();
      throw new Error(errorData.message || 'Failed to claim tokens');
    }
    
    return await response.json();
  }
};
