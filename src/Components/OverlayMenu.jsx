import {motion,AnimatePresence} from "framer-motion"
import { FiX } from "react-icons/fi";
export default function OverlayMenu({isOpen,onClose}){
  const isMobile=typeof window !=="undefined"&& window.innerWidth<1024;
  const Origin=isMobile ?"95% 8%":"50% 8%"
  return(
    <AnimatePresence>
      {isOpen &&(
          <motion.div className="fixed inset-0 flex items-center justify-center bg-black bg-opacity-80 z-50">
          <button onClick={onClose}
           className="absolute top-6 right-6 text-white text-3xl"
            aria-label="Close Menu">
            <FiX />
          </button>
          <ul className="space-y-6 text-center">
            {[
              "Home",
              "About",
              "Skills",
              "Verification",
              "Logout",
              "Contact",
            ].map((item,index)=>(
              <motion.li key={item}
              initial={{opacity:0,y:20}}
              animate={{opacity: 1,y:0}}
              transition={{delay:0.3+index*0.1}}>
                <a href={'#${item.toLowerCase()}'}
                onClick={onClose}
                   className="text-4xl text-white font-semibold hover:text-pink-400 transition-colors duration-300">
                  {item}
                </a>
              </motion.li>
            )
            )}
          </ul>
        </motion.div>
      )}
    </AnimatePresence>
  );
}