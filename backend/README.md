
# Web3D Token Distribution Backend

This Node.js backend provides the API for securely distributing Web3D tokens on the Binance Smart Chain.

## Requirements

- Node.js v14+ and npm
- Access to a BSC node (public or private)
- Admin wallet with private key and enough BNB for gas fees

## Setup Instructions

1. Clone the repository
2. Navigate to the backend directory
3. Install dependencies:
```bash
npm install
```
4. Create a `.env` file based on `.env.example`:
```bash
cp .env.example .env
```
5. Edit `.env` file with your admin wallet's private key and other settings
6. Start the server:
```bash
npm start
```

## Security Warning

- Never commit your `.env` file or expose your private keys
- Use environment variables in production deployment
- Consider using a hardware wallet or a secure key management service in production

## API Endpoints

### Set Token Allocations (Admin only)
- `POST /api/allocations/set`
- Requires admin authorization
- Body: `{ wallets: string[], amount: string }`

### Check Token Allocation
- `GET /api/allocations/check?address=0x...`
- Returns allocation amount if available

### Claim Tokens
- `POST /api/tokens/claim`
- Body: `{ address: string }`
- Transfers tokens to the user's wallet and removes allocation

### Get Token Balance
- `GET /api/balance/:address`
- Returns current token balance for the address

## Deployment

For production deployment, it's recommended to:

1. Use a dedicated cloud service (AWS, DigitalOcean, Heroku)
2. Set up HTTPS using a valid SSL certificate
3. Implement proper authentication for admin endpoints
4. Add rate limiting to prevent abuse
5. Connect to a database instead of using in-memory storage
6. Set up monitoring and alerting

## BSC Network Information

- Web3D Token Contract: `0x7eD9054C48088bb8Cfc5C5fbC32775b9455A13f7`
- Network: Binance Smart Chain (BSC)
