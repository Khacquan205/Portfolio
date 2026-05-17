import { motion, useInView, useScroll, useTransform } from "motion/react";
import { useRef } from "react";

export const WordsPullUp = ({ text, className, showAsterisk }: { text: string; className?: string; showAsterisk?: boolean }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    const words = text.split(" ");
    
    return (
        <div ref={ref} className={`flex flex-wrap ${className || ""}`}>
            {words.map((word, i) => (
                <motion.span
                    key={i}
                    className="mr-[0.25em] relative inline-block"
                    initial={{ y: "20%", opacity: 0 }}
                    animate={isInView ? { y: 0, opacity: 1 } : { y: "20%", opacity: 0 }}
                    transition={{ delay: i * 0.08, ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
                >
                    {word}
                    {showAsterisk && i === words.length - 1 && (
                        <span className="absolute top-[0.65em] -right-[0.3em] text-[0.31em]">*</span>
                    )}
                </motion.span>
            ))}
        </div>
    );
};

export const WordsPullUpMultiStyle = ({ segments, className }: { segments: {text: string, className?: string}[], className?: string }) => {
    const ref = useRef(null);
    const isInView = useInView(ref, { once: true });
    let wordIndex = 0;

    return (
        <div ref={ref} className={`inline-flex flex-wrap justify-center ${className || ""}`}>
            {segments.map((segment, segIdx) => {
                const words = segment.text.split(" ");
                return words.map((word, i) => {
                    // Don't render empty words from double spaces
                    if (!word) return null;
                    
                    const delay = wordIndex * 0.08;
                    wordIndex++;
                    return (
                        <motion.span
                            key={`${segIdx}-${i}`}
                            className={`mr-[0.25em] relative inline-block ${segment.className || ""}`}
                            initial={{ y: "20%", opacity: 0 }}
                            animate={isInView ? { y: 0, opacity: 1 } : { y: "20%", opacity: 0 }}
                            transition={{ delay, ease: [0.16, 1, 0.3, 1], duration: 0.8 }}
                        >
                            {word}
                        </motion.span>
                    )
                })
            })}
        </div>
    );
};

export const AnimatedLetter = ({ char, progress, charProgress }: { char: string, progress: any, charProgress: number, key?: number | string }) => {
    const opacity = useTransform(
        progress,
        [Math.max(0, charProgress - 0.1), Math.min(1, charProgress + 0.05)],
        [0.2, 1]
    );
    return <motion.span style={{ opacity }}>{char}</motion.span>;
};

export const ScrollRevealText = ({ text, className }: { text: string, className?: string }) => {
    const ref = useRef(null);
    const { scrollYProgress } = useScroll({
        target: ref,
        offset: ["start 0.8", "end 0.2"]
    });

    const chars = text.split("");

    return (
        <p ref={ref} className={className}>
            {chars.map((char, index) => {
                const charProgress = index / chars.length;
                return <AnimatedLetter key={index} char={char} progress={scrollYProgress} charProgress={charProgress} />
            })}
        </p>
    );
};
