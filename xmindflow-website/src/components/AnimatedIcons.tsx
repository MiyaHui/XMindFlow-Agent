import { motion, useAnimation } from "framer-motion";
import { 
  Brain, 
  Upload, 
  Check, 
  FileText, 
  Palette, 
  Tags, 
  Settings,
  Loader2
} from "lucide-react";

interface IconButtonProps {
  className?: string;
  size?: number;
  animate?: boolean;
}

// Icons start here

export const BrainIcon = ({ className, size = 24, animate }: IconButtonProps) => {
  const controls = useAnimation();
  
  return (
    <motion.div
      className={className}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
      animate={animate ? "animate" : controls}
      initial="normal"
      variants={{
        normal: { scale: 1, rotate: 0 },
        animate: { 
          scale: [1, 1.1, 1],
          rotate: [0, -5, 5, -5, 0],
          transition: { 
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }
      }}
    >
      <Brain size={size} />
    </motion.div>
  );
};

export const UploadIcon = ({ className, size = 24 }: IconButtonProps) => {
  const controls = useAnimation();
  
  return (
    <motion.div
      className={className}
      onMouseEnter={() => controls.start("animate")}
      onMouseLeave={() => controls.start("normal")}
      animate={controls}
      initial="normal"
      variants={{
        normal: { y: 0 },
        animate: { 
          y: [0, -4, 0],
          transition: { 
            duration: 1.5,
            repeat: Infinity,
            ease: "easeInOut"
          }
        }
      }}
    >
      <Upload size={size} />
    </motion.div>
  );
};

export const CheckIcon = ({ className, size = 24 }: IconButtonProps) => (
  <motion.div
    className={className}
    initial={{ scale: 0, rotate: -45 }}
    animate={{ scale: 1, rotate: 0 }}
    transition={{ type: "spring", stiffness: 300, damping: 20 }}
  >
    <Check size={size} />
  </motion.div>
);

export const FileIcon = ({ className, size = 24, animate }: IconButtonProps) => (
  <motion.div
    className={className}
    animate={animate ? { y: [0, -3, 0] } : {}}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <FileText size={size} />
  </motion.div>
);

export const PaintbrushIcon = ({ className, size = 24, animate }: IconButtonProps) => (
  <motion.div
    className={className}
    animate={animate ? { rotate: [0, 15, -15, 0] } : {}}
    transition={{ duration: 1.5, repeat: Infinity }}
  >
    <Palette size={size} />
  </motion.div>
);

export const TagIcon = ({ className, size = 24, animate }: IconButtonProps) => (
  <motion.div
    className={className}
    animate={animate ? { scale: [1, 1.1, 1] } : {}}
    transition={{ duration: 2, repeat: Infinity }}
  >
    <Tags size={size} />
  </motion.div>
);

export const SettingsIcon = ({ className, size = 24 }: IconButtonProps) => (
  <motion.div
    className={className}
    whileHover={{ rotate: 90 }}
    transition={{ type: "spring", stiffness: 200 }}
  >
    <Settings size={size} />
  </motion.div>
);

export const LoadingIcon = ({ className, size = 24 }: IconButtonProps) => (
  <motion.div
    className={className}
    animate={{ rotate: 360 }}
    transition={{ duration: 1, repeat: Infinity, ease: "linear" }}
  >
    <Loader2 size={size} />
  </motion.div>
);

export const StepIcon = ({ icon: Icon, active, complete }: { icon: any, active?: boolean, complete?: boolean }) => {
  return (
    <div className={`w-12 h-12 rounded-full flex items-center justify-center transition-all duration-500 ${
      complete ? 'bg-indigo-500 text-white shadow-lg shadow-indigo-500/30' : 
      active ? 'bg-white/10 text-indigo-400 border border-indigo-500/50 shadow-lg shadow-indigo-500/10' : 
      'bg-white/5 text-slate-500 border border-white/5'
    }`}>
      {complete ? (
        <CheckIcon size={24} />
      ) : (
        <motion.div
          animate={active ? { scale: [1, 1.1, 1] } : {}}
          transition={{ duration: 2, repeat: Infinity }}
        >
          <Icon size={24} className={active ? "animate-pulse" : ""} />
        </motion.div>
      )}
    </div>
  );
};
