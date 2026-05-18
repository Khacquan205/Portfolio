/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
"use client";

import { motion, useInView } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { WordsPullUp, WordsPullUpMultiStyle, ScrollRevealText } from "../components/animations";
import { useRef } from "react";

const navLinks = ["About", "Experience", "Projects", "Contact"];

function FeatureCard({ 
  delay, 
  id, 
  title, 
  iconUrl, 
  items 
}: { 
  delay: number, 
  id: string, 
  title: string, 
  iconUrl: string, 
  items: string[] 
}) {
  const ref = useRef(null);
  const isInView = useInView(ref, { once: true, margin: "-100px" });

  return (
    <motion.div
      ref={ref}
      initial={{ scale: 0.95, opacity: 0 }}
      animate={isInView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
      transition={{ delay, ease: [0.22, 1, 0.36, 1], duration: 0.8 }}
      className="bg-[#212121] rounded-[1.5rem] lg:rounded-[2rem] p-6 lg:p-8 border border-white/5 shadow-[inset_1px_1px_0px_rgba(225,224,204,0.05)] flex flex-col justify-between group hover:bg-[#252525] transition-colors duration-500"
    >
      <div>
        <div className="flex justify-between items-start mb-6">
          <span className="font-bold text-xs uppercase tracking-[0.1em] text-gray-500">{id}</span>
          <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-full bg-[#101010] flex items-center justify-center">
            <img src={iconUrl} alt={title} className="w-5 h-5 sm:w-6 sm:h-6 opacity-80" />
          </div>
        </div>
        
        <h4 className="text-xl md:text-2xl font-bold text-primary mb-4">{title}</h4>
        
        <ul className="flex flex-col gap-3 text-sm md:text-base text-gray-400">
          {items.map((item, i) => (
            <li key={i} className="flex items-start gap-3">
              <Check className="w-4 h-4 mt-1 shrink-0 text-primary" />
              <span>{item}</span>
            </li>
          ))}
        </ul>
      </div>
      
      <a href="#" className="flex items-center gap-2 text-xs uppercase tracking-[0.2em] font-bold text-primary mt-8 group-hover:gap-4 transition-all duration-300 w-fit">
        Learn more <ArrowRight className="w-4 h-4 -rotate-45" />
      </a>
    </motion.div>
  );
}

export default function App() {
  const card1Ref = useRef(null);
  const isCard1InView = useInView(card1Ref, { once: true, margin: "-100px" });

  return (
    <main className="w-full bg-black min-h-screen text-[#E1E0CC] selection:bg-primary/30 selection:text-white">
      
      {/* SECTION 1: HERO */}
      <section className="h-screen w-full p-4 md:p-6 pb-0 relative">
        <div className="w-full h-full rounded-2xl md:rounded-[2rem] overflow-hidden relative border border-white/5">
          {/* Background Video */}
          <div 
            suppressHydrationWarning 
            className="absolute inset-0 w-full h-full"
            dangerouslySetInnerHTML={{
              __html: `
                <video 
                  src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260405_170732_8a9ccda6-5cff-4628-b164-059c500a2b41.mp4" 
                  autoplay loop muted playsinline 
                  class="absolute inset-0 w-full h-full object-cover"
                ></video>
              `
            }}
          />
          
          {/* Overlays */}
          <div className="noise-overlay opacity-[0.7] mix-blend-overlay pointer-events-none" />
          <div className="absolute inset-0 bg-gradient-to-b from-black/30 via-transparent to-black/60 pointer-events-none" />

          {/* Navbar */}
          <nav className="absolute top-0 left-1/2 -translate-x-1/2 bg-black rounded-b-2xl md:rounded-b-3xl px-4 py-2 md:px-8 flex items-center gap-3 sm:gap-6 md:gap-12 lg:gap-14 border border-t-0 border-white/10 z-50">
            {navLinks.map((link) => (
              <a 
                key={link} 
                href="#" 
                style={{ color: "rgba(225, 224, 204, 0.8)" }}
                className="text-[10px] sm:text-xs md:text-sm font-bold uppercase tracking-[0.1em] hover:text-[#E1E0CC] transition-colors"
              >
                {link}
              </a>
            ))}
          </nav>

          {/* Hero Content */}
          <div className="absolute bottom-0 left-0 right-0 w-full p-4 md:p-8 flex flex-col md:grid md:grid-cols-12 md:items-end gap-6 md:gap-8 max-w-screen-2xl mx-auto">
            {/* Left: Giant Heading */}
            <div className="md:col-span-8">
              <WordsPullUp 
                text="QUAN" 
                showAsterisk={true}
                className="text-[26vw] sm:text-[24vw] md:text-[22vw] lg:text-[20vw] xl:text-[19vw] 2xl:text-[20vw] font-medium leading-[0.85] tracking-[-0.07em] text-[#E1E0CC]"
              />
            </div>
            
            {/* Right: Text + CTA */}
            <div className="md:col-span-4 flex flex-col items-start md:items-end gap-6 pb-2 md:pb-[3vw]">
              <motion.p 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.5, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="text-primary/70 text-xs sm:text-sm md:text-base leading-[1.2] max-w-sm"
              >
                Detail-oriented Full Stack Developer with hands-on experience building high-performance web and mobile applications using the JavaScript/TypeScript ecosystem. Passionate about leveraging AI-assisted workflows to optimize productivity.
              </motion.p>
              
              <motion.button 
                initial={{ opacity: 0, y: 20 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ delay: 0.7, duration: 0.8, ease: [0.16, 1, 0.3, 1] }}
                className="group bg-primary rounded-full pl-6 pr-2 py-2 flex items-center gap-2 hover:gap-3 transition-all duration-300 w-fit"
              >
                <span className="text-black font-medium text-sm sm:text-base uppercase tracking-widest whitespace-nowrap">View Resume</span>
                <div className="bg-black rounded-full w-9 h-9 sm:w-10 sm:h-10 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform duration-300">
                  <ArrowRight className="w-5 h-5 text-primary" />
                </div>
              </motion.button>
            </div>
          </div>
        </div>
      </section>

      {/* SECTION 2: ABOUT */}
      <section className="bg-black py-24 md:py-32 px-4 md:px-8 flex justify-center w-full">
        <div className="w-full max-w-6xl bg-[#101010] rounded-2xl md:rounded-[2rem] p-8 sm:p-12 md:p-24 border border-white/5 flex flex-col items-center text-center relative overflow-hidden">
          
          <span className="text-[10px] sm:text-xs text-primary font-bold uppercase tracking-[0.2em] mb-8 md:mb-12">Software Engineer</span>
          
          <WordsPullUpMultiStyle 
            segments={[
              { text: "I am Nguyen Khac Quan, ", className: "font-normal" },
              { text: "a Full Stack Developer. ", className: "italic font-serif opacity-90" },
              { text: "I have skills in React, Next.js, Node.js, and cloud deployments.", className: "font-normal" }
            ]}
            className="text-3xl sm:text-4xl md:text-5xl lg:text-6xl xl:text-7xl max-w-4xl mx-auto leading-[0.95] sm:leading-[0.9] text-primary"
          />

          <ScrollRevealText 
            text="Currently pursuing a Bachelor of Software Engineering at FPT University. I have hands-on experience building scalable backends, real-time data synchronization, and implementing complex business logic for retail and restaurant management systems."
            className="mt-12 md:mt-20 max-w-2xl text-[#DEDBC8] text-xs sm:text-sm md:text-base leading-relaxed"
          />
        </div>
      </section>

      {/* SECTION 3: FEATURES */}
      <section className="min-h-screen bg-black relative py-20 px-4 md:px-6 w-full max-w-screen-2xl mx-auto flex flex-col gap-12 md:gap-16">
        <div className="bg-noise opacity-[0.15]" />
        
        <div className="relative z-10 flex flex-col gap-3 px-2 md:px-4">
          <WordsPullUpMultiStyle 
            segments={[{ text: "High-performance applications for modern businesses.", className: "text-primary block" }]}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal w-full justify-start text-left"
          />
          <WordsPullUpMultiStyle 
            segments={[{ text: "Built for scalability. Powered by modern tech.", className: "text-gray-500 block" }]}
            className="text-xl sm:text-2xl md:text-3xl lg:text-4xl font-normal w-full justify-start text-left"
          />
        </div>

        <div className="relative z-10 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-2 md:gap-1 lg:h-[480px]">
          
          {/* Card 1 - Video Card */}
          <motion.div 
            ref={card1Ref}
            initial={{ scale: 0.95, opacity: 0 }}
            animate={isCard1InView ? { scale: 1, opacity: 1 } : { scale: 0.95, opacity: 0 }}
            transition={{ delay: 0, ease: [0.22, 1, 0.36, 1], duration: 0.8 }}
            className="lg:col-span-1 rounded-[1.5rem] lg:rounded-[2rem] overflow-hidden relative border border-white/5 h-[400px] md:h-auto group"
          >
            <div 
              suppressHydrationWarning 
              className="absolute inset-0 w-full h-full"
              dangerouslySetInnerHTML={{
                __html: `
                  <video 
                    src="https://d8j0ntlcm91z4.cloudfront.net/user_38xzZboKViGWJOttwIXH07lWA1P/hf_20260406_133058_0504132a-0cf3-4450-a370-8ea3b05c95d4.mp4" 
                    autoplay loop muted playsinline 
                    class="absolute inset-0 w-full h-full object-cover group-hover:scale-105 transition-transform duration-700"
                  ></video>
                `
              }}
            />
            <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none" />
            <div className="absolute bottom-6 md:bottom-8 left-6 md:left-8 right-6">
              <h4 className="text-xl md:text-2xl font-bold text-[#E1E0CC] leading-tight">Your technical partner.</h4>
            </div>
          </motion.div>

          <FeatureCard 
            id="01"
            delay={0.15}
            title="Point Of Sale Systems."
            iconUrl="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171918_4a5edc79-d78f-4637-ac8b-53c43c220606.png&w=1280&q=85"
            items={["Node.js backend & React Native", "Complex retail business logic", "Role-based REST APIs"]}
          />

          <FeatureCard 
            id="02"
            delay={0.3}
            title="Real-time Restaurant KDS."
            iconUrl="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171741_ed9845ab-f5b2-4018-8ce7-07cc01823522.png&w=1280&q=85"
            items={["Layered API with Redis caching", "WebSocket bi-directional sync", "SSR/SSG & TanStack Query"]}
          />

          <FeatureCard 
            id="03"
            delay={0.45}
            title="EcoRent Platform."
            iconUrl="https://images.higgs.ai/?default=1&output=webp&url=https%3A%2F%2Fd8j0ntlcm91z4.cloudfront.net%2Fuser_38xzZboKViGWJOttwIXH07lWA1P%2Fhf_20260405_171809_f56666dc-c099-4778-ad82-9ad4f209567b.png&w=1280&q=85"
            items={["Next.js 16 App Router", "KYC onboarding with OCR", "SignalR chat & VNPay"]}
          />
          
        </div>
      </section>

      {/* Footer minimal */}
      <footer className="w-full py-8 md:py-12 border-t border-white/5 px-6 md:px-12 flex justify-between items-center text-xs text-gray-500 uppercase tracking-widest font-bold">
        <span>Nguyen Khac Quan</span>
        <span>© 2026</span>
      </footer>

    </main>
  );
}
