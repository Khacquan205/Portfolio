/**
 * @license
 * SPDX-License-Identifier: Apache-2.0
 */
"use client";

import { motion, useInView } from "motion/react";
import { ArrowRight, Check } from "lucide-react";
import { WordsPullUp, WordsPullUpMultiStyle, ScrollRevealText } from "../components/animations";
import { LoginButton } from "../components/LoginButton";
import { useRef, useState } from "react";
import emailjs from "@emailjs/browser";
import { techStack, experience, testimonials } from "../data";
import dynamic from "next/dynamic";

const TechIconCardExperience = dynamic(() => import("../components/TechIconCardExperience"), { ssr: false });
const ContactExperience = dynamic(() => import("../components/contact/ContactExperience"), { ssr: false });

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

  const formRef = useRef<HTMLFormElement>(null);
  const [loading, setLoading] = useState(false);
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setForm({ ...form, [name]: value });
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      await emailjs.sendForm(
        process.env.NEXT_PUBLIC_EMAILJS_SERVICE_ID || '',
        process.env.NEXT_PUBLIC_EMAILJS_TEMPLATE_ID || '',
        formRef.current as HTMLFormElement,
        process.env.NEXT_PUBLIC_EMAILJS_PUBLIC_KEY || ''
      );

      setForm({ name: "", email: "", message: "" });
      alert("Message sent successfully!");
    } catch (error) {
      console.error("EmailJS Error:", error);
      alert("Failed to send message. Please check console for details.");
    } finally {
      setLoading(false);
    }
  };

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

          {/* Login Button - Top Right Corner */}
          <div className="absolute top-3 right-4 md:top-4 md:right-6 z-50">
            <LoginButton />
          </div>

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

      {/* SECTION 4: SKILLS */}
      <section className="bg-black py-24 md:py-32 px-4 md:px-8 w-full max-w-screen-2xl mx-auto border-t border-white/5">
        <div className="flex flex-col items-center gap-4 mb-16 md:mb-24 text-center">
          <span className="text-[10px] sm:text-xs text-primary font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">🤝 What I Bring to the Table</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#E1E0CC]">How I Can Contribute & My Key Skills</h2>
        </div>
        
        <div className="flex flex-wrap justify-center gap-6 md:gap-10">
          {techStack.map((tech) => (
            <motion.div 
              key={tech.name}
              initial={{ opacity: 0, y: 30 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.6 }}
              className="bg-[#101010] border border-white/10 rounded-[2rem] p-6 md:p-8 flex flex-col items-center gap-6 group hover:bg-[#151515] hover:border-primary/50 transition-all duration-300 shadow-[inset_1px_1px_0px_rgba(225,224,204,0.05)] w-48 md:w-56"
            >
              <div className="w-24 h-24 md:w-32 md:h-32 flex items-center justify-center shrink-0 cursor-grab active:cursor-grabbing group-hover:scale-110 transition-transform duration-500">
                <TechIconCardExperience model={tech} />
              </div>
              <p className="text-[#E1E0CC] font-medium text-sm md:text-base text-center group-hover:text-primary transition-colors duration-300">{tech.name}</p>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 5: EXPERIENCE */}
      <section className="bg-black py-24 md:py-32 px-4 md:px-8 w-full max-w-screen-xl mx-auto border-t border-white/5 relative">
        <div className="flex flex-col items-center gap-4 mb-16 md:mb-24 text-center">
          <span className="text-[10px] sm:text-xs text-primary font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">💼 My Career Overview</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#E1E0CC]">Professional Work Experience</h2>
        </div>

        <div className="flex flex-col gap-12 md:gap-20">
          {experience.map((exp, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, y: 40 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, margin: "-100px" }}
              transition={{ duration: 0.7 }}
              className="flex flex-col lg:flex-row gap-8 lg:gap-16 items-start group"
            >
              {/* Left: Visual Card */}
              <div className="w-full lg:w-2/5 shrink-0 relative bg-[#101010] rounded-[1.5rem] p-6 border border-white/5 shadow-[inset_1px_1px_0px_rgba(225,224,204,0.05)] overflow-hidden">
                <div className="absolute inset-0 bg-gradient-to-br from-primary/5 to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-500" />
                <div className="relative z-10 flex flex-col items-start gap-4">
                  <div className="flex items-center gap-1">
                    {[1,2,3,4,5].map((s) => <img key={s} src="/images/star.png" alt="star" className="w-4 h-4 opacity-80" />)}
                  </div>
                  <p className="text-gray-400 text-sm italic line-clamp-4">"{exp.review}"</p>
                  <img src={exp.imgPath} alt="exp" className="w-full h-auto mt-4 rounded-xl opacity-90 group-hover:opacity-100 transition-opacity" />
                </div>
              </div>

              {/* Right: Timeline & Info */}
              <div className="w-full lg:w-3/5 flex flex-col md:flex-row gap-6 md:gap-10 relative">
                {/* Timeline line */}
                <div className="hidden md:block absolute left-[30px] top-12 bottom-0 w-[1px] bg-white/10" />
                
                <div className="w-14 h-14 md:w-16 md:h-16 shrink-0 bg-[#212121] rounded-2xl flex items-center justify-center border border-white/10 z-10">
                  <img src={exp.logoPath} alt="logo" className="w-8 h-8 md:w-10 md:h-10 object-contain" />
                </div>
                
                <div className="flex-1 pt-2">
                  <h3 className="text-2xl md:text-3xl font-bold text-[#E1E0CC] mb-2 group-hover:text-primary transition-colors duration-300">{exp.title}</h3>
                  <p className="text-primary/80 text-sm mb-6 flex items-center gap-2">
                    <span className="opacity-70">🗓️</span> {exp.date}
                  </p>
                  <p className="text-gray-500 italic text-sm mb-4">Responsibilities</p>
                  <ul className="flex flex-col gap-3">
                    {exp.responsibilities.map((resp, i) => (
                      <li key={i} className="flex items-start gap-3 text-sm md:text-base text-gray-300">
                        <Check className="w-4 h-4 mt-1 shrink-0 text-primary" />
                        <span>{resp}</span>
                      </li>
                    ))}
                  </ul>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 6: TESTIMONIALS */}
      <section className="bg-black py-24 md:py-32 px-4 md:px-8 w-full max-w-screen-2xl mx-auto border-t border-white/5">
        <div className="flex flex-col items-center gap-4 mb-16 md:mb-24 text-center">
          <span className="text-[10px] sm:text-xs text-primary font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">⭐️ Customer feedback highlights</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#E1E0CC]">What People Say About Me?</h2>
        </div>

        <div className="columns-1 md:columns-2 lg:columns-3 gap-6 space-y-6">
          {testimonials.map((test, index) => (
            <motion.div 
              key={index}
              initial={{ opacity: 0, scale: 0.95 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true, margin: "-50px" }}
              transition={{ duration: 0.5, delay: (index % 3) * 0.1 }}
              className="bg-[#101010] p-6 md:p-8 rounded-[1.5rem] border border-white/5 shadow-[inset_1px_1px_0px_rgba(225,224,204,0.05)] break-inside-avoid relative overflow-hidden group hover:border-white/10 transition-colors"
            >
              <div className="absolute top-0 right-0 p-6 opacity-10">
                <svg width="40" height="40" viewBox="0 0 24 24" fill="currentColor" xmlns="http://www.w3.org/2000/svg">
                  <path d="M14.017 21L16.41 14.596L14.017 14.596L14.017 3L22.428 3L22.428 14.596L20.035 21L14.017 21ZM4.01701 21L6.41001 14.596L4.01701 14.596L4.01701 3L12.428 3L12.428 14.596L10.035 21L4.01701 21Z" />
                </svg>
              </div>
              
              <div className="flex items-center gap-1 mb-6">
                {[1,2,3,4,5].map((s) => <img key={s} src="/images/star.png" alt="star" className="w-4 h-4 opacity-70" />)}
              </div>
              
              <p className="text-gray-300 text-sm md:text-base leading-relaxed mb-8 relative z-10">"{test.review}"</p>
              
              <div className="flex items-center gap-4 relative z-10">
                <div className="w-12 h-12 rounded-full overflow-hidden border border-white/10 shrink-0">
                  <img src={test.imgPath} alt={test.name} className="w-full h-full object-cover" />
                </div>
                <div>
                  <h4 className="font-bold text-[#E1E0CC]">{test.name}</h4>
                  <p className="text-xs text-gray-500">{test.mentions}</p>
                </div>
              </div>
            </motion.div>
          ))}
        </div>
      </section>

      {/* SECTION 7: CONTACT */}
      <section id="contact" className="bg-black py-24 md:py-32 px-4 md:px-8 w-full max-w-screen-xl mx-auto border-t border-white/5 relative">
        <div className="flex flex-col items-center gap-4 mb-16 md:mb-24 text-center">
          <span className="text-[10px] sm:text-xs text-primary font-bold uppercase tracking-[0.2em] px-4 py-1.5 rounded-full border border-primary/30 bg-primary/10">💬 Have questions or ideas?</span>
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-semibold text-[#E1E0CC]">Get in Touch – Let’s Connect</h2>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-10 lg:gap-16 items-start">
          <motion.div 
            initial={{ opacity: 0, x: -30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-5 bg-[#101010] p-8 md:p-10 rounded-3xl border border-white/5 shadow-[inset_1px_1px_0px_rgba(225,224,204,0.05)] relative overflow-hidden"
          >
            <div className="absolute -top-32 -left-32 w-64 h-64 bg-primary/10 blur-[100px] rounded-full pointer-events-none" />
            <form
              ref={formRef}
              onSubmit={handleSubmit}
              className="w-full flex flex-col gap-6 relative z-10"
            >
              <div className="flex flex-col gap-2">
                <label htmlFor="name" className="text-sm text-gray-400 font-medium">Your Name</label>
                <input
                  type="text"
                  id="name"
                  name="name"
                  value={form.name}
                  onChange={handleChange}
                  placeholder="What's your good name?"
                  required
                  className="bg-black border border-white/10 rounded-xl px-4 py-3 text-[#E1E0CC] placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="email" className="text-sm text-gray-400 font-medium">Your Email</label>
                <input
                  type="email"
                  id="email"
                  name="email"
                  value={form.email}
                  onChange={handleChange}
                  placeholder="What's your email address?"
                  required
                  className="bg-black border border-white/10 rounded-xl px-4 py-3 text-[#E1E0CC] placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors"
                />
              </div>

              <div className="flex flex-col gap-2">
                <label htmlFor="message" className="text-sm text-gray-400 font-medium">Your Message</label>
                <textarea
                  id="message"
                  name="message"
                  value={form.message}
                  onChange={handleChange}
                  placeholder="How can I help you?"
                  rows={5}
                  required
                  className="bg-black border border-white/10 rounded-xl px-4 py-3 text-[#E1E0CC] placeholder-gray-600 focus:outline-none focus:border-primary/50 transition-colors resize-none"
                />
              </div>

              <button 
                type="submit"
                disabled={loading}
                className="mt-4 bg-primary text-black font-bold text-sm md:text-base px-6 py-4 rounded-xl flex items-center justify-center gap-2 hover:bg-primary/90 transition-all disabled:opacity-70 disabled:cursor-not-allowed group"
              >
                {loading ? "Sending..." : "Send Message"}
                {!loading && <ArrowRight className="w-5 h-5 group-hover:translate-x-1 transition-transform" />}
              </button>
            </form>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0, x: 30 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true }}
            transition={{ duration: 0.6 }}
            className="lg:col-span-7 h-[400px] lg:h-full min-h-[500px] rounded-3xl overflow-hidden relative border border-white/5 group bg-[#0a0a0a] hover:cursor-grab active:cursor-grabbing"
          >
            <div className="w-full h-full absolute inset-0">
              <ContactExperience />
            </div>
            
            <div className="absolute bottom-10 left-10 max-w-md pointer-events-none bg-black/40 backdrop-blur-sm p-4 rounded-xl border border-white/10">
              <h3 className="text-xl md:text-2xl font-bold text-white mb-1">Based in Vietnam</h3>
              <p className="text-gray-300 text-xs md:text-sm">Always open for a chat or new opportunities. Fill out the form and I'll get back to you as soon as possible.</p>
            </div>
          </motion.div>
        </div>
      </section>

      <footer className="w-full py-8 md:py-12 border-t border-white/5 px-6 md:px-12 flex justify-between items-center text-xs text-gray-500 uppercase tracking-widest font-bold">
        <span>Nguyen Khac Quan</span>
        <span>© 2026</span>
      </footer>

    </main>
  );
}
