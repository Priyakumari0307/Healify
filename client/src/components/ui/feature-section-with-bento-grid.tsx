import {
    ArrowRight,
    Globe,
    FileText,
    Calendar,
    TextCursorInput,
    Bell
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";

const BentoCard = ({
    title,
    description,
    icon: Icon,
    className,
    showLearnMore = false,
    gradient = "from-blue-50 to-indigo-50",
    imageUrl
}: {
    title: string;
    description: string;
    icon: any;
    className?: string;
    showLearnMore?: boolean;
    gradient?: string;
    imageUrl?: string;
}) => (
    <div className={cn(
        "group relative flex flex-col justify-end overflow-hidden rounded-[2.5rem] border border-zinc-200 bg-white p-8 transition-all duration-500 hover:shadow-[0_20px_60px_-15px_rgba(13,71,161,0.08)] hover:border-blue-200/50 md:p-10",
        className
    )}>
        {/* Background Decorative Gradient */}
        <div className={cn("absolute inset-0 bg-gradient-to-br opacity-[0.03] transition-opacity duration-500 group-hover:opacity-[0.08]", gradient)} />
        
        {imageUrl && (
            <div className="absolute inset-0 z-0">
                <img 
                    src={imageUrl} 
                    alt={title} 
                    className="h-full w-full object-cover opacity-60 transition-transform duration-700 group-hover:scale-110"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-white via-white/80 to-transparent" />
            </div>
        )}

        <div className="relative z-10 flex flex-col gap-4">
            <div className="mb-2">
                <div className="inline-flex items-center justify-center rounded-2xl bg-zinc-50 p-3 ring-1 ring-zinc-200/50 transition-all duration-500 group-hover:bg-blue-600 group-hover:text-white group-hover:shadow-lg group-hover:shadow-blue-200 group-hover:-translate-y-1">
                    <Icon className="h-8 w-8 stroke-[1.5]" />
                </div>
            </div>
            <div className="space-y-2">
                <h3 className="text-xl font-bold tracking-tight text-zinc-900">{title}</h3>
                <p className="text-sm leading-relaxed text-zinc-500 line-clamp-2 md:line-clamp-none">
                    {description}
                </p>
            </div>
            {showLearnMore && (
                <div className="mt-4 flex items-center gap-1.5 text-sm font-bold text-blue-600 cursor-pointer group/link">
                    Explore technology
                    <ArrowRight className="h-4 w-4 transition-transform duration-300 group-hover/link:translate-x-1" />
                </div>
            )}
        </div>
    </div>
);

function FeatureSectionWithBentoGrid() {
    return (
        <section className="w-full py-24 lg:py-40 bg-zinc-50/50" id="features">
            <div className="container mx-auto px-6 max-w-7xl">
                <div className="flex flex-col gap-20">
                    <div className="flex flex-col items-center text-center gap-6">
                        <Badge variant="outline" className="px-4 py-1.5 border-zinc-200 text-zinc-500 bg-white font-medium tracking-wide uppercase text-[10px]">
                            Core Intelligence
                        </Badge>
                        <h2 className="text-5xl md:text-7xl font-bold tracking-tight text-zinc-900 max-w-4xl">
                            The <span className="text-blue-600">Healify</span> Standard.
                        </h2>
                        <p className="text-xl text-zinc-500 max-w-2xl leading-relaxed">
                            Eliminating complexity in healthcare with minimalist design and powerful artificial intelligence.
                        </p>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 h-full min-h-[700px]">
                        {/* 1. Large Feature - Main AI */}
                        <BentoCard
                            title="Neural Diagnosis"
                            description="Real-time symptom analysis powered by deep learning models trained on millions of clinical cases."
                            icon={TextCursorInput}
                            className="lg:col-span-2 lg:row-span-2"
                            showLearnMore={true}
                            gradient="from-blue-100 to-cyan-100"
                            imageUrl="/Symptom.jpg"
                        />

                        {/* 2. Notifications */}
                        <BentoCard
                            title="Live Monitoring"
                            description="Constant health tracking with intelligent alerts for vital changes."
                            icon={Bell}
                            className="lg:col-span-1 lg:row-span-1"
                            gradient="from-teal-100 to-emerald-100"
                            imageUrl="/Live.jpg"
                        />

                        {/* 3. Global Access */}
                        <BentoCard
                            title="Universal Care"
                            description="Breaking barriers with support for 100+ native languages."
                            icon={Globe}
                            className="lg:col-span-1 lg:row-span-1"
                            gradient="from-indigo-100 to-violet-100"
                            imageUrl="/care.jpg"
                        />

                        {/* 4. Calendar - Split bottom */}
                        <BentoCard
                            title="Patient Timeline"
                            description="A unified history of your medical journey, appointments, and progress."
                            icon={Calendar}
                            className="lg:col-span-1 lg:row-span-1"
                            gradient="from-sky-100 to-blue-100"
                            imageUrl="/Time.jpg"
                        />

                        {/* 5. Secure Records */}
                        <BentoCard
                            title="Prescription Reading"
                            description="Reading prescription with OCR and AI "
                            icon={FileText}
                            className="lg:col-span-1 lg:row-span-1"
                            gradient="from-zinc-100 to-slate-100"
                            imageUrl="/Reading.jpg"
                        />
                    </div>
                </div>
            </div>
        </section>
    );
}

export { FeatureSectionWithBentoGrid as Feature };
