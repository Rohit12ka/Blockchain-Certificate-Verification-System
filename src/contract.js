import { ethers } from "ethers";
import RegistryABI from "./contracts/CertificateRegistry.json";

export const CONTRACT_ADDRESS = "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B";

export async function getProviderAndSigner() {
  if (!window.ethereum) throw new Error("No wallet");
  // pick MetaMask provider when multiple present
  const providerObj = window.ethereum.providers
    ? window.ethereum.providers.find((p) => p.isMetaMask) || window.ethereum
    : window.ethereum;
  await providerObj.request({ method: "eth_requestAccounts" });
  const provider = new ethers.BrowserProvider(providerObj);
  const signer = await provider.getSigner();
  return { provider, signer };
}

export async function getContract(signerOrProvider = null) {
  if (!signerOrProvider) {
    const { provider } = await getProviderAndSigner();
    return new ethers.Contract(CONTRACT_ADDRESS, RegistryABI.abi || RegistryABI, provider);
  }
  return new ethers.Contract(CONTRACT_ADDRESS, RegistryABI.abi || RegistryABI, signerOrProvider);
}
