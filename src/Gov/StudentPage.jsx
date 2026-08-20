// src/pages/StudentPage.jsx
import React, { useState, useEffect } from "react";
import { ethers } from "ethers";
import { useNavigate } from "react-router-dom";

// Contract ke liye minimal ABI (sirf zaroori functions)
const CERT_CONTRACT_ABI = [
  {
    inputs: [{ internalType: "string", name: "studentCID", type: "string" }],
    name: "addStudentCertificate",
    outputs: [],
    stateMutability: "nonpayable",
    type: "function",
  },
  {
    inputs: [{ internalType: "address", name: "wallet", type: "address" }],
    name: "getOrganization",
    outputs: [
      { internalType: "string", name: "name", type: "string" },
      { internalType: "string", name: "regNo", type: "string" },
      { internalType: "string", name: "website", type: "string" },
      { internalType: "string", name: "orgCertificateCID", type: "string" },
      { internalType: "bool", name: "isRegistered", type: "bool" },
      { internalType: "bool", name: "isVerified", type: "bool" },
      { internalType: "string[]", name: "studentCertificates", type: "string[]" },
    ],
    stateMutability: "view",
    type: "function",
  },
];

export default function StudentPage() {
  const [walletAddress, setWalletAddress] = useState("");
  const [provider, setProvider] = useState(null);
  const [orgInfo, setOrgInfo] = useState(null);

  const [studentName, setStudentName] = useState("");
  const [studentId, setStudentId] = useState("");
  const [file, setFile] = useState(null);

  const [uploading, setUploading] = useState(false);
  const [status, setStatus] = useState("");
  const [txStatus, setTxStatus] = useState("");
  const [error, setError] = useState("");
  const [certList, setCertList] = useState([]);

  const navigate = useNavigate();

  // ---------- MetaMask auto-connect ----------
  useEffect(() => {
    async function autoConnect() {
      if (typeof window === "undefined" || !window.ethereum) return;

      const eth = window.ethereum;
      try {
        const accounts = await eth.request({ method: "eth_accounts" });
        if (accounts && accounts.length) {
          const addr = accounts[0];
          setWalletAddress(addr);
          setProvider(new ethers.BrowserProvider(window.ethereum));
        }
        if (eth.on) {
          eth.on("accountsChanged", (accounts) => {
            if (accounts.length) {
              setWalletAddress(accounts[0]);
              setProvider(new ethers.BrowserProvider(window.ethereum));
            } else {
              setWalletAddress("");
              setProvider(null);
            }
          });
        }
      } catch (e) {
        console.log("autoConnect error:", e);
      }
    }

    autoConnect();
  }, []);

  // ---------- wallet change pe backend se status check ----------
  useEffect(() => {
    if (walletAddress) {
      checkBackendStatus();
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [walletAddress]);

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
    } catch (e) {
      setError(e.message || "Could not connect wallet");
    }
  }

  // --------- Backend se org status (sirf verified org ko rehne do) ----------
  async function checkBackendStatus() {
    try {
      setStatus("");
      setError("");

      const params = new URLSearchParams({
        walletAddress,
      });

      const resp = await fetch(`/api/org/status?${params.toString()}`);
      const data = await resp.json();

      if (resp.status === 200 && data.success && data.verified) {
        setOrgInfo(data.organization);
        setStatus("Logged in as verified organization.");
        // chain se student certificates bhi nikalne ki koshish:
        fetchOrgFromChain(data.organization.walletAddress);
        return;
      }

      // org hi nahi
      if (resp.status === 404) {
        setError(data.message || "Organization not registered.");
        navigate("/OrgForm"); // pehle verify karne bhej do
        return;
      }

      // org hai but verified nahi
      if (resp.status === 403) {
        setError(data.message || "You are not verified to government.");
        navigate("/OrgForm");
        return;
      }

      if (!resp.ok) {
        setError(data.error || "Status check failed");
      }
    } catch (e) {
      console.log("status check error:", e);
      setError(e.message || "Status check failed");
    }
  }

  // ---------- Chain se org info + student certificates ----------
  async function fetchOrgFromChain(wallet) {
    try {
      if (!provider || !wallet) return;

      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      if (!contractAddress) return;

      const contract = new ethers.Contract(
        contractAddress,
        CERT_CONTRACT_ABI,
        await provider.getSigner()
      );

      const orgOnChain = await contract.getOrganization(wallet);
      // orgOnChain[6] = studentCertificates[]
      const certs = orgOnChain[6] || [];
      setCertList(Array.from(certs));
    } catch (e) {
      console.log("fetchOrgFromChain error:", e.message);
    }
  }

  // ---------- Upload student certificate ----------
  async function handleUpload(e) {
    e.preventDefault();
    setError("");
    setStatus("");
    setTxStatus("");

    try {
      if (!walletAddress) throw new Error("Connect wallet first");
      if (!file) throw new Error("Select certificate file");
      if (!studentName) throw new Error("Enter student name");

      setUploading(true);
      setTxStatus("Pinning file to IPFS via backend...");

      // 1) Pin file to IPFS via backend
      const formData = new FormData();
      formData.append("file", file);
      formData.append("studentName", studentName);
      formData.append("studentId", studentId);
      if (orgInfo) {
        formData.append("orgName", orgInfo.orgName || orgInfo.orgName);
        formData.append("orgGovId", orgInfo.orgGovId || orgInfo.orgGovId);
      }

      const pinResp = await fetch("/api/pin", {
        method: "POST",
        body: formData,
      });
      const pinData = await pinResp.json();
      if (!pinResp.ok || !pinData.success) {
        throw new Error(pinData.error || "Pin failed");
      }

      const cid = pinData.cid || pinData.ipfsHash;
      setTxStatus(`Pinned to IPFS: ${cid}. Sending transaction...`);

      // 2) Call contract.addStudentCertificate(cid)
      const contractAddress = import.meta.env.VITE_CONTRACT_ADDRESS;
      if (!contractAddress) {
        throw new Error("VITE_CONTRACT_ADDRESS not set in .env");
      }
      if (!provider) {
        throw new Error("No provider. Connect MetaMask again.");
      }

      const signer = await provider.getSigner();
      const contract = new ethers.Contract(
        contractAddress,
        CERT_CONTRACT_ABI,
        signer
      );

      const tx = await contract.addStudentCertificate(cid);
      setTxStatus(`Tx sent: ${tx.hash}. Waiting for confirmation...`);
      await tx.wait();
      setTxStatus("Transaction confirmed. Certificate stored on-chain.");
      setStatus("Student certificate uploaded successfully.");

      // add to local list
      setCertList((prev) => [cid, ...prev]);
      setStudentName("");
      setStudentId("");
      setFile(null);
    } catch (e) {
      console.error(e);
      setError(e.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  }

  const uploadDisabled = !walletAddress || !orgInfo || !file || !studentName;

  return (
    <div className="min-h-screen flex items-center justify-center bg-gradient-to-b from-slate-900 via-gray-900 to-black p-6">
      <div className="w-full max-w-3xl bg-[#0b1220] text-white rounded-2xl shadow-2xl p-8 ring-1 ring-white/5">
        <div className="flex items-center justify-between mb-6">
          <div>
            <h1 className="text-2xl font-bold tracking-tight">
              Student Certificate Upload
            </h1>
            {orgInfo && (
              <p className="text-sm text-gray-300 mt-1">
                Org: <span className="font-semibold">{orgInfo.orgName}</span> (
                {orgInfo.orgGovId})
              </p>
            )}
          </div>

          <div className="flex items-center gap-3">
            {walletAddress ? (
              <div className="text-sm text-emerald-300 text-right">
                <div>Wallet</div>
                <div>
                  {walletAddress.slice(0, 6)}...{walletAddress.slice(-4)}
                </div>
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

        {/* Upload form */}
        <form onSubmit={handleUpload} className="space-y-4">
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            <div>
              <label className="text-sm text-gray-300">Student Name</label>
              <input
                value={studentName}
                onChange={(e) => setStudentName(e.target.value)}
                required
                placeholder="Student full name"
                className="mt-1 w-full rounded-md bg-[#0f1724] border border-white/10 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>

            <div>
              <label className="text-sm text-gray-300">
                Student ID / Roll (optional)
              </label>
              <input
                value={studentId}
                onChange={(e) => setStudentId(e.target.value)}
                placeholder="Roll no / Enrollment"
                className="mt-1 w-full rounded-md bg-[#0f1724] border border-white/10 p-3 text-white placeholder-gray-400 focus:outline-none focus:ring-2 focus:ring-emerald-400 transition"
              />
            </div>

            <div className="md:col-span-2">
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

          <button
            type="submit"
            disabled={uploadDisabled || uploading}
            className={`mt-2 inline-flex items-center gap-2 px-5 py-2 rounded-lg text-white transition-transform transform ${
              uploadDisabled || uploading
                ? "bg-gray-600 cursor-not-allowed opacity-60"
                : "bg-emerald-500 hover:scale-105 shadow-lg"
            }`}
          >
            {uploading ? (
              <>
                <svg
                  className="animate-spin h-5 w-5"
                  viewBox="0 0 24 24"
                >
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
                <span className="text-sm">Uploading...</span>
              </>
            ) : (
              <>
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
                    d="M3 7v10a2 2 0 002 2h14a2 2 0 002-2V7M16 3v4M8 3v4"
                  />
                </svg>
                <span className="text-sm">Upload to blockchain</span>
              </>
            )}
          </button>
        </form>

        {/* Status / error */}
        <div className="mt-4 space-y-1">
          {status && <div className="text-sm text-emerald-400">✔ {status}</div>}
          {txStatus && (
            <div className="text-xs text-blue-300 break-all">{txStatus}</div>
          )}
          {error && <div className="text-sm text-red-400">Error: {error}</div>}
        </div>

        {/* Existing certificates list (from chain) */}
        <div className="mt-6">
          <h2 className="text-sm font-semibold text-gray-300 mb-2">
            On-chain student certificates (IPFS CIDs)
          </h2>
          {certList.length === 0 ? (
            <div className="text-xs text-gray-500">
              No certificates found yet.
            </div>
          ) : (
            <ul className="space-y-1 text-xs text-gray-300 max-h-40 overflow-y-auto">
              {certList.map((cid, idx) => (
                <li
                  key={cid + idx}
                  className="px-3 py-1 rounded bg-white/5 flex justify-between items-center"
                >
                  <span className="truncate mr-2">{cid}</span>
                  <a
                    href={`https://gateway.pinata.cloud/ipfs/${cid}`}
                    target="_blank"
                    rel="noreferrer"
                    className="underline text-emerald-300 text-[11px]"
                  >
                    View
                  </a>
                </li>
              ))}
            </ul>
          )}
        </div>
      </div>
    </div>
  );
}
