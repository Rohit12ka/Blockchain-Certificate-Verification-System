# Blockchain Based Certificate Verification System

A web app for issuing and verifying certificates without trusting a single database. The certificate file lives on IPFS, its CID is recorded on Ethereum through a smart contract, and anyone can check a certificate against that record.

I built this as a full-stack Web3 project to understand how blockchain, IPFS and a normal MERN backend fit together in one app.

## Why I built it

Most certificate checks today mean emailing a university or trusting a PDF that anyone could have edited. A forged certificate is easy to make and slow to catch.

Here, the issuer registers a certificate once. After that, a verifier only needs the certificate ID: the app reads the record straight from the blockchain, so there is nothing for a middleman to quietly change.

## What it does

- Issue a certificate: upload the file, get an IPFS CID, register it on-chain
- Verify a certificate by its ID and see whether it is valid or not
- Connect with MetaMask and sign transactions from the browser
- Keep an admin/issuer role so only the authorized account can register certificates
- Store off-chain app data in MongoDB
- Responsive React interface

## How it works

1. The issuing organization uploads a certificate through the web app.
2. The backend pins the file to IPFS using Pinata and gets back a CID.
3. The issuer confirms a MetaMask transaction that sends the certificate details and CID to the smart contract.
4. The contract stores the record on-chain.
5. A verifier enters a certificate ID. The app fetches the on-chain record and shows **Valid** or **Invalid**.

```
Browser (React + Ethers.js) ──► MetaMask ──► Smart contract (Ethereum)
        │
        └──► Express API ──► MongoDB
                  │
                  └──► Pinata ──► IPFS
```

## Tech stack

| Part | Tools |
|---|---|
| Frontend | React (Vite), Tailwind CSS, Ethers.js |
| Backend | Node.js, Express, Multer |
| Database | MongoDB |
| Blockchain | Solidity, Hardhat, local node / Ganache |
| Storage | IPFS via Pinata |
| Wallet | MetaMask |

## Project structure

```
Blockchain-Certificate-Verification/
├── client/                 # React app
│   └── src/
│       ├── components/
│       ├── pages/
│       └── contractConfig/ # ABI + deployed address
├── server/                 # Express API
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   └── server.js
├── blockchain/             # Hardhat project
│   ├── contracts/CertificateVerification.sol
│   ├── scripts/
│   └── test/
└── README.md
```

## Running it locally

You will need Node.js, npm, MongoDB, MetaMask and a free Pinata account.

```bash
git clone https://github.com/<your-username>/blockchain-certificate-verification.git
cd blockchain-certificate-verification
```

**1. Blockchain**

```bash
cd blockchain
npm install
npx hardhat compile
npx hardhat node                                          # keep this running
npx hardhat run scripts/deploy.js --network localhost     # in a second terminal
```

Copy the deployed contract address into `client/src/contractConfig/`.

**2. Backend**

```bash
cd server
npm install
```

Create `server/.env`:

```env
PORT=5000
MONGO_URI=your_mongodb_connection_string
PINATA_JWT=your_pinata_jwt
PINATA_GATEWAY=your_pinata_gateway
```

```bash
npm start
```

**3. Frontend**

```bash
cd client
npm install
npm run dev
```

The app runs at `http://localhost:5173`. Add the local Hardhat network to MetaMask and import one of the test accounts that `hardhat node` prints.

> Never commit `.env`, private keys or your Pinata JWT. Make sure `.gitignore` includes `.env`, `node_modules/`, `uploads/` and `dist/`.

## The smart contract

Each certificate is stored as a small record:

```solidity
struct Certificate {
    string certificateId;
    string studentName;
    string course;
    string ipfsHash;
    address issuer;
    uint256 issueDate;
}
```

Only the certificate details and the IPFS CID go on-chain. The file itself stays on IPFS, which keeps gas costs low.

## What this does and doesn't prove

The blockchain record can't be quietly edited after it is written, and the CID means the stored file can't be swapped without the hash changing. What it can't prove is that the issuer was honest in the first place. The system is only as trustworthy as the account allowed to issue certificates.

## Testing

```bash
cd blockchain
npx hardhat test
```

I also tested the API with Postman and walked through the issue and verify flows manually with MetaMask.

## Screenshots

Add screenshots here once you have them:

| Home | Upload | Verification |
|---|---|---|
| ![Home](screenshots/home.png) | ![Upload](screenshots/upload.png) | ![Verify](screenshots/verification.png) |

## Things I want to add

- QR code on each certificate that opens its verification page
- Certificate revocation
- Support for multiple issuing organizations
- Digital signatures
- Deployment on a public testnet

## Author

**Rohit Kumar** — B.Tech, Computer Science (AI)
[LinkedIn](https://linkedin.com/in/rohit-kumar-5309b022a) · [Portfolio](https://rohit12ka.netlify.app) · rohitkumar27965@gmail.com

## License

Built for educational purposes. Feel free to learn from it and adapt it.
