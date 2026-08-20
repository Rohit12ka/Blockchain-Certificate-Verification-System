import { ethers } from "ethers";
import Web3 from "web3";
import ABI from "./abi/CertificateStorageABI.json";

const CONTRACT_ADDRESS = "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B";

export const getWeb3Contract = async () => {
  if (!window.ethereum) {
    alert("MetaMask not detected!");
    return null;
  }

  const web3 = new Web3(window.ethereum);
  await window.ethereum.request({ method: "eth_requestAccounts" });

  const contract = new web3.eth.Contract(ABI, CONTRACT_ADDRESS);
  const accounts = await web3.eth.getAccounts();

  return { web3, contract, accounts };
};
