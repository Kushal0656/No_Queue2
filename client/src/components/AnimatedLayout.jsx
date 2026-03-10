import { Outlet, useLocation } from 'react-router-dom';
import { AnimatePresence, motion } from 'framer-motion';

const pageVariants = {
  initial: { opacity: 0, y: 10 },
  in: { opacity: 1, y: 0 },
  out: { opacity: 0, y: -10 }
};

const pageTransition = {
  type: 'tween',
  ease: 'anticipate',
  duration: 0.4
};

export default function AnimatedLayout() {
  const location = useLocation();
  
  return (
    <AnimatePresence mode="wait">
      <motion.div
        key={location.pathname}
        initial="initial"
        animate="in"
        exit="out"
        variants={pageVariants}
        transition={pageTransition}
        style={{ flex: 1, display: 'flex', flexDirection: 'column' }}
      >
        <Outlet />
      </motion.div>
    </AnimatePresence>
  );
}
