Bilkul. Main tumhare **Blockchain Based Certificate Verification System** project ke liye GitHub par directly use karne layak professional `README.md` bana deta hoon. Isme tumhare project ke **React + Tailwind, Node/Express, MongoDB, MetaMask, IPFS/Pinata, Ethereum/Hardhat** wale stack ko include kar raha hoon.

# 🔐 Blockchain Based Certificate Verification System

A decentralized certificate verification system that uses **Blockchain, IPFS, and Smart Contracts** to securely issue, store, and verify digital certificates. The system helps prevent certificate forgery and provides a transparent and tamper-resistant verification mechanism.

---

## 📌 Overview

Traditional certificate verification systems depend heavily on centralized databases and manual verification processes. These systems can be vulnerable to:

* Certificate forgery
* Data manipulation
* Unauthorized modifications
* Centralized database failures
* Time-consuming manual verification

This project provides a **Blockchain-based Certificate Verification System** where certificate information is stored using **IPFS** and its unique hash/CID is recorded on the blockchain through a **Smart Contract**.

Once a certificate is registered on the blockchain, its verification information cannot be easily altered or manipulated.

---

## 🚀 Features

* ✅ Secure certificate issuance
* ✅ Blockchain-based certificate registration
* ✅ Certificate verification using blockchain
* ✅ IPFS-based decentralized certificate storage
* ✅ MetaMask wallet integration
* ✅ Smart Contract-based data management
* ✅ Certificate upload functionality
* ✅ Unique Certificate ID / Hash
* ✅ Tamper-resistant verification
* ✅ MongoDB database integration
* ✅ Responsive React user interface
* ✅ Organization/Admin-based certificate management

---

## 🏗️ System Architecture

```text
                    ┌─────────────────────┐
                    │       User          │
                    │ Student / Employer  │
                    └──────────┬──────────┘
                               │
                               ▼
                    ┌─────────────────────┐
                    │    React Frontend   │
                    │   React + Tailwind   │
                    └──────────┬──────────┘
                               │
                    ┌──────────┴──────────┐
                    │                     │
                    ▼                     ▼
             ┌──────────────┐      ┌──────────────┐
             │   MetaMask   │      │ Node/Express │
             │    Wallet    │      │    Backend   │
             └──────┬───────┘      └──────┬───────┘
                    │                     │
                    ▼                     ▼
             ┌──────────────┐      ┌──────────────┐
             │ Smart        │      │   MongoDB    │
             │ Contract     │      │   Database   │
             └──────┬───────┘      └──────────────┘
                    │
                    ▼
             ┌──────────────┐
             │  Blockchain  │
             │  Ethereum /  │
             │  Hardhat     │
             └──────────────┘
                    │
                    ▼
             ┌──────────────┐
             │ IPFS /       │
             │ Pinata       │
             └──────────────┘
```

---

## 🔄 How the System Works

### 1. Certificate Issuance

The authorized organization uploads the certificate through the web application.

### 2. Certificate Storage

The certificate file is uploaded to **IPFS using Pinata**.

IPFS returns a unique **CID (Content Identifier)** for the uploaded certificate.

### 3. Blockchain Registration

The certificate's important information and IPFS CID are sent to the deployed smart contract.

The smart contract stores the certificate information on the blockchain.

### 4. Certificate Verification

A verifier can enter the certificate ID or verification information.

The application retrieves the corresponding blockchain record and verifies whether the certificate exists and matches the stored information.

### 5. Verification Result

The system displays whether the certificate is:

```text
VALID ✅
```

or

```text
INVALID ❌
```

---

## 🛠️ Technology Stack

### Frontend

* React.js
* JavaScript
* HTML5
* CSS3
* Tailwind CSS
* Ethers.js

### Backend

* Node.js
* Express.js
* REST API
* Multer

### Database

* MongoDB

### Blockchain

* Ethereum
* Solidity
* Smart Contracts
* Hardhat
* Ganache / Local Blockchain

### Decentralized Storage

* IPFS
* Pinata

### Wallet

* MetaMask

### Development Tools

* Visual Studio Code
* Git
* GitHub
* Remix IDE
* Postman

---

## 📂 Project Structure

```text
Blockchain-Certificate-Verification/
│
├── client/
│   ├── public/
│   ├── src/
│   │   ├── components/
│   │   ├── pages/
│   │   ├── assets/
│   │   ├── contractConfig/
│   │   ├── App.jsx
│   │   └── main.jsx
│   │
│   ├── package.json
│   └── vite.config.js
│
├── server/
│   ├── uploads/
│   ├── server.js
│   ├── routes/
│   ├── models/
│   ├── controllers/
│   ├── .env
│   └── package.json
│
├── blockchain/
│   ├── contracts/
│   │   └── CertificateVerification.sol
│   ├── scripts/
│   ├── test/
│   ├── hardhat.config.js
│   └── package.json
│
├── README.md
└── .gitignore
```

---

## ⚙️ Installation & Setup

### Prerequisites

Make sure the following are installed:

* Node.js
* npm
* Git
* MetaMask
* MongoDB
* Hardhat

---

## 📥 Clone the Repository

```bash
git clone https://github.com/your-username/blockchain-certificate-verification.git

cd blockchain-certificate-verification
```

---

# 🔹 Frontend Setup

Navigate to the frontend directory:

```bash
cd client
```

Install dependencies:

```bash
npm install
```

Start the development server:

```bash
npm run dev
```

The frontend will normally run on:

```text
http://localhost:5173
```

---

# 🔹 Backend Setup

Navigate to the backend:

```bash
cd server
```

Install dependencies:

```bash
npm install
```

Create a `.env` file:

```env
PORT=5000

MONGO_URI=your_mongodb_connection_string

PINATA_JWT=your_pinata_jwt

PINATA_GATEWAY=your_pinata_gateway
```

Start the backend:

```bash
npm start
```

or:

```bash
node server.js
```

---

# 🔹 Blockchain Setup

Navigate to the blockchain directory:

```bash
cd blockchain
```

Install dependencies:

```bash
npm install
```

Compile the smart contract:

```bash
npx hardhat compile
```

Run the local blockchain:

```bash
npx hardhat node
```

Deploy the smart contract:

```bash
npx hardhat run scripts/deploy.js --network localhost
```

After deployment, copy the deployed contract address into the frontend contract configuration.

---

# 🔐 Environment Variables

Do not upload private credentials or API keys to GitHub.

Example:

```env
MONGO_URI=your_mongodb_uri
PINATA_JWT=your_pinata_jwt
PRIVATE_KEY=your_private_key
RPC_URL=your_rpc_url
```

Add the following to `.gitignore`:

```text
.env
node_modules/
uploads/
dist/
```

---

## 📜 Smart Contract

The smart contract is responsible for storing and retrieving certificate verification information from the blockchain.

A simplified certificate record can contain:

```text
Certificate ID
Student Name
Course / Degree
Certificate Hash
IPFS CID
Issuer Address
Issue Date
Verification Status
```

Example conceptual structure:

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

---

## 🔗 IPFS Integration

The system uses **IPFS** for decentralized certificate storage.

When a certificate is uploaded:

```text
Certificate File
       ↓
     Pinata
       ↓
      IPFS
       ↓
     CID
       ↓
Blockchain Smart Contract
```

The CID can later be used to retrieve the certificate from IPFS.

---

## 🦊 MetaMask Integration

MetaMask is used to connect the user's wallet with the blockchain network.

The application can:

* Connect wallet
* Detect wallet address
* Request transaction approval
* Send blockchain transactions
* Interact with smart contracts

Example flow:

```text
User
 ↓
Connect MetaMask
 ↓
Wallet Address
 ↓
Smart Contract
 ↓
Blockchain Transaction
```

---

## 🔎 Certificate Verification Flow

```text
Enter Certificate ID
          ↓
     Backend / Smart Contract
          ↓
   Retrieve Certificate Data
          ↓
Compare Stored Information
          ↓
 ┌────────┴─────────┐
 │                  │
 ▼                  ▼
VALID ✅          INVALID ❌
```

---

## 🔒 Security

The project improves certificate security through:

* Blockchain immutability
* Cryptographic hashing
* Decentralized IPFS storage
* Wallet-based authentication
* Smart Contract validation
* Unique certificate identifiers

Sensitive credentials such as:

* Private keys
* Pinata JWT
* MongoDB credentials
* API keys

must be stored in environment variables and never committed to GitHub.

---

## 🎯 Advantages

### Traditional System

```text
Centralized Database
        ↓
Possible Modification
        ↓
Manual Verification
        ↓
Time Consuming
```

### Proposed Blockchain System

```text
Certificate
     ↓
IPFS
     ↓
Blockchain
     ↓
Immutable Record
     ↓
Fast Verification
```

### Key Benefits

* Reduced certificate fraud
* Faster verification
* Tamper-resistant records
* Decentralized storage
* Transparent verification
* Reduced dependency on centralized databases

---

## 🔮 Future Scope

The system can be further improved by adding:

* QR-code based certificate verification
* Mobile application
* Multi-organization support
* Role-based access control
* Digital signatures
* NFT-based certificates
* Zero-Knowledge Proof-based verification
* Government/university database integration
* Cloud deployment
* Multi-chain support
* Automated certificate revocation
* AI-based document fraud detection

---

## 📸 Screenshots

Add project screenshots here:

```text
### Home Page
![Home Page](screenshots/home.png)

### Certificate Upload
![Certificate Upload](screenshots/upload.png)

### Certificate Verification
![Verification](screenshots/verification.png)

### MetaMask Connection
![MetaMask](screenshots/metamask.png)
```

---

## 🧪 Testing

The project can be tested using:

* Smart Contract unit tests
* API testing with Postman
* Frontend functionality testing
* Wallet transaction testing
* Certificate verification testing

Example:

```bash
npx hardhat test
```

---

## 👨‍💻 Contributors

**Rohit**

B.Tech – Computer Science & Engineering (Artificial Intelligence)

---

## 📄 License

This project is developed for **educational and academic purposes**.

You may modify and use the project according to your requirements.

---

## ⭐ Acknowledgements

Special thanks to the open-source technologies and platforms used in this project:

* Ethereum
* Solidity
* Hardhat
* IPFS
* Pinata
* MetaMask
* React
* Node.js
* Express.js
* MongoDB
---

## 📌 Project Summary

> **Blockchain Based Certificate Verification System** is a decentralized application designed to securely store and verify digital certificates using **Blockchain, Smart Contracts, IPFS, and MetaMask**. The system provides a transparent, tamper-resistant, and efficient alternative to traditional centralized certificate verification systems.