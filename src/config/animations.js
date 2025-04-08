import { m, domAnimation, LazyMotion, AnimatePresence } from "framer-motion";

// Базовые настройки для всех анимаций
const baseTransition = {
  type: "spring",
  damping: 20,
  stiffness: 300,
  duration: 0.3
};

export const slideUpVariant = {
  hidden: { opacity: 0, y: 20 },
  visible: { 
    opacity: 1, 
    y: 0,
    transition: {
      ...baseTransition,
      staggerChildren: 0.1
    }
  }
};

export const fadeInVariant = {
  hidden: { opacity: 0 },
  visible: { 
    opacity: 1,
    transition: {
      ...baseTransition,
      type: "tween"
    }
  }
};

export const scaleUpVariant = {
  hidden: { opacity: 0, scale: 0.95 },
  visible: { 
    opacity: 1, 
    scale: 1,
    transition: {
      ...baseTransition,
      mass: 0.5
    }
  }
};

export { m, AnimatePresence };

// Оптимизированный провайдер анимаций с поддержкой reducedMotion
export const AnimationProvider = ({ children }) => (
  <LazyMotion features={domAnimation} strict>
    {children}
  </LazyMotion>
);