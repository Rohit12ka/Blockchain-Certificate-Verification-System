// import { createContext, useState } from "react";

// // export const VerifyContext = createContext();

// export default function VerifyProvider({ children }) {
  
//   const [pendingOrgs, setPendingOrgs] = useState([]);
//   const [approvedOrgs, setApprovedOrgs] = useState([]);

//   // Govt approval request
//   const requestApproval = (orgName, orgCode) => {
//     setPendingOrgs([...pendingOrgs, { orgName, orgCode }]);
//   };

//   // Approve organization (Gov action)
//   const approveOrg = (orgCode) => {
//     const org = pendingOrgs.find((o) => o.orgCode === orgCode);
//     if (org) {
//       setApprovedOrgs([...approvedOrgs, org]);
//       setPendingOrgs(pendingOrgs.filter((o) => o.orgCode !== orgCode));
//     }
//   };

//   // Check if org is approved (Student / Upload Page use)
//   const isOrgApproved = (orgCode) => {
//     return approvedOrgs.some((org) => org.orgCode === orgCode);
//   };

//   return (
//     <VerifyContext.Provider
//       value={{
//         pendingOrgs,
//         approvedOrgs,
//         requestApproval,
//         approveOrg,
//         isOrgApproved,
//       }}
//     >
//       {children}
//     </VerifyContext.Provider>
//   );
// }

// import { createContext, useState } from "react";

// // 1️⃣ Create Context
// const VerifyContext = createContext();

// // 2️⃣ Create Provider Component
// export const VerifyProvider = ({ children }) => {
//   const [pendingOrgs, setPendingOrgs] = useState([]);
//   const [approvedOrgs, setApprovedOrgs] = useState([]);

//   const requestApproval = (orgName, orgCode) => {
//     setPendingOrgs([...pendingOrgs, { orgName, orgCode }]);
//   };

//   const approveOrg = (orgCode) => {
//     const org = pendingOrgs.find((o) => o.orgCode === orgCode);
//     if (org) {
//       setApprovedOrgs([...approvedOrgs, org]);
//       setPendingOrgs(pendingOrgs.filter((o) => o.orgCode !== orgCode));
//     }
//   };

//   const isOrgApproved = (orgCode) => {
//     return approvedOrgs.some((org) => org.orgCode === orgCode);
//   };

//   return (
//     <VerifyContext.Provider
//       value={{
//         pendingOrgs,
//         approvedOrgs,
//         requestApproval,
//         approveOrg,
//         isOrgApproved,
//       }}
//     >
//       {children}
//     </VerifyContext.Provider>
//   );
// };

// // 3️⃣ Custom Hook
// // export const useVerify = () => useContext(VerifyContext);

// // 4️⃣ Export Default
// export default VerifyContext;
// import { createContext, useState } from "react";
// import { VerifyContext } from "../context/VerifyContext";


// export const VerifyContext = createContext();

// export default function VerifyProvider({ children }) {
//   const [pendingOrgs, setPendingOrgs] = useState([]);
//   const [approvedOrgs, setApprovedOrgs] = useState([]);

//   const requestApproval = (orgName, orgCode) => {
//     setPendingOrgs([...pendingOrgs, { orgName, orgCode }]);
//   };

//   const approveOrg = (orgCode) => {
//     const org = pendingOrgs.find((o) => o.orgCode === orgCode);
//     if (org) {
//       setApprovedOrgs([...approvedOrgs, org]);
//       setPendingOrgs(pendingOrgs.filter((o) => o.orgCode !== orgCode));
//     }
//   };

//   const isOrgApproved = (orgCode) => {
//     return approvedOrgs.some((org) => org.orgCode === orgCode);
//   };

//   return (
//     <VerifyContext.Provider
//       value={{
//         pendingOrgs,
//         approvedOrgs,
//         requestApproval,
//         approveOrg,
//         isOrgApproved,
//       }}
//     >
//       {children}
//     </VerifyContext.Provider>
//   );
// }
import { createContext, useContext, useState } from "react";

export const VerifyContext = createContext();

export const VerifyProvider = ({ children }) => {
  const [pendingOrgs, setPendingOrgs] = useState([]);
  const [approvedOrgs, setApprovedOrgs] = useState([]);

  const requestApproval = (orgName, orgCode) => {
    setPendingOrgs([...pendingOrgs, { orgName, orgCode }]);
  };

  const approveOrg = (orgCode) => {
    const org = pendingOrgs.find((o) => o.orgCode === orgCode);
    if (org) {
      setApprovedOrgs([...approvedOrgs, org]);
      setPendingOrgs(pendingOrgs.filter((o) => o.orgCode !== orgCode));
    }
  };

  const isOrgApproved = (orgCode) => {
    return approvedOrgs.some((org) => org.orgCode === orgCode);
  };

  return (
    <VerifyContext.Provider
      value={{
        pendingOrgs,
        approvedOrgs,
        requestApproval,
        approveOrg,
        isOrgApproved,
      }}
    >
      {children}
    </VerifyContext.Provider>
  );
};

export const useVerify = () => useContext(VerifyContext);//
