import { AnimatePresence,  motion } from "framer-motion";
function AnimationWrapper({
  children,
  initial = { opacity: 0 },
  animate = { opacity: 1 },
  transition = { duration: .5 },
  keyValue,
  className,
}: {
    children: React.ReactNode,
    keyValue: React.Key,
    animate?: object,
    initial?: object,
    transition?: object,
    className?: string

}) {
  return (
    <AnimatePresence>
      <motion.div
        key={keyValue}
        initial={initial}
        animate={animate}
        transition={transition}
        className={className}
      >
        {children}
      </motion.div>
    </AnimatePresence>
  );
}

export default AnimationWrapper;
