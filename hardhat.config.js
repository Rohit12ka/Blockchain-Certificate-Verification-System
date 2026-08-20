// import "@nomicfoundation/hardhat-toolbox";
// import("@nomicfoundation/hardhat-verify");
// import("dotenv").config();
// export default {
//   solidity: "0.8.17",
//   networks: {
//     localhost: {
//       url: "http://127.0.0.1:8545",
//       accounts:["9915fd6c578fde04fd0d512caa4d0e5a5f99ed5d65031f0e3d814775d613f336"]
//     },
//   },
//    etherscan: {
//     apiKey:"Z9SRNQQD74WQ7UP32QWVQH3V2NA59YQUM3",
//    },
// };
// require("@nomicfoundation/hardhat-toolbox");
// require("dotenv").config();

// module.exports = {
//   solidity: "0.8.20",
//   networks: {
//     sepolia: {
//       url: process.env.SEPOLIA_RPC_URL,
//       accounts: [process.env.PRIVATE_KEY]
//     }
//   },
//   etherscan: {
//     apiKey: process.env.ETHERSCAN_API_KEY
//   }
// };

import "@nomicfoundation/hardhat-toolbox";
import * as dotenv from "dotenv";

dotenv.config();

const SEPOLIA_RPC_URL = process.env.SEPOLIA_RPC_URL;
const PRIVATE_KEY = process.env.PRIVATE_KEY;

export default {
  solidity: "0.8.20",
  networks: {
    sepolia: {
      url: SEPOLIA_RPC_URL,
      accounts: [PRIVATE_KEY],
    },
  },
};