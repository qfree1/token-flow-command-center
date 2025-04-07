
// Load token allocations from localStorage with improved error handling and debugging
export const loadTokenAllocations = (): Map<string, string> => {
  try {
    const saved = localStorage.getItem('tokenAllocations');
    console.log("Raw localStorage for tokenAllocations:", saved);
    
    if (!saved) {
      console.log("No token allocations found in localStorage");
      return new Map<string, string>();
    }
    
    // Convert from saved JSON object format back to Map with proper type checking
    const parsed = JSON.parse(saved);
    if (typeof parsed !== 'object' || parsed === null) {
      console.error("Invalid data format in localStorage:", parsed);
      return new Map<string, string>();
    }
    
    // Ensure we're properly typing the entries as [string, string]
    const entries = Object.entries(parsed).map(([key, value]) => {
      // Ensure value is a string
      return [key, String(value)] as [string, string];
    });
    
    const allocations = new Map<string, string>(entries);
    
    console.log("Successfully loaded token allocations:", Object.fromEntries(allocations.entries()));
    return allocations;
  } catch (error) {
    console.error("Error loading token allocations:", error);
    // If there's an error, return an empty Map rather than letting the error propagate
    return new Map<string, string>();
  }
};

// Save token allocations to localStorage with improved error handling
export const saveTokenAllocations = (allocations: Map<string, string>): void => {
  try {
    if (!allocations || allocations.size === 0) {
      console.log("Warning: Attempting to save empty token allocations");
    }
    
    // Convert Map to plain object for JSON serialization
    const allocationsObject = Object.fromEntries(allocations.entries());
    const jsonString = JSON.stringify(allocationsObject);
    
    localStorage.setItem('tokenAllocations', jsonString);
    console.log("Successfully saved token allocations:", allocationsObject);
    console.log("JSON string saved to localStorage:", jsonString);
  } catch (error) {
    console.error("Error saving token allocations:", error);
  }
};
