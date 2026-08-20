import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

const CERT_CONTRACT_ABI =[
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "studentCID",
				"type": "string"
			}
		],
		"name": "addStudentCertificate",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [],
		"stateMutability": "nonpayable",
		"type": "constructor"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "orgWallet",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "regNo",
				"type": "string"
			}
		],
		"name": "OrgRegistered",
		"type": "event"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "orgWallet",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "bool",
				"name": "verified",
				"type": "bool"
			}
		],
		"name": "OrgVerified",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "string",
				"name": "_name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_regNo",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_website",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "_orgCertificateCID",
				"type": "string"
			}
		],
		"name": "registerOrganization",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"anonymous": false,
		"inputs": [
			{
				"indexed": true,
				"internalType": "address",
				"name": "orgWallet",
				"type": "address"
			},
			{
				"indexed": false,
				"internalType": "string",
				"name": "studentCID",
				"type": "string"
			}
		],
		"name": "StudentCertificateAdded",
		"type": "event"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "orgWallet",
				"type": "address"
			},
			{
				"internalType": "bool",
				"name": "status",
				"type": "bool"
			}
		],
		"name": "verifyOrganization",
		"outputs": [],
		"stateMutability": "nonpayable",
		"type": "function"
	},
	{
		"inputs": [
			{
				"internalType": "address",
				"name": "wallet",
				"type": "address"
			}
		],
		"name": "getOrganization",
		"outputs": [
			{
				"internalType": "string",
				"name": "name",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "regNo",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "website",
				"type": "string"
			},
			{
				"internalType": "string",
				"name": "orgCertificateCID",
				"type": "string"
			},
			{
				"internalType": "bool",
				"name": "isRegistered",
				"type": "bool"
			},
			{
				"internalType": "bool",
				"name": "isVerified",
				"type": "bool"
			},
			{
				"internalType": "string[]",
				"name": "studentCertificates",
				"type": "string[]"
			}
		],
		"stateMutability": "view",
		"type": "function"
	},
	{
		"inputs": [],
		"name": "owner",
		"outputs": [
			{
				"internalType": "address",
				"name": "",
				"type": "address"
			}
		],
		"stateMutability": "view",
		"type": "function"
	}
];
export default function OrgForm() {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [orgName, setOrgName] = useState("");
  const [orgGovId, setOrgGovId] = useState("");
  const [orgWebsite, setOrgWebsite] = useState("");
  const [file, setFile] = useState(null);
  const [verifying, setVerifying] = useState(false);
  const [verified, setVerified] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [error, setError] = useState("");
  const [status, setStatus] = useState("");
  const navigate = useNavigate();

  // ---------- MetaMask auto-connect ----------
  useEffect(() => {
    if (typeof window !== "undefined" && window.ethereum) {
      const eth = window.ethereum;

      eth
        .request({ method: "eth_accounts" })
        .then((accounts) => {
          if (accounts && accounts.length) {
            setWalletAddress(accounts[0]);
            setProvider(new ethers.BrowserProvider(window.ethereum));
          }
        })
        .catch(() => {});

      if (eth.on) {
        eth.on("accountsChanged", (accounts) => {
          if (accounts.length) setWalletAddress(accounts[0]);
          else setWalletAddress("");
        });
      }
    }
  }, []);

  // ---------- wallet / regNo change par org status check ----------
  useEffect(() => {
    if (walletAddress) {
      checkOrgStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress, orgGovId]);

  async function connectWallet() {
    try {
      if (!window.ethereum) throw new Error("MetaMask not installed");
      const ethProvider = new ethers.BrowserProvider(window.ethereum);
      await ethProvider.send("eth_requestAccounts", []);
      const signer = await ethProvider.getSigner();
      const address = await signer.getAddress();
      setWalletAddress(address);
      setProvider(ethProvider);
      setError("");
      setStatus("Wallet connected");
    } catch (e) {
      setError(e.message || "Could not connect wallet");
    }
  }

  // ---------- /api/verify call ----------
  async function verifyOrgServerSide() {
    setError("");
    setStatus("");
    setVerifying(true);
    setVerified(false);

    try {
      const fd = new FormData();
      fd.append("orgName", orgName);
      fd.append("orgGovId", orgGovId);
      fd.append("website", orgWebsite);
      fd.append("walletAddress", walletAddress || "");
      if (file) fd.append("file", file);

      const resp = await fetch("/api/verify", {
        method: "POST",
        body: fd,
      });

      const data = await resp.json();

      if (!resp.ok || data.error || data.success === false) {
        throw new Error(data.error || data.message || "Verification failed");
      }

      setVerified(true);
      setStatus(
        data.message ||
          "Org record stored & certificate pinned. On-chain verification admin dashboard se hogi."
      );
      return true;
    } catch (e) {
      setError(e.message || "Verification failed");
      setVerified(false);
      return false;
    } finally {
      setVerifying(false);
    }
  }

  // ---------- /api/pin call ----------
  async function pinFileServerSide(fileToPin) {
    if (!fileToPin) throw new Error("No file selected");

    const formData = new FormData();
    formData.append("file", fileToPin);
    formData.append("orgName", orgName);
    formData.append("orgGovId", orgGovId);

    const resp = await fetch("/api/pin", {
      method: "POST",
      body: formData,
    });

    const data = await resp.json();
    if (!resp.ok || data.error || data.success === false) {
      throw new Error(data.error || data.message || "Pin API failed");
    }

    return data.cid || data.ipfsHash;
  }

  // ---------- chain upload ----------
  async function uploadCertificateToChain(ipfsHash) {
    setTxStatus("Preparing transaction...");
    try {
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      if (!contractAddress)
        throw new Error("VITE_CONTRACT_ADDRESS not set in .env");

      if (!(provider && walletAddress))
        throw new Error("Connect MetaMask to sign the transaction");

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        CERT_CONTRACT_ABI,
        signer
      );

      setTxStatus("Sending transaction...");
      const tx = await contract.addStudentCertificate(ipfsHash);

      setTxStatus(
        `Transaction sent (hash: ${tx.hash}). Waiting for confirmation...`
      );
      await tx.wait();
      setTxStatus("Transaction confirmed — certificate recorded on-chain.");
    } catch (e) {
      setTxStatus("");
      throw e;
    }
  }

  // ---------- form submit ----------
  async function handleSubmit(e) {
    e.preventDefault();
    setError("");
    setStatus("");

    if (!verified) {
      const ok = await verifyOrgServerSide();
      if (!ok) return;
    }

    try {
      if (!file)
        throw new Error(
          "Please choose the certificate file to upload (PDF/JPG/etc.)"
        );

      setTxStatus("Pinning file to IPFS via backend...");
      const ipfsHash = await pinFileServerSide(file);
      setTxStatus(
        `Pinned to IPFS: ${ipfsHash}. Now uploading hash to blockchain...`
      );

      await uploadCertificateToChain(ipfsHash);
      setStatus("Certificate successfully uploaded to blockchain.");
    } catch (e) {
      setError(e.message || "Upload failed");
    }
  }

  // ---------- org status check ----------
  async function checkOrgStatus() {
    try {
      if (!walletAddress) return;

      const params = new URLSearchParams({
        walletAddress,
        orgGovId: orgGovId || "",
      });

      const resp = await fetch(`/api/org/status?${params.toString()}`);
      const data = await resp.json();

      if (!resp.ok) {
        throw new Error(data.error || "Status check failed");
      }

      if (data.exists && data.verified) {
        setVerified(true);
        setStatus("Already verified (from backend record).");
        setError("");

        // yaha chaaho to navigate kara sakte ho:
        // navigate("/student");  // <- tumhara actual route daalna
		<Route path="/student" element={<StudentPage />} />

        if (data.organization) {
          if (!orgName) setOrgName(data.organization.orgName || orgName);
          if (!orgWebsite) setOrgWebsite(data.organization.website || orgWebsite);
        }
      }
    } catch (e) {
      console.log("Status check error:", e.message);
    }
  }

  const submitDisabled = !(verified && file && walletAddress);
  const submitClass = `inline-flex items-center gap-2 px-5 py-2 rounded-lg text-white transition-transform transform ${
    submitDisabled
      ? "bg-gray-600 cursor-not-allowed opacity-60 scale-100"
      : "bg-emerald-500 hover:scale-105 shadow-lg"
  }`;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-gray-900 to-black p-6">
      <form
        onSubmit={handleSubmit}
        className="w-full max-w-2xl bg-[#0b1220] text-white rounded-2xl shadow-2xl p-8 ring-1 ring-white/5"
      >
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-bold tracking-tight">
            Organization Verify &amp; Upload
          </h1>
          <div className="flex items-center gap-3">
            {walletAddress ? (
              <div className="text-sm text-emerald-300">
                {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
              </div>
            ) : (
              <button
                type="button"
                onClick={connectWallet}
                className="px-3 py-2 bg-blue-600 rounded-md text-white hover:bg-blue-500 transition"
              >
                Connect
              </button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="col-span-1">
            <label className="text-sm text-gray-300">Organization Name</label>
            <input
              value={orgName}
              onChange={(e) => setOrgName(e.target.value)}
              required
              placeholder="My Institute"
              className="mt-1 w-full rounded-md bg-[#0f1724] border border-white/10 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">
              Government ID / Registration
            </label>
            <input
              value={orgGovId}
              onChange={(e) => setOrgGovId(e.target.value)}
              required
              placeholder="GSTIN / Reg No"
              className="mt-1 w-full rounded-md bg-[#0f1724] border border-white/10 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">Website (optional)</label>
            <input
              value={orgWebsite}
              onChange={(e) => setOrgWebsite(e.target.value)}
              placeholder="https://..."
              className="mt-1 w-full rounded-md bg-[#0f1724] border border-white/10 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
            />
          </div>

          <div>
            <label className="text-sm text-gray-300">
              Certificate (PDF / JPG)
            </label>
            <div className="mt-1 flex items-center gap-3">
              <label className="cursor-pointer inline-flex items-center gap-2 px-4 py-2 bg-white/6 rounded-md border border-white/5 hover:bg-white/10 transition">
                <input
                  type="file"
                  accept="application/pdf,image/*"
                  onChange={(e) => setFile(e.target.files[0])}
                  className="hidden"
                />
                <svg
                  xmlns="http://www.w3.org/2000/svg"
                  className="h-5 w-5 text-white/90"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    strokeWidth="2"
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4"
                  />
                </svg>
                <span className="text-sm text-white/90">Choose file</span>
              </label>
              <div className="text-sm text-gray-300">
                {file ? file.name : "No file chosen"}
              </div>
            </div>
          </div>
        </div>

        <div className="mt-6 flex items-center gap-3">
          <button
            type="button"
            onClick={verifyOrgServerSide}
            disabled={verifying}
            className="inline-flex items-center gap-2 px-4 py-2 rounded-lg bg-yellow-500 text-black hover:bg-yellow-400 transition transform hover:scale-105"
          >
            {verifying ? (
              <svg className="animate-spin h-5 w-5" viewBox="0 0 24 24">
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
            ) : (
              <svg
                xmlns="http://www.w3.org/2000/svg"
                className="h-5 w-5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2"
                  d="M5 13l4 4L19 7"
                />
              </svg>
            )}
            <span className="text-sm">Verify</span>
          </button>

          <button
            type="submit"
            disabled={submitDisabled}
            className={submitClass}
            title={
              submitDisabled
                ? "Verify, choose file and connect wallet first"
                : "Upload to blockchain"
             }
          >
             <svg
              xmlns="http://www.w3.org/2000/svg"
              className={`h-5 w-5 ${
                submitDisabled ? "opacity-60" : "text-white"
              }`}
              fill="none"
              viewBox="0 0 24 24"
              stroke="currentColor"
             >
              <path
                strokeLinecap="round"
                strokeLinejoin="round"
                strokeWidth="2"
                d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4"
              />
             </svg>
            <span className="text-sm">Upload</span>
          </button>

          <div className="ml-auto text-sm text-gray-400">
            {txStatus || (verified ? "Verified" : "Not verified")}
          </div>
        </div>

        <div className="mt-4 space-y-1">
          {status && (
            <div className="text-sm text-emerald-400">✔ {status}</div>
          )}
          {error && <div className="text-sm text-red-400">Error: {error}</div>}
        </div>

        <div className="mt-6 text-xs text-gray-500">
          Note: Backend endpoints{" "}
          <code className="bg-white/5 px-1 py-0.5 rounded">/api/verify</code>{" "}
          and{" "}
          <code className="bg-white/5 px-1 py-0.5 rounded">/api/pin</code> are
          required.
        </div>
      </form>
    </div>
  );
}
