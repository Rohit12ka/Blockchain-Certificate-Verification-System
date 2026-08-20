// import { useEffect,useState,useRef } from "react";
// import OverlayMenu from "./OverlayMenu";
// import Logo from "../Assets/Logo.png";
// import { FiMenu } from "react-icons/fi";
// // import { Link, useLocation } from "react-router-dom";
// export default function Navbar(){
//   const [menuopen,setMenuopen]=useState(false);
//   const[visible,setVisible]=useState(true);
//   const [forceVisible,setForceVisible]=useState(false);
//   const lastScrollY = useRef(0);
//   const timerId = useRef(null);
//   useEffect(()=>{
//     const homeSection=document.querySelector("#home");
//     const observer=new IntersectionObserver(
//       ([entry])=>{
//         if(entry.isIntersecting){
//           setForceVisible(true);
//           setVisible(true);
//         }
//         else{
//           setForceVisible(false);
//         }
//       },{threshold :0.1}
//     );
//     if(homeSection)observer.observe(homeSection);
//     return()=>{
//       if(homeSection)observer.unobserve(homeSection);
//     };
//   },[]);
//   useEffect(()=>{
//     const handleScrollY=()=>{
//       if(forceVisible){
//         setVisible(true);
//         return;
//       }
//       const currentScrollY=window.scrollY;
//       if(currentScrollY>lastScrollY.current){
//         setVisible(false);
//       }
//       else{
//         setVisible(true);
//         if(timerId.current)clearTimeout(timerId.current);
//         timerId.current=setTimeout(()=>{
//           setVisible(false);
//         },3000);
//       }
//       lastScrollY.current=currentScrollY;
//     };
//     window.addEventListener("scroll",handleScrollY,{passive:true});
//     return()=>{
//     window.removeEventListener("scroll",handleScrollY)
//     if(timerId.current)clearTimeout(timerId.current);
//     };
//   },[ ] );

//   return(
//     <>
//     <nav className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-50 transition-transform duration-300 ${visible?"translate-y-0":"-translate-y-full"}`}>
//     <div className="flex items-center space-x-2">
//       <img src={Logo} alt="logo"className="w-8 h-8"/>
//       <div className="text-2xl font-bold text-white hidden sm:block">
//         V.Certificate
//       </div>
//     </div>
//     <div className="block lg:absolute lg:left-1/2 lg:transform lg:-translate-x-1/2 ">
      
//     <button onClick={()=>setMenuopen(true)}
//       className="#FFFFFF text-3xl focus:outline-none"
//       aria-label="open Menu">
//       <FiMenu className="text-white text-3xl" />

//     </button>
//     </div>
//     <div className="hidden lg:block">
//       <a href="#contact"
//       className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-5 py-2 rounded-full font-medium shadow-lg hover:opacity-90 transition-opacity duration-300"
//       >
//         Reach Out
//       </a>
//     </div>
//     </nav>
//     <OverlayMenu isOpen ={menuopen} onClose={()=>setMenuopen(false)}/>
//     </>
//   );

import { useEffect, useState, useRef } from "react";
import OverlayMenu from "./OverlayMenu";
import Logo from "../Assets/Logo.png";
import { FiMenu } from "react-icons/fi";
import { useLocation } from "react-router-dom";

export default function Navbar() {
  const location = useLocation();

  // ❗ Hooks ALWAYS top-level
  const [menuopen, setMenuopen] = useState(false);
  const [visible, setVisible] = useState(true);
  const [forceVisible, setForceVisible] = useState(false);

  const lastScrollY = useRef(0);
  const timerId = useRef(null);

  // ⭐ Route check (NO hooks inside condition)
  const hideNavbar = location.pathname === "/OrgForm";

  useEffect(() => {
    const homeSection = document.querySelector("#home");

    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setForceVisible(true);
          setVisible(true);
        } else {
          setForceVisible(false);
        }
      },
      { threshold: 0.1 }
    );

    if (homeSection) observer.observe(homeSection);

    return () => {
      if (homeSection) observer.unobserve(homeSection);
    };
  }, []);

  useEffect(() => {
    const handleScroll = () => {
      if (hideNavbar) return; // ⭐ OrgForm page par scroll logic off

      if (forceVisible) {
        setVisible(true);
        return;
      }

      const current = window.scrollY;

      if (current > lastScrollY.current) {
        setVisible(false);
      } else {
        setVisible(true);

        if (timerId.current) clearTimeout(timerId.current);
        timerId.current = setTimeout(() => setVisible(false), 3000);
      }

      lastScrollY.current = current;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    return () => {
      window.removeEventListener("scroll", handleScroll);
      if (timerId.current) clearTimeout(timerId.current);
    };
  }, [forceVisible, hideNavbar]);

  // ⛔ After hooks → Safe conditional return
  if (hideNavbar) return null;

  return (
    <>
      <nav
        className={`fixed top-0 left-0 w-full flex items-center justify-between px-6 py-4 z-50 transition-transform duration-300 ${
          visible ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        {/* Logo */}
        <div className="flex items-center space-x-2">
          <img src={Logo} alt="logo" className="w-8 h-8" />
          <div className="text-2xl font-bold text-white hidden sm:block">
            V.Certificate
          </div>
        </div>

        {/* Menu Button */}
        <button
          onClick={() => setMenuopen(true)}
          className="text-3xl focus:outline-none"
        >
          <FiMenu className="text-white text-3xl" />
        </button>

        {/* Contact Button */}
        <div className="hidden lg:block">
          <a
            href="#contact"
            className="bg-gradient-to-r from-pink-500 to-blue-500 text-white px-5 py-2 rounded-full shadow-lg hover:opacity-90"
          >
            Reach Out
          </a>
        </div>
      </nav>

      <OverlayMenu isOpen={menuopen} onClose={() => setMenuopen(false)} />
    </>
  );
}
