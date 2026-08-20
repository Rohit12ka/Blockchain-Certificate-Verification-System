import React, { useMemo,useState,useEffect } from "react";
import ParticlesBackground from "../Components/ParticlesBackground";
import {hover, motion} from "framer-motion";
import avator from "../Assets/avator.png";
import { useNavigate, Link } from "react-router-dom";

import{FaGithub,FaLinkedin,FaXTwitter} from "react-icons/fa6";

const socials= [
  {Icon:FaXTwitter,label:"X",href:"https://x.com/rohitk12ka"},
  {Icon:FaLinkedin,label:"Linkdin",href:" https://www.linkedin.com/in/rohit-kumar-5309b022a/"},
  {Icon:FaGithub,label:"Github",href: "https://github.com/Rohit12ka"},
]
const glowVarients={initial:{scale:1,y:0,filter:"drop-shadow(0 0 0 rgba(0,0,0,0))"},
hover:{scale:1.2,y:-3,
  filter:"drop-shadow(0 0 8px rgba(13,88,204,0.9)) drop-shadow(0 0 18px rgba(16,185,129,0.8))",
  transition:{type:"spring",stiffness:300,damping:15}
},
tap:{scale:0.95,y:0,transition:{duration:0.08}},
};
export default function Home(){
  const navigate = useNavigate(); // navigation ke liye
  const roles=useMemo(()=>["Welcome", "Certificate Verification"],[])
  const [index,setIndex]=React.useState(0);
  const [subIndex,setSubIndex]=React.useState(0);
  const [deleting,setDeleting]=React.useState(false);
  React.useEffect(()=>{
    const current=roles[index];
    const timeout=setTimeout(()=>{
      if(!deleting && subIndex < current.length)setSubIndex(v=>v+1);
      else if(!deleting && subIndex === current.length)setTimeout(()=>setDeleting(true),1200);
      else if(deleting && subIndex>0)setSubIndex(v=>v-1);
      else if(deleting && subIndex ===0){setDeleting(false);setIndex(p=>(p+1)% roles.length);}
    },deleting ? 40:60)
    return()=>clearTimeout(timeout);
  },[subIndex,index,deleting,roles])
  return(
    
    <section id="home" className="w-full h-screen relative bg-black overflow-hidden">
      <ParticlesBackground/>
      <div className="absolute inset-0">
      <div className="absolute -top-32 -left-32
      w-[70vw] sm:w-[z-500vw] md:w-[40vw]
      h-[70vw] sm:h-[50vw] md:h-[40vw]
      max-w-[500px] max-h-[500px]
      rounded-full
      bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2]
      opacity-30 sm:opacity-20 md:opacity-10
      blur-[100px] sm:blur-[130px] md:blur-[150px]
      animate-pulse "></div>
        <div className="absolute bottom-0 -right-0
      w-[70vw] sm:w-[50vw] md:w-[40vw]
      h-[70vw] sm:h-[50vw] md:h-[40vw]
      max-w-[500px] max-h-[500px]
      rounded-full
       bg-gradient-to-r from-[#302b63] via-[#00bf8f] to-[#1cd8d2]
      opacity-30 sm:opacity-20 md:opacity-10
      blur-[100px] sm:blur-[130px] md:blur-[150px]
      animate-pulse delay-500 "></div>
      
      </div>
      <div className="relative z-10 h-full max-w-7xl mx-auto px-4 grid -grid-cols-1 lg:grid-cols-2">
        <div className="flex flex-col justify-center h-full text-center lg:text-left relative">
          <div className="w-full lg:pr-24 mx-auto max-w-[48rem]">
            <motion.div className="mb-3 text-xl sm:text-2xl md:text-3xl lg:text-4xl font-semibold text-white tracking-wide min-h-[1.6em]"
            initial={{opacity:0,y:12}}
            animate={{opacity:1,y:0}}
            transition={{duration:0.6}}>
             <span>
               {roles[index].substring(0,subIndex)}
             </span>
             <span className="inline-block w-[2px] ml-1 bg-white animate-pulse align-middle"
             style={{height:"1em"}}></span>
            </motion.div>
            <motion.h4
              className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl font-bold 
              text-transparent bg-clip-text 
              bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63] 
              drop-shadow-lg"
              initial={{opacity:0,y:40}}
              animate={{opacity:1,y:0}}
              transition={{duration:1}}
               >
               Hello I,m <br />
              <span className="text-white font-bold text-3xl sm:text-4xl md:text-5xl lg:text-6xl lg:whitespace-nowrap">
              Blockchain Agent
               </span>
               </motion.h4>
               <motion.p className="mt-6 text-base sm:text-lg md:text-xl text-gray-300 max-w-2xl mx-auto lg:mx-0" 
                initial={{opacity:0,y:20}}
                animate={{opacity:1,y:0}}
                transition={{delay:0.4, duration:0.8}}
               >
                This is Decentralized website ,here you can verified certificate to the BLockchain and also upload on Blockchain .
               </motion.p>
               <motion.div className="mt-10 flex flex-wrap items-center justify-center lg:justify-start gap-6"
                 initial={{opacity:0}}
                 animate={{opacity:1}}
                 transition={{delay:0.8, duration:0.8}}
                >
                {/* <a href="#projects"
                className="px-6 py-3 rounded-full font-medium text-lg text-white bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63]
                shadow-lg hover:scale-105 transition-all"
                >Upload Certificate</a> */} 
                <button
                 onClick={() => navigate("/OrgForm")}
                 className="px-6 py-3 rounded-full font-medium text-lg text-white bg-gradient-to-r from-[#1cd8d2] via-[#00bf8f] to-[#302b63]
                 shadow-lg hover:scale-105 transition-all"
                >
                 Upload Certificate
                </button>

                <a href="/Resume.pdf"download className="px-6 py-3 rounded-full text-lg font-medium text-black bg-white hover:bg-gray-200 shadow-lg hover:scale-105 transition-all"> My Certificate</a>
               </motion.div>
               <div className="mt-10 flex gap-5 text-2xl md:text-3xl justify-center lg:justify-start">
                {socials.map(({Icon,label,href})=>(
                  <motion.a
                  href={href}
                  key={label} 
                  target="_blank"
                  aria-label={label}
                  rel="noopener noreferrer"
                  variants={glowVarients}
                  initial="initial"
                  whileHover="hover"
                  whileTap="tap"
                  className="text-gray-300"
                  > 
                  <Icon/>
                  </motion.a>
                ))}
               </div>
          </div>
        </div>
        <div >
          <motion.img
           src={avator}alt="Rohit"
           className="hidden md:block object-contain select-none pointer-events-none w-[80vw] max-w-[700px] drop-shadow-[0_0_20px_rgba(28,216,210,0.4)]"
           style={{right:"-30px",width:"min(45vw,780px)", maxHeight:"90vh"}}
           initial={{opacity:0,y:40,scale:0.98}}
           animate={{opacity:1,y:0,scale:1}}
           transition={{delay:0.2, duration:0.8}}
           />
        </div>
       {/* start of new code */}
          <div className="p-8">
      <h1 className="text-2xl font-bold">Certificate Registry Demo</h1>
      <div className="mt-6 space-y-2">
        <Link to="/register-org" className="text-blue-600">Register Organization</Link><br/>
        <Link to="/admin" className="text-blue-600">Admin Dashboard</Link><br/>
        <Link to="/org-upload" className="text-blue-600">Organization Upload (after approval)</Link><br/>
        <Link to="/verify" className="text-blue-600">Verify Certificate</Link>
      </div>
    </div>
    {/* end of new code */} 

      </div>
    </section>
  )
}