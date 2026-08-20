// src/components/AdminDashboard.jsx
import React, { useEffect, useState } from "react";
import { ethers } from "ethers";


/**
 * AdminDashboard
 * - Connect MetaMask as admin (must be contract owner)
 * - Fetch all organizations from server: GET /api/admin/orgs
 * - For each org: show details and buttons:
 *     - Verify on-chain (calls contract.verifyOrganization(orgWallet, true))
 *     - Unverify on-chain (calls contract.verifyOrganization(orgWallet, false))
 *     - (Optionally) Mark as verified in server DB: POST /api/admin/mark-verified
 *
 * Requirements:
 * - VITE_CONTRACT_ADDRESS in your frontend .env
 * - CONTRACT_ABI below must include verifyOrganization(address,bool) and getOrganization()
 * - Server endpoints: GET /api/admin/orgs  and POST /api/admin/mark-verified
 */

const CONTRACT_ADDRESS = import.meta.env.VITE_CONTRACT_ADDRESS || "0xD7ACd2a9FD159E69Bb102A1ca21C9a3e3A5F771B";
const CONTRACT_ABI = [
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

export default function AdminDashboard() {
  const [wallet, setWallet] = useState("");
  const [provider, setProvider] = useState(null);
  const [orgs, setOrgs] = useState([]);
  const [loading, setLoading] = useState(false);
  const [txStatus, setTxStatus] = useState("");
  const [error, setError] = useState("");

  useEffect(() => {
    if (window.ethereum) {
      // if accounts already connected, set them and fetch orgs
      window.ethereum.request({ method: "eth_accounts" }).then(accounts => {
        if (accounts && accounts.length) {
          const addr = accounts[0];
          setWallet(addr);
          const p = new ethers.BrowserProvider(window.ethereum);
          setProvider(p);
          fetchOrgs();
        }
      }).catch(()=>{});
      window.ethereum.on && window.ethereum.on("accountsChanged", (accounts) => {
        if (accounts && accounts.length) {
          setWallet(accounts[0]);
          setProvider(new ethers.BrowserProvider(window.ethereum));
        } else {
          setWallet("");
          setProvider(null);
        }
      });
    }
  }, []);

  async function connectWallet() {
    try {
      if (!window.ethereum) throw new Error("MetaMask required");
      const p = new ethers.BrowserProvider(window.ethereum);
      await p.send("eth_requestAccounts", []);
      const signer = await p.getSigner();
      const addr = await signer.getAddress();
      setWallet(addr);
      setProvider(p);
      setError("");
      await fetchOrgs();
    } catch (e) {
      setError(e.message || "Failed to connect");
    }
  }

  async function fetchOrgs() {
    try {
      setLoading(true);
      const resp = await fetch("/api/admin/orgs");
      if (!resp.ok) {
        const txt = await resp.text();
        throw new Error("Failed to fetch orgs: " + txt);
      }
      const data = await resp.json();
      setOrgs(data.organizations || []);
    } catch (e) {
      setError(e.message || String(e));
    } finally {
      setLoading(false);
    }
  }

  // call on-chain verifyOrganization(orgWallet, true/false)
  async function verifyOnChain(orgWallet, status) {
    try {
      setTxStatus("Preparing transaction...");
      if (!provider) throw new Error("Connect MetaMask as admin (owner)");
      const signer = await provider.getSigner();
      const contract = new ethers.Contract(CONTRACT_ADDRESS, CONTRACT_ABI, signer);
      // send tx
      const tx = await contract.verifyOrganization(orgWallet, status);
      setTxStatus(`Sent tx ${tx.hash}. Waiting confirmation...`);
      await tx.wait();
      setTxStatus("Transaction confirmed. Updating server record...");
      // update server DB so frontend users see immediate change
      const markResp = await fetch("/api/admin/mark-verified", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ walletAddress: orgWallet, verified: status })
      });
      if (!markResp.ok) {
        const txt = await markResp.text();
        throw new Error("Server update failed: " + txt);
      }
      await fetchOrgs();
      setTxStatus("Org verification status updated.");
    } catch (e) {
      console.error(e);
      setError(e.message || String(e));
      setTxStatus("");
    }
  }

  return (
    <div className="min-h-screen bg-gradient-to-b from-slate-900 to-black p-6 text-white">
      <div className="max-w-5xl mx-auto">
        <div className="flex items-center justify-between mb-6">
          <h1 className="text-2xl font-semibold">Admin Dashboard — Organization Verification</h1>
          <div>
            {wallet ? (
              <div className="text-sm text-emerald-300">Connected: {wallet.slice(0,6)}...{wallet.slice(-4)}</div>
            ) : (
              <button onClick={connectWallet} className="bg-blue-600 px-4 py-2 rounded">Connect MetaMask</button>
            )}
          </div>
        </div>

        <div className="mb-4">
          <button onClick={fetchOrgs} className="bg-gray-700 px-3 py-2 rounded mr-2">Refresh</button>
          <span className="text-sm text-gray-400 ml-3">{txStatus}</span>
          {error && <div className="text-sm text-rose-400 mt-2">{error}</div>}
        </div>

        <div className="bg-[#071022] p-4 rounded">
          {loading ? <div>Loading organizations...</div> : (
            <table className="w-full table-auto text-sm">
              <thead>
                <tr className="text-left text-gray-300">
                  <th className="p-2">Wallet</th>
                  <th className="p-2">Org Name</th>
                  <th className="p-2">Reg No</th>
                  <th className="p-2">Org CID</th>
                  <th className="p-2">Verified</th>
                  <th className="p-2">Actions</th>
                </tr>
              </thead>
              <tbody>
                {orgs.length === 0 && <tr><td colSpan={6} className="p-4 text-gray-400">No organizations registered yet.</td></tr>}
                {orgs.map((o, idx) => (
                  <tr key={idx} className="border-t border-white/5">
                    <td className="p-2 align-top break-all">{o.walletAddress}</td>
                    <td className="p-2 align-top">{o.orgName}</td>
                    <td className="p-2 align-top">{o.orgGovId}</td>
                    <td className="p-2 align-top break-all">{o.orgCID}</td>
                    <td className="p-2 align-top">{o.isVerified ? <span className="text-emerald-300">Yes</span> : <span className="text-yellow-300">No</span>}</td>
                    <td className="p-2 align-top">
                      <div className="flex gap-2">
                        <button className="px-3 py-1 bg-emerald-600 rounded text-xs" onClick={() => verifyOnChain(o.walletAddress, true)}>Verify</button>
                        <button className="px-3 py-1 bg-rose-600 rounded text-xs" onClick={() => verifyOnChain(o.walletAddress, false)}>Unverify</button>
                        <button className="px-3 py-1 bg-gray-700 rounded text-xs" onClick={() => { navigator.clipboard.writeText(o.orgCID || ""); setTxStatus("CID copied"); }}>Copy CID</button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          )}
        </div>

      </div>
    </div>
  );
}
