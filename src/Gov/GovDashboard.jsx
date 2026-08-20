import { useEffect, useState } from "react";
import axios from "axios";

export default function GovDashboard(){
  const [apps, setApps] = useState([]);
  const [loading, setLoading] = useState(true);
  const [actionNote, setActionNote] = useState("");

  const fetchApps = async () => {
    setLoading(true);
    const res = await axios.get("/api/applications");
    setApps(res.data);
    setLoading(false);
  };

  useEffect(() => { fetchApps(); }, []);

  const verify = async (id, action) => {
    if (!window.confirm(`Mark application ${id} as ${action}?`)) return;
    try {
      await axios.post(`/api/applications/${id}/verify`, {
        action,
        govName: "Gov Officer A",
        note: actionNote
      });
      setActionNote("");
      fetchApps();
    } catch (err) {
      alert("Error: " + (err.response?.data?.error || err.message));
    }
  };

  if (loading) return <div>Loading...</div>;

  return (
    <div style={{maxWidth:900, margin:"0 auto"}}>
      <h2>Government Dashboard</h2>
      <div>
        <label>Action note (applies to next verify): <input value={actionNote} onChange={(e)=>setActionNote(e.target.value)} /></label>
      </div>
      <table border="1" cellPadding="6" style={{width:"100%", marginTop:10}}>
        <thead>
          <tr>
            <th>ID</th><th>Org</th><th>Contact</th><th>Requirement</th><th>Doc</th><th>Status</th><th>Actions</th>
          </tr>
        </thead>
        <tbody>
          {apps.map(a => (
            <tr key={a.id}>
              <td>{a.id}</td>
              <td>{a.orgName}</td>
              <td>{a.contactPerson}<br/>{a.contactEmail}</td>
              <td style={{maxWidth:300}}>{a.requirement}</td>
              <td>
                {a.supportingDocumentUrl ? (
                  <a href={a.supportingDocumentUrl} target="_blank" rel="noreferrer">Open doc</a>
                ) : "—"}
              </td>
              <td>{a.status}{a.verifiedAt ? <div style={{fontSize:11}}>by {a.verifiedBy} @ {new Date(a.verifiedAt).toLocaleString()}</div> : null}</td>
              <td>
                {a.status === "pending" ? (
                  <>
                    <button onClick={() => verify(a.id, "approve")}>Approve</button>
                    <button onClick={() => verify(a.id, "reject")}>Reject</button>
                  </>
                ) : (<span>—</span>)}
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}
// {
// API Key: a66d9b1fb7628e8b4382
// API Secret: ce87d4c4e72fee3d91da4b9bb72e269140df97f8c159aca8938c0cc465a08e39
// JWT: eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJ1c2VySW5mb3JtYXRpb24iOnsiaWQiOiI1M2I5ZGM2OS1kNjM0LTQ1MWUtODEzZS01OGJjN2Q2NGRkYzkiLCJlbWFpbCI6InJvaGl0a3VtYXIyNzk2NUBnbWFpbC5jb20iLCJlbWFpbF92ZXJpZmllZCI6dHJ1ZSwicGluX3BvbGljeSI6eyJyZWdpb25zIjpbeyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJGUkExIn0seyJkZXNpcmVkUmVwbGljYXRpb25Db3VudCI6MSwiaWQiOiJOWUMxIn1dLCJ2ZXJzaW9uIjoxfSwibWZhX2VuYWJsZWQiOmZhbHNlLCJzdGF0dXMiOiJBQ1RJVkUifSwiYXV0aGVudGljYXRpb25UeXBlIjoic2NvcGVkS2V5Iiwic2NvcGVkS2V5S2V5IjoiYTY2ZDliMWZiNzYyOGU4YjQzODIiLCJzY29wZWRLZXlTZWNyZXQiOiJjZTg3ZDRjNGU3MmZlZTNkOTFkYTRiOWJiNzJlMjY5MTQwZGY5N2Y4YzE1OWFjYTg5MzhjMGNjNDY1YTA4ZTM5IiwiZXhwIjoxNzk1ODc0OTM2fQ.P2HKRqDP49I-768b5h42_UyGxjexaiI0X3PaqACR1xU
// }