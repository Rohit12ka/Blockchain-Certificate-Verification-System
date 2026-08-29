
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
