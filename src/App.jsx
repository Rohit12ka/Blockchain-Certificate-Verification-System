// import VerificationFlowUI from "./Gov/verify";
// import Customcursor from "./Components/Customcursor";
// import Navbar from "./Components/Navbar"
// import ParticlesBackground from"./Components/ParticlesBackground";
// import About from "./sections/About";
// import Contect from "./sections/Contect";
// import Experiences from "./sections/Experiences";
// import Footer from "./sections/Footer";
// import Home from "./sections/Home";
// // import Ui from "../ui/App";
// import Project from "./sections/Project";
// import Skills from "./sections/Skills";
// import Testimonials from "./sections/Testimonials";
// // add from hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
// import { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import CertificateUploader from "./Gov/CertificateUploader";
// import CertificateVerifier from "./Student/CertificateVerifier";
// import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
// import OrgForm from "./Gov/OrgForm";
// // import About from "./sections/About"; 
//   // import VerifyCertificate from "./components/VerifyCertificate";
// // import CertificateUploader from "./components/CertificateUploader";
// // import { BrowserRouter as Router, Routes, Route } from "react-router-dom";



// // import Certificate from "../srcc/componentss/Certificate";

// export default function App(){
//    const [account, setAccount] = useState("");

//   useEffect(() => {
//     const connectWallet = async () => {
//       if (window.ethereum) {
//         try {
//           // Request account access from MetaMask
//           const accounts = await window.ethereum.request({ method: "eth_requestAccounts" });
//           setAccount(accounts[0]);

//           // Connect to Ganache local blockchain
//           const provider = new ethers.BrowserProvider(window.ethereum);
//           const network = await provider.getNetwork();
//           console.log("Connected to network:", network);

//         } catch (error) {
//           console.error("Connection error:", error);
//         }
//       } else {
//         alert("Please install MetaMask!");
//       }
//     };

//     connectWallet();
//   }, []);
//   // end from hereeeeeeeeeeeeeeeeeeeeeeeee

// // function App() {
// //   return (
// //     <Router>
// //       <Routes>
// //         <Route path="/" element={<CertificateUploader />} />
// //         <Route path="/verify" element={<VerifyCertificate />} />
// //       </Routes>
// //     </Router>
// //   );
// // }

// // export default App;


//   return(
//     <div className="relative gradient">
//       <Router> 
//         <Navbar/>
      
//       <Routers>
//          <Route path="/" element={<Home />} />
//         <Route path="/OrgForm" element={<OrgForm />} />
//         {/* <OrgForm/> */}
//        {/* <Certificate/> */}
//        {/* <CertificateUploader/> */}
//        {/* <CertificateVerifier/>
//        <VerificationFlowUI/> */}
//        {/* <Ui/> */}
//        {/* <Customcursor/> */}
//        {/* <ParticlesBackground/> */}
//        <Home/>
//        {/* <About/>
//        <Skills/>
//        <Project/>
//        <Experiences/>
//        <Testimonials/>
//        <Contect/> */}
//       </Routers>
//       <Footer/> 
//       </Router>
     
// {/* add from hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee */}
//         <div className="p-4">
//       <h1>Connected Account:</h1>
//       <p>{account || "Not connected"}</p>
//     </div>
//      {/* <Router>
//       <Routes>
//         <Route path="/" element={<Home />} />
//         <Route path="/OrgForm" element={<OrgForm />} />
//       </Routes>
//     </Router> */}
//    </div>
// // end from hereeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeeee
   
//   );
// }

// import { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
// import Customcursor from "./Components/Customcursor";
// import Navbar from "./Components/Navbar";
// import ParticlesBackground from "./Components/ParticlesBackground";
// import About from "./sections/About";
// import Contect from "./sections/Contect";
// import Experiences from "./sections/Experiences";
// import Footer from "./sections/Footer";
// import Home from "./sections/Home";
// import Project from "./sections/Project";
// import Skills from "./sections/Skills";
// import Testimonials from "./sections/Testimonials";

// import OrgForm from "./Gov/OrgForm";
// import CertificateUploader from "./Gov/CertificateUploader";
// import CertificateVerifier from "./Student/CertificateVerifier";
// import VerificationFlowUI from "./Gov/verify";

// export default function App() {
//   const [account, setAccount] = useState("");

//   useEffect(() => {
//     const connectWallet = async () => {
//       if (window.ethereum) {
//         try {
//           const accounts = await window.ethereum.request({
//             method: "eth_requestAccounts",
//           });
//           setAccount(accounts[0]);

//           // Connect to local blockchain (Ganache)
//           const provider = new ethers.BrowserProvider(window.ethereum);
//           const network = await provider.getNetwork();
//           console.log("Connected to network:", network);
//         } catch (error) {
//           console.error("Connection error:", error);
//         }
//       } else {
//         alert("Please install MetaMask!");
//       }
//     };

//     connectWallet();
//   }, []);

//   return (
//     <Router>
//       <div className="relative gradient">
//         {/* Global Components */}
//         <Navbar />
//         <Customcursor />
//         <ParticlesBackground />

//         {/* Routing Setup */}
//          <main className="relative z-10 pt-16 pb-10">
//           <Routes>
//           <Route path="/" element={<Home />} />
//           <Route path="/OrgForm" element={<OrgForm />} />
//           <Route path="/upload" element={<CertificateUploader />} />
//           <Route path="/verify" element={<CertificateVerifier />} />
//           <Route path="/flow" element={<VerificationFlowUI />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/skills" element={<Skills />} />
//           <Route path="/projects" element={<Project />} />
//           <Route path="/experience" element={<Experiences />} />
//           <Route path="/testimonials" element={<Testimonials />} />
//           <Route path="/contact" element={<Contect />} />
//         </Routes>
//         </main>
//         <Footer />
//         </div>
//         {/* Wallet Info */}
//        <div className="p-4 text-center z-10 relative">
//       <h2 className="text-lg font-semibold">Connected Account:</h2>
//       <p className="text-green-400">{account || "Not connected"}</p>
//     </div>
//     </Router>
//   );
// }


// import { useEffect, useState } from "react";
// import { ethers } from "ethers";
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Customcursor from "./Components/Customcursor";
// import Navbar from "./Components/Navbar";
// import ParticlesBackground from "./Components/ParticlesBackground";
// import About from "./sections/About";
// import Contect from "./sections/Contect";
// import Experiences from "./sections/Experiences";
// import Footer from "./sections/Footer";
// import Home from "./sections/Home";
// import Project from "./sections/Project";
// import Skills from "./sections/Skills";
// import Testimonials from "./sections/Testimonials";
// import VerifyProvider from "./context/VerifyContext";
// import OrgForm from "./Gov/OrgForm";
// import CertificateUploader from "./Gov/CertificateUploader";
// import CertificateVerifier from "./Student/CertificateVerifier";
// import VerificationFlowUI from "./Gov/verify";

// export default function App() {
//   const [account, setAccount] = useState("");

//   return (
//     <Router>
//       <div className="relative gradient">
//         {/* Global Components */}
//         <Navbar />
//         <Customcursor />
//         <ParticlesBackground />

//         {/* Routing Setup */}
//         <Routes>
//           <VerifyProvider>
//           {/* tumhare routes / pages yahan honge */}
//           </VerifyProvider>
//           <Route path="/" element={<Home />} />
//           <Route path="/OrgForm" element={<OrgForm />} />
//           <Route path="/upload" element={<CertificateUploader />} />
//           <Route path="/verify" element={<CertificateVerifier />} />
//           <Route path="/register-org" element={<OrgRegistration />} />
//           <Route path="/admin" element={<AdminDashboard />} />
//           <Route path="/org-upload" element={<OrgUpload />} />
//           <Route path="/flow" element={<VerificationFlowUI />} />
//           <Route path="/about" element={<About />} />
//           <Route path="/skills" element={<Skills />} />
//           <Route path="/projects" element={<Project />} />
//           <Route path="/experience" element={<Experiences />} />
//           <Route path="/testimonials" element={<Testimonials />} />
//           <Route path="/contact" element={<Contect />} />
//         </Routes>
//         {/* <Footer /> */}
//         <div className="text-center">
//         </div>
//       </div>
//     </Router>
//   );
// }
// import { BrowserRouter as Router, Routes, Route } from "react-router-dom";

// import Customcursor from "./Components/Customcursor";
// import Navbar from "./Components/Navbar";
// import ParticlesBackground from "./Components/ParticlesBackground";

// import About from "./sections/About";
// import Contect from "./sections/Contect";
// import Experiences from "./sections/Experiences";
// import Home from "./sections/Home";
// import Project from "./sections/Project";
// import Skills from "./sections/Skills";
// import Testimonials from "./sections/Testimonials";

// import {VerifyProvider} from "./context/VerifyContext";

// import OrgForm from "./Gov/OrgForm";
// import CertificateUploader from "./Gov/CertificateUploader";
// import CertificateVerifier from "./Student/CertificateVerifier";
// import VerificationFlowUI from "./Gov/verify";

// import OrgRequest from "./Gov/OrgRequest";
// import AdminVerifyPage from "./Gov/AdminVerifyPage";

// export default function App() {
//   return (
//     <VerifyProvider>
//            <CertificateUploader />
//       <Router>
//         <div className="relative gradient">
//           {/* Global Components */}
//           <Navbar />
//           <Customcursor />
//           <ParticlesBackground />

//           <Routes>
//             {/* Home pages */}
//             <Route path="/" element={<Home />} />
//             <Route path="/about" element={<About />} />
//             <Route path="/skills" element={<Skills />} />
//             <Route path="/projects" element={<Project />} />
//             <Route path="/experience" element={<Experiences />} />
//             <Route path="/testimonials" element={<Testimonials />} />
//             <Route path="/contact" element={<Contect />} />

//             {/* Govt Flow */}
//             <Route path="/request" element={<OrgRequest />} />
//             <Route path="/gov-verify" element={<AdminVerifyPage />} />

//             {/* Certificate Flow */}
//             <Route path="/OrgForm" element={<OrgForm />} />
//             <Route path="/upload" element={<CertificateUploader />} />
//             <Route path="/verify" element={<CertificateVerifier />} />
//             <Route path="/flow" element={<VerificationFlowUI />} />
//           </Routes>
//         </div>
//       </Router>
//     </VerifyProvider>
//   );
// }
import { BrowserRouter as Router, Routes, Route } from "react-router-dom";
import Customcursor from "./Components/Customcursor";
import Navbar from "./Components/Navbar";
import ParticlesBackground from "./Components/ParticlesBackground";
import About from "./sections/About";
import Contect from "./sections/Contect";
import Experiences from "./sections/Experiences";
import Home from "./sections/Home";
import Project from "./sections/Project";
import Skills from "./sections/Skills";
import Testimonials from "./sections/Testimonials";
import { VerifyProvider} from "./context/VerifyContext";
import OrgForm from "./Gov/OrgForm";
import ReactDOM from "react-dom/client";
// import CertificateUploader from "./Gov/CertificateUploader";
import CertificateVerifier from "./Student/CertificateVerifier";
// import VerificationFlowUI from "./Gov/verify";
// import OrgRequest from "./Gov/GovDashboard";
// import AdminVerifyPage from "./Gov/AdminVerifyPage";
import { getWeb3Contract } from "./web3Config";
import GovDashboard from "./Gov/GovDashboard";
import AffiliationForm from "./AffiliationForm";
import AdminDashboard from "./Components/AdminDashboard";
import StudentPage from "./Gov/StudentPage";

export default function App() {
  return (
    <VerifyProvider>
      <Router>
        <div className="relative gradient">
          {/* Global Components */}
          <Navbar />
          <Customcursor />
          {/* <ParticlesBackground /> */}
          <AdminDashboard/>
          <AffiliationForm />
          <Routes>
            {/* Home pages  */}
            <Route path="/" element={<Home />} />
            <Route path="/about" element={<About />} />
            <Route path="/skills" element={<Skills />} />
            <Route path="/projects" element={<Project />} />
            <Route path="/experience" element={<Experiences />} />
            <Route path="/testimonials" element={<Testimonials />} />
            <Route path="/contact" element={<Contect />} />
            <Route path="/adminDashboard" element={<AdminDashboard />} />
            {/* Govt Flow */}
            {/* <Route path="/request" element={<OrgRequest />} /> */}
            {/* <Route path="/gov-verify" element={<AdminVerifyPage />} /> */}
            <Route path="/OrgForm" element={<OrgForm />} />
            <Route path="/studentPage" element={<StudentPage />} />
            {/* Certificate Flow */}
            {/* <Route path="/OrgForm" element={<OrgForm />} /> */}
            {/* <Route path="/upload" element={<CertificateUploader />} /> */}
            {/* <Route path="/verify" element={<CertificateVerifier />} /> */}
            {/* <Route path="/flow" element={<VerificationFlowUI />} /> */}
            </Routes>
            {/* <div style={{padding:20}}>
             <h1>Gov Verification Demo</h1>
             <div style={{display:"grid", gridTemplateColumns:"1fr 1fr", gap:20}}>
             <div style={{border:"1px solid #ddd", padding:10}}> */}
             <OrgForm />
             {/* </div>
             <div style={{border:"1px solid #ddd", padding:10}}> */}
             {/* <GovDashboard /> */}
             {/* </div>
            </div>
          </div> */}
        </div>
      </Router>
    </VerifyProvider>
  );
}
