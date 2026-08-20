import React, { useState } from "react";
import { ethers } from "ethers";
import abi from "../abi/CertificateStorageABI.json";

const CONTRACT_ADDRESS = "0xe4d3cDDa5aa66573799Ea38976DFa1C2AE4De8E5"; // same contract address

const CertificateVerifier = () => {
  const [hash, setHash] = useState("");
  const [result, setResult] = useState(null);
  const [status, setStatus] = useState("");

  const handleVerify = async () => {
    if (!window.ethereum) {
      alert("Please install MetaMask!");
      return;
    }

    try {
      setStatus("Connecting to blockchain...");
      const provider = new ethers.BrowserProvider(window.ethereum);
      const contract = new ethers.Contract(CONTRACT_ADDRESS, abi, provider);

      const data = await contract.verifyCertificate(hash);
      const [name, course, isValid] = data;

      if (!name) {
        setResult({ name: "Not found", course: "-", isValid: false });
        setStatus("❌ Certificate not found");
      } else {
        setResult({ name, course, isValid });
        setStatus("✅ Verification complete");
      }
    } catch (error) {
      console.error(error);
      setStatus("⚠️ Verification failed");
    }
  };

  return (
    <div className="p-6 bg-gray-900 text-white rounded-xl max-w-lg mx-auto mt-10">
      <h2 className="text-xl font-bold mb-4">Verify Certificate</h2>
      <input
        type="text"
        placeholder="Enter certificate IPFS hash"
        value={hash}
        onChange={(e) => setHash(e.target.value)}
        className="w-full p-2 mb-3 text-black rounded"
      />
      <button
        onClick={handleVerify}
        className="w-full bg-green-500 hover:bg-green-600 text-white py-2 rounded"
      >
        Verify
      </button>

      <p className="mt-4 text-sm text-gray-300">{status}</p>

      {result && (
        <div className="mt-4 border border-gray-700 rounded-lg p-4">
          <h3 className="text-lg font-semibold mb-2">Result</h3>
          <p><strong>Name:</strong> {result.name}</p>
          <p><strong>Course:</strong> {result.course}</p>
          <p>
            <strong>Status:</strong>{" "}
            {result.isValid ? (
              <span className="text-green-400">Valid ✅</span>
            ) : (
              <span className="text-red-400">Invalid ❌</span>
            )}
          </p>
        </div>
      )}
    </div>
  );
};

export default CertificateVerifier;
