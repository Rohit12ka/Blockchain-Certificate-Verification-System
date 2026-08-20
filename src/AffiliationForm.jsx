import React, { useState } from "react";
import { ethers } from "ethers";
import axios from "axios";

// Minimal ABI containing only requestApproval(string,string)
const CONTRACT_ABI_MIN = [
  {
    inputs: [
      { internalType: "string", name: "orgName", type: "string" },
      { internalType: "string", name: "documentCID", type: "string" }
    ],
    name: "requestApproval",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function"
  }
];

// read contract address from env (Vite)
const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B";

// Pinata keys via Vite env
const PINATA_KEY = import.meta.env.VITE_PINATA_API_KEY;
const PINATA_SECRET = import.meta.env.VITE_PINATA_SECRET_API_KEY;

export default function AffiliationForm() {
  const [entityType, setEntityType] = useState("");
  const [entityName, setEntityName] = useState("");
  const [walletAddress, setWalletAddress] = useState("");
  const [registrationNumber, setRegistrationNumber] = useState("");
  const [address, setAddress] = useState("");
  const [stateName, setStateName] = useState("");
  const [district, setDistrict] = useState("");
  const [contactPerson, setContactPerson] = useState("");
  const [contactPhone, setContactPhone] = useState("");
  const [email, setEmail] = useState("");

  // Type specific
  const [extraDetails, setExtraDetails] = useState({});

  // File uploads
  const [files, setFiles] = useState([]);
  const [status, setStatus] = useState("");
  const [loading, setLoading] = useState(false);

  const updateExtra = (key, value) => {
    setExtraDetails((s) => ({ ...s, [key]: value }));
  };

  const handleFiles = (e) => {
    setFiles(Array.from(e.target.files));
  };

  // Helper: get ethers contract + accounts using MetaMask
  async function getEthersContract() {
    if (!window.ethereum) throw new Error("MetaMask not available. Install or enable it.");
    const provider = new ethers.BrowserProvider(window.ethereum);
    // request accounts if not already available
    await provider.send("eth_requestAccounts", []);
    const signer = await provider.getSigner();
    const address = await signer.getAddress();
    const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI_MIN, signer);
    return { provider, signer, contract, address };
  }

  const autoFillWallet = async () => {
    try {
      if (window.ethereum) {
        const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
        setWalletAddress(accounts[0]);
      } else {
        setStatus("MetaMask not found in browser.");
      }
    } catch (err) {
      console.error(err);
      setStatus("Failed to fetch wallet address from MetaMask");
    }
  };

  // Pin file to Pinata (returns array of pinned file objects)
  async function pinFilesToPinata(fileList) {
    const results = [];
    for (const f of fileList) {
      const formData = new FormData();
      formData.append("file", f);
      formData.append(
        "pinataMetadata",
        JSON.stringify({ name: `${entityName || "entity"}-${f.name}` })
      );

      const res = await fetch("https://api.pinata.cloud/pinning/pinFileToIPFS", {
        method: "POST",
        headers: {
          // Pinata may require JWT or API key/secret in different setups.
          Authorization: PINATA_SECRET ? `Bearer ${PINATA_SECRET}` : ""
        },
        body: formData
      });

      if (!res.ok) {
        const txt = await res.text().catch(() => res.statusText);
        throw new Error(`Pinata file upload failed: ${res.status} ${txt}`);
      }
      const json = await res.json();
      results.push({ type: f.type || "document", ipfsCid: json.IpfsHash, name: f.name });
    }
    return results;
  }

  // Pin JSON metadata to Pinata
  async function pinJSONToPinata(jsonObj) {
    const res = await fetch("https://api.pinata.cloud/pinning/pinJSONToIPFS", {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
        Authorization: PINATA_SECRET ? `Bearer ${PINATA_SECRET}` : ""
      },
      body: JSON.stringify(jsonObj)
    });
    if (!res.ok) {
      const txt = await res.text().catch(() => res.statusText);
      throw new Error(`Pinata JSON upload failed: ${res.status} ${txt}`);
    }
    const j = await res.json();
    return j.IpfsHash;
  }

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setStatus("Uploading documents to IPFS (Pinata)...");

    try {
      // 1) pin files
      const pinnedFiles = await pinFilesToPinata(files);

      setStatus("Preparing metadata JSON and pinning to IPFS...");
      const payload = {
        entityType,
        entityName,
        walletAddress,
        registrationNumber,
        address,
        state: stateName,
        district,
        contactPerson,
        contactPhone,
        email,
        extraDetails,
        uploadedDocuments: pinnedFiles,
        createdAt: new Date().toISOString()
      };

      // 2) pin JSON
      const mainCID = await pinJSONToPinata(payload);

      setStatus(`Pinned metadata to IPFS: ${mainCID}. Sending transaction to smart contract...`);

      // 3) use ethers to call contract.requestApproval(entityName, mainCID)
      const { contract, address: from } = await getEthersContract();
      // send transaction
      const tx = await contract.requestApproval(entityName, mainCID);
      setStatus(`Transaction sent (hash: ${tx.hash}). Waiting for confirmation...`);
      await tx.wait();
      setStatus("Request submitted and transaction confirmed on-chain.");

    } catch (err) {
      console.error(err);
      setStatus(`Error: ${err?.message || String(err)}`);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-3xl mx-auto p-6 bg-gray-900 text-white rounded-xl shadow-md">
      <h1 className="text-2xl font-semibold mb-4">Universal Verification / Affiliation Form</h1>

      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm">Entity Type</label>
          <select
            className="mt-1 w-full rounded p-2 bg-gray-800"
            value={entityType}
            onChange={(e) => setEntityType(e.target.value)}
            required
          >
            <option value="">Select type</option>
            <option value="college">College</option>
            <option value="coaching">Coaching</option>
            <option value="company">Company</option>
            <option value="property">Property</option>
          </select>
        </div>

        <div>
          <label className="block text-sm">Entity Name</label>
          <input
            className="mt-1 w-full rounded p-2 bg-gray-800"
            value={entityName}
            onChange={(e) => setEntityName(e.target.value)}
            required
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Wallet Address</label>
            <div className="flex mt-1">
              <input
                className="rounded-l p-2 bg-gray-800 w-full"
                value={walletAddress}
                onChange={(e) => setWalletAddress(e.target.value)}
                placeholder="0x..."
              />
              <button
                type="button"
                onClick={autoFillWallet}
                className="bg-indigo-600 px-3 rounded-r"
              >
                Connect
              </button>
            </div>
          </div>

          <div>
            <label className="block text-sm">Registration Number</label>
            <input
              className="mt-1 w-full rounded p-2 bg-gray-800"
              value={registrationNumber}
              onChange={(e) => setRegistrationNumber(e.target.value)}
            />
          </div>
        </div>

        <div>
          <label className="block text-sm">Address</label>
          <input
            className="mt-1 w-full rounded p-2 bg-gray-800"
            value={address}
            onChange={(e) => setAddress(e.target.value)}
          />
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">State</label>
            <input className="mt-1 w-full rounded p-2 bg-gray-800" value={stateName} onChange={(e) => setStateName(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">District</label>
            <input className="mt-1 w-full rounded p-2 bg-gray-800" value={district} onChange={(e) => setDistrict(e.target.value)} />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm">Contact Person</label>
            <input className="mt-1 w-full rounded p-2 bg-gray-800" value={contactPerson} onChange={(e) => setContactPerson(e.target.value)} />
          </div>
          <div>
            <label className="block text-sm">Contact Phone</label>
            <input className="mt-1 w-full rounded p-2 bg-gray-800" value={contactPhone} onChange={(e) => setContactPhone(e.target.value)} />
          </div>
        </div>

        <div>
          <label className="block text-sm">Email</label>
          <input className="mt-1 w-full rounded p-2 bg-gray-800" value={email} onChange={(e) => setEmail(e.target.value)} />
        </div>

        {/* Type specific fields */}
        {entityType === "college" && (
          <div className="space-y-2">
            <label className="block text-sm">College specific</label>
            <input className="mt-1 w-full rounded p-2 bg-gray-800" placeholder="University Name" onChange={(e) => updateExtra('universityName', e.target.value)} />
            <input className="mt-1 w-full rounded p-2 bg-gray-800" placeholder="Course Type (e.g. B.Tech)" onChange={(e) => updateExtra('courseType', e.target.value)} />
            <input className="mt-1 w-full rounded p-2 bg-gray-800" placeholder="AICTE Approval No (if any)" onChange={(e) => updateExtra('aicteApprovalNumber', e.target.value)} />
          </div>
        )}

        {entityType === "company" && (
          <div className="space-y-2">
            <label className="block text-sm">Company specific</label>
            <input className="mt-1 w-full rounded p-2 bg-gray-800" placeholder="CIN Number" onChange={(e) => updateExtra('cinNumber', e.target.value)} />
            <input className="mt-1 w-full rounded p-2 bg-gray-800" placeholder="GST Number" onChange={(e) => updateExtra('gstNumber', e.target.value)} />
          </div>
        )}

        {entityType === "property" && (
          <div className="space-y-2">
            <label className="block text-sm">Property specific</label>
            <input className="mt-1 w-full rounded p-2 bg-gray-800" placeholder="Khasra / Khata Number" onChange={(e) => updateExtra('khasraNumber', e.target.value)} />
            <input className="mt-1 w-full rounded p-2 bg-gray-800" placeholder="Registry Number" onChange={(e) => updateExtra('registryNumber', e.target.value)} />
            <input className="mt-1 w-full rounded p-2 bg-gray-800" placeholder="Owner Name" onChange={(e) => updateExtra('ownerName', e.target.value)} />
          </div>
        )}

        {entityType === "coaching" && (
          <div className="space-y-2">
            <label className="block text-sm">Coaching specific</label>
            <input className="mt-1 w-full rounded p-2 bg-gray-800" placeholder="Owner Name" onChange={(e) => updateExtra('ownerName', e.target.value)} />
            <input className="mt-1 w-full rounded p-2 bg-gray-800" placeholder="GST / PAN (if any)" onChange={(e) => updateExtra('taxNumber', e.target.value)} />
          </div>
        )}

        <div>
          <label className="block text-sm">Upload supporting documents (multiple)</label>
          <input className="mt-1 w-full rounded p-2 bg-gray-800" type="file" multiple onChange={handleFiles} />
        </div>

        <div className="flex items-center gap-3">
          <button type="submit" disabled={loading} className="bg-green-600 px-4 py-2 rounded">
            {loading ? "Submitting..." : "Submit for Verification"}
          </button>

          <button type="button" onClick={() => window.location.reload()} className="bg-gray-700 px-3 py-2 rounded">
            Reset
          </button>
        </div>

        {status && <p className="mt-2 text-sm">{status}</p>}
      </form>

      <div className="mt-6 text-xs text-gray-400">
        <p>Pinata: make sure VITE_PINATA_API_KEY and VITE_PINATA_SECRET_API_KEY are set in your .env</p>
      </div>
    </div>
  );
}
