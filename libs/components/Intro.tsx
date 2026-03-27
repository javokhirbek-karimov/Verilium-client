"use client";
import { useEffect, useState } from "react";
import { motion, AnimatePresence } from "framer-motion";

interface IntroProps {
  onFinish: () => void;
}

const Intro = ({ onFinish }: IntroProps) => {
  const [phase, setPhase] = useState<"enter" | "fly" | "done">("enter");

  useEffect(() => {
    const t1 = setTimeout(() => setPhase("fly"), 1800);
    const t2 = setTimeout(() => {
      setPhase("done");
      onFinish();
    }, 3000);
    return () => {
      clearTimeout(t1);
      clearTimeout(t2);
    };
  }, [onFinish]);

  return (
    <AnimatePresence>
      {phase !== "done" && (
        <motion.div
          style={{
            position: "fixed",
            inset: 0,
            zIndex: 9999,
            display: "flex",
            alignItems: "center",
            justifyContent: "center",
            background: "#0B0B0B",
            pointerEvents: "none",
          }}
          animate={{ opacity: phase === "fly" ? 0 : 1 }}
          transition={{
            opacity: {
              duration: 0.6,
              delay: phase === "fly" ? 0.8 : 0,
            },
          }}
        >
          <motion.div
            style={{
              position: "absolute",
              inset: 0,
              background:
                "radial-gradient(ellipse 55% 45% at 50% 50%, rgba(212,175,55,0.1) 0%, transparent 70%)",
              pointerEvents: "none",
            }}
            animate={{ opacity: phase === "fly" ? 0 : 1 }}
            transition={{ duration: 0.3 }}
          />

          <motion.img
            src="/img/logo/logo.png"
            alt="Verilium"
            style={{
              position: "absolute",
              height: "130px",
              objectFit: "contain",
            }}
            initial={{ opacity: 0, x: 0, y: 0 }}
            animate={
              phase === "enter"
                ? { opacity: 1, x: 0, y: 0 }
                : phase === "fly"
                ? {
                    opacity: 1,
                    x: "calc(-50vw + 210px)",
                    y: "calc(-50vh + 44px)",
                  }
                : { opacity: 1 }
            }
            transition={
              phase === "enter"
                ? { duration: 1.0, ease: [0.22, 1, 0.36, 1] }
                : { duration: 0.8, ease: [0.4, 0, 0.2, 1] }
            }
          />

          <motion.p
            style={{
              position: "absolute",
              top: "calc(50% + 80px)",
              left: "50%",
              transform: "translateX(-50%)",
              fontFamily: "Nunito, sans-serif",
              fontSize: "12px",
              fontStyle: "italic",
              letterSpacing: "6px",
              textTransform: "uppercase",
              color: "rgba(212, 175, 55, 0.65)",
              whiteSpace: "nowrap",
              margin: 0,
            }}
            initial={{ opacity: 0, y: 8 }}
            animate={{
              opacity: phase === "enter" ? 1 : 0,
              y: phase === "enter" ? 0 : -10,
            }}
            transition={{
              duration: phase === "enter" ? 0.6 : 0.5,
              delay: phase === "enter" ? 0.5 : 0,
              ease: "easeInOut",
            }}
          >
            The Art of Scent
          </motion.p>
        </motion.div>
      )}
    </AnimatePresence>
  );
};

export default Intro;
