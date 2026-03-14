import React, { useEffect, useRef } from 'react';
import { Link } from 'react-router-dom';
import { ArrowRight } from 'lucide-react';

const HowItWorks = () => {
    const sectionRef = useRef(null);

    useEffect(() => {
        const observer = new IntersectionObserver(
            (entries) => {
                entries.forEach((entry) => {
                    if (entry.isIntersecting) {
                        entry.target.classList.add('opacity-100', 'translate-y-0');
                        entry.target.classList.remove('opacity-0', 'translate-y-10');
                    }
                });
            },
            { threshold: 0.1 }
        );

        const animatedElements = sectionRef.current.querySelectorAll('.animate-on-scroll');
        animatedElements.forEach((el) => observer.observe(el));

        return () => observer.disconnect();
    }, []);

    return (
        <section ref={sectionRef} className="py-24 bg-[#F8FAFC] overflow-hidden" id="how-it-works">
            <div className="container mx-auto px-6 max-w-[1100px]">
                {/* Header Section */}
                <div className="flex flex-col items-center text-center mb-16 animate-on-scroll transition-all duration-700 opacity-0 translate-y-10">
                    <span className="px-4 py-1.5 rounded-full bg-blue-50 text-[#2563EB] text-[11px] font-bold tracking-widest uppercase mb-4 border border-blue-100">
                        HOW IT WORKS
                    </span>
                    <h2 className="text-4xl md:text-5xl font-extrabold text-[#0F172A] mb-4">
                        Get started in <span className="text-[#2563EB]">3 simple steps</span>
                    </h2>
                    <p className="text-lg text-slate-500 max-w-2xl font-medium">
                        No appointments, no waiting rooms. Your AI health assistant is ready in minutes.
                    </p>
                </div>

                {/* Steps Section */}
                <div className="relative flex flex-col md:flex-row items-stretch justify-between gap-12 md:gap-4 mb-20">
                    {/* Background line for mobile - positioned behind the cards */}
                    <div className="absolute left-1/2 -translate-x-1/2 top-10 bottom-10 w-0 border-l-2 border-dotted border-blue-200 md:hidden z-0"></div>

                    {/* Step 1 */}
                    <div className="flex-1 relative animate-on-scroll transition-all duration-700 delay-100 opacity-0 translate-y-10 group will-change-transform z-10">
                        <div className="relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col items-center text-center group-hover:border-blue-200">
                            {/* Number Badge */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm shadow-lg z-20">
                                1
                            </div>
                            
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-blue-50 text-3xl flex items-center justify-center mb-6 ring-4 ring-white group-hover:scale-110 transition-transform duration-300">
                                👤
                            </div>

                            <h3 className="text-xl font-bold text-[#0F172A] mb-3">Create your account</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                                Sign up in 30 seconds with just your name and email. No credit card required.
                            </p>

                            <div className="w-full bg-slate-50 rounded-xl p-4 text-left border border-slate-100 group-hover:bg-blue-50/50 group-hover:border-blue-100 transition-colors">
                                <span className="text-[10px] font-bold text-[#2563EB] uppercase tracking-wider block mb-2">WHAT YOU'LL NEED</span>
                                <ul className="space-y-1.5">
                                    <li className="text-[12px] text-slate-600 flex items-center gap-2">
                                        <span className="text-emerald-500">✓</span> Email address
                                    </li>
                                    <li className="text-[12px] text-slate-600 flex items-center gap-2">
                                        <span className="text-emerald-500">✓</span> Basic profile info
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Arrow 1 */}
                    <div className="hidden md:flex items-center justify-center text-[#2563EB] animate-on-scroll transition-all duration-700 delay-200 opacity-0 translate-y-10 will-change-transform">
                        <ArrowRight className="w-6 h-6" />
                    </div>

                    {/* Step 2 - HIGHLIGHTED */}
                    <div className="flex-[1.1] relative animate-on-scroll transition-all duration-700 delay-300 opacity-0 translate-y-10 transform md:scale-105 z-20 will-change-transform">
                        <div className="relative bg-[#2563EB] rounded-2xl p-8 shadow-2xl shadow-blue-200/50 h-full flex flex-col items-center text-center">
                            {/* Number Badge */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-white text-[#2563EB] flex items-center justify-center font-bold text-sm shadow-lg z-20">
                                2
                            </div>
                            
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-white/10 text-3xl flex items-center justify-center mb-6 backdrop-blur-sm border border-white/20 ring-4 ring-blue-600/50">
                                🩺
                            </div>

                            <h3 className="text-xl font-bold text-white mb-3">Describe your symptoms</h3>
                            <p className="text-blue-50 text-sm leading-relaxed mb-6 flex-grow">
                                Tell our AI what you're experiencing. It asks smart follow-up questions to understand your condition.
                            </p>

                            <div className="w-full bg-white/10 backdrop-blur-md rounded-xl p-4 text-left border border-white/10">
                                <span className="text-[10px] font-bold text-white uppercase tracking-wider block mb-2 opacity-80">POWERED BY AI</span>
                                <ul className="space-y-1.5">
                                    <li className="text-[12px] text-blue-50 flex items-center gap-2">
                                        <span className="text-white">✓</span> Natural language input
                                    </li>
                                    <li className="text-[12px] text-blue-50 flex items-center gap-2">
                                        <span className="text-white">✓</span> 500+ conditions checked
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>

                    {/* Arrow 2 */}
                    <div className="hidden md:flex items-center justify-center text-[#2563EB] animate-on-scroll transition-all duration-700 delay-400 opacity-0 translate-y-10 will-change-transform">
                        <ArrowRight className="w-6 h-6" />
                    </div>

                    {/* Step 3 */}
                    <div className="flex-1 relative animate-on-scroll transition-all duration-700 delay-500 opacity-0 translate-y-10 group will-change-transform z-10">
                        <div className="relative bg-white rounded-2xl p-8 border border-slate-100 shadow-sm hover:shadow-xl transition-all duration-500 h-full flex flex-col items-center text-center group-hover:border-blue-200">
                            {/* Number Badge */}
                            <div className="absolute -top-4 left-1/2 -translate-x-1/2 w-8 h-8 rounded-full bg-[#2563EB] text-white flex items-center justify-center font-bold text-sm shadow-lg z-20">
                                3
                            </div>
                            
                            {/* Icon */}
                            <div className="w-16 h-16 rounded-2xl bg-emerald-50 text-3xl flex items-center justify-center mb-6 ring-4 ring-white group-hover:scale-110 transition-transform duration-300">
                                📋
                            </div>

                            <h3 className="text-xl font-bold text-[#0F172A] mb-3">Get your health report</h3>
                            <p className="text-slate-500 text-sm leading-relaxed mb-6 flex-grow">
                                Receive a detailed diagnosis, suggested next steps, and the option to book a real doctor.
                            </p>

                            <div className="w-full bg-emerald-50/50 rounded-xl p-4 text-left border border-emerald-100 group-hover:bg-emerald-50 transition-colors">
                                <span className="text-[10px] font-bold text-emerald-600 uppercase tracking-wider block mb-2">YOUR REPORT INCLUDES</span>
                                <ul className="space-y-1.5">
                                    <li className="text-[12px] text-slate-600 flex items-center gap-2">
                                        <span className="text-emerald-500">✓</span> Possible conditions
                                    </li>
                                    <li className="text-[12px] text-slate-600 flex items-center gap-2">
                                        <span className="text-emerald-500">✓</span> Book a doctor option
                                    </li>
                                </ul>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Bottom CTA Strip */}
                <div className="bg-[#EFF6FF] rounded-[2rem] p-8 md:px-12 md:py-8 border border-blue-100 flex flex-col md:flex-row items-center justify-between gap-6 animate-on-scroll transition-all duration-700 delay-600 opacity-0 translate-y-10 will-change-transform">
                    <div>
                        <h4 className="text-xl font-extrabold text-[#0F172A]">Ready to take control of your health?</h4>
                        <p className="text-blue-600 font-medium text-sm">Join 10,000+ users already using Healify</p>
                    </div>
                    <Link 
                        to="/signup" 
                        className="bg-[#2563EB] text-white px-8 py-4 rounded-2xl font-bold flex items-center gap-2 hover:bg-blue-700 hover:-translate-y-1 transition-all duration-300 shadow-lg shadow-blue-200"
                    >
                        Get started free <ArrowRight size={18} />
                    </Link>
                </div>
            </div>
        </section>
    );
};

export default HowItWorks;
