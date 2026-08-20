import { useEffect, useMemo, useState,useRef } from "react"
import img1 from "../Assets/img1.JPG"
import img2 from "../Assets/img2.JPG"
import img3 from "../Assets/img3.JPG"
import photo1 from "../Assets/img1.JPG"
import photo2 from "../Assets/photo2.PNG"
import photo3 from "../Assets/photo3.png"
const useIsMobile= (query= "(max-width:639px)")=>{
  const[isMobile,setIsMobile]=useState(
    typeof window !== "undefined" && window.matchMedia(query).matches
  );
  useEffect(()=>{
    if(typeof window==="undefined") return;
    const mql=window.matchMedia(query);
    const handler=(e)=>setIsMobile(e.matches);
    mql.addEventListener("change", handler);
    setIsMobile(mql.matches);
    return()=>mql.removeEventListener("change",handler);
  },[query]);
  return isMobile;
};

export default function Project(){
  const isMobile=useIsMobile();
  const sceneRef=useRef(null);

  const Project=useMemo(()=>[
  {
    title: "nk studio",
    link: "http://www.nk.studio/",
    bgColor: "#0d4d3d",
    image: isMobile ? photo1 : img1,  //use mobile or desktop image
  },
  {
    title: "Gamily",
    link: "http://www.Gamily.com/",
    bgColor:"#dc9317",
    image: isMobile ? photo2:img2,
  },
   {
    title: "Hungry Tiger",
    link: "http://www.eathungrytiger.com/",
    bgColor :"#3884d3",
    image:  isMobile ? photo3:img3,
   },
],
  [isMobile]    //re-run only when 'isMobile' changes
);
  return (
  <section
    id="projects"
    ref={sceneRef} className="relative text-white p-8 bg-black"
  >
    <div className="max-w-7xl mx-auto grid sm:grid-cols-2 lg:grid-cols-3 gap-8">
      {Project.map((p, i) => (
        <a
          key={i}
          href={p.link}
          target="_blank"
          rel="noopener noreferrer"
          className="block rounded-xl overflow-hidden shadow-lg transform transition-transform hover:scale-105"
          style={{ backgroundColor: p.bgColor }}
        >
          <img
            src={p.image}
            alt={p.title}
            className="w-full h-64 object-cover"
          />
          <div className="p-4">
            <h3 className="text-xl font-semibold">{p.title}</h3>
          </div>
        </a>
      ))}
    </div>
  </section>
);
}