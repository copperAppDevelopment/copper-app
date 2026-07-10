import { X, Play, Pause, Volume2, Maximize2, ShieldCheck, Milestone } from "lucide-react";
import { useState, useEffect } from "react";
import { useStore } from "@nanostores/react";
import { activeTestimonialStore } from "../../stores/appStore";
import type { Testimonial } from "../../types";

export default function VideoModal() {
  const testimonial = useStore(activeTestimonialStore);

  if (!testimonial) return null;

  const onClose = () => {
    activeTestimonialStore.set(null);
  };
  const [isPlaying, setIsPlaying] = useState(true);
  const [progress, setProgress] = useState(0);
  const [activeCaptionIndex, setActiveCaptionIndex] = useState(0);

  // Colombian Spanish spoken transcripts matching the testimonial quote
  const captions = [
    { time: 0, text: "Hola, soy " + testimonial.name + " desde " + testimonial.location.split("-")[1]?.trim() + "." },
    { time: 3, text: "Queríamos solucionar la morosidad y las largas filas en la portería." },
    { time: 6, text: testimonial.quote },
    { time: 10, text: "La verdad es que Copper App cambió radicalmente todo. ¡Súper recomendado!" }
  ];

  // Tick progress and switch active captions
  useEffect(() => {
    let interval: NodeJS.Timeout;
    if (isPlaying) {
      interval = setInterval(() => {
        setProgress((prev) => {
          const next = prev + 1;
          if (next > 100) {
            // Loop back
            setActiveCaptionIndex(0);
            return 0;
          }
          
          // Map progress percentage to captions timeline (assuming 12 seconds total)
          const secondsElapsed = (next / 100) * 12;
          const foundIndex = captions.findIndex((c, i) => {
            const nextCaption = captions[i + 1];
            return secondsElapsed >= c.time && (!nextCaption || secondsElapsed < nextCaption.time);
          });
          if (foundIndex !== -1) {
            setActiveCaptionIndex(foundIndex);
          }

          return next;
        });
      }, 120); // updates every 120ms
    }
    return () => clearInterval(interval);
  }, [isPlaying]);

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/85 backdrop-blur-md p-4 animate-fade-in">
      
      {/* Click outside container handler */}
      <div className="absolute inset-0" onClick={onClose} />

      {/* Main video player box */}
      <div className="relative bg-neutral-950 border border-neutral-900 text-white rounded-3xl w-full max-w-2xl overflow-hidden shadow-2xl z-10 transition-all">
        
        {/* Top Header with title and close buttons */}
        <div className="flex items-center justify-between p-5 border-b border-neutral-900 bg-black/40">
          <div className="flex items-center gap-2 text-red-400 font-bold text-xs uppercase tracking-widest font-display">
            <ShieldCheck className="w-4 h-4 animate-pulse" />
            Testimonio Verificado
          </div>
          <button
            onClick={onClose}
            className="p-1.5 rounded-full hover:bg-neutral-900 text-zinc-400 hover:text-white transition-colors"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Video Simulation area */}
        <div className="relative aspect-video bg-black flex flex-col justify-between p-6 overflow-hidden">
          
          {/* Unsplash Background representing the testimonial speaker */}
          <div className="absolute inset-0 opacity-40">
            <img
              src={testimonial.image}
              alt={testimonial.name}
              referrerPolicy="no-referrer"
              className="w-full h-full object-cover filter blur-[2px]"
            />
          </div>

          {/* Top Speaker Identity display card */}
          <div className="relative z-10 flex items-center gap-3 bg-black/50 p-2.5 rounded-2xl w-fit backdrop-blur-sm">
            <img
              src={testimonial.avatar}
              alt={testimonial.name}
              referrerPolicy="no-referrer"
              className="w-10 h-10 rounded-full object-cover border border-white/20"
            />
            <div className="text-left">
              <p className="text-xs font-bold leading-tight">{testimonial.name}</p>
              <p className="text-[10px] text-zinc-300 leading-none">{testimonial.role}, {testimonial.location}</p>
            </div>
          </div>

          {/* Real-time speech visualizer wave bars */}
          {isPlaying && (
            <div className="absolute inset-x-0 bottom-24 flex justify-center items-end gap-[3px] h-12 pointer-events-none select-none">
              {[...Array(24)].map((_, i) => {
                // generate pseudo random animations or delay patterns
                const randomDelay = (i % 5) * 150;
                return (
                  <div
                    key={i}
                    className="w-[3px] bg-red-500 rounded-full animate-bounce"
                    style={{
                      height: `${15 + (i % 4) * 20}%`,
                      animationDuration: `${0.4 + (i % 3) * 0.3}s`,
                      animationDelay: `${randomDelay}ms`
                    }}
                  />
                );
              })}
            </div>
          )}

          {/* Synchronized Captions display subtitle card */}
          <div className="relative z-10 bg-black/75 p-4 rounded-xl border border-white/5 backdrop-blur-sm max-w-xl mx-auto text-center">
            <p className="text-sm font-semibold text-white/95 leading-normal transition-all duration-300">
              {captions[activeCaptionIndex]?.text}
            </p>
          </div>

          {/* Playback Control Area Overlay on bottom */}
          <div className="relative z-10 bg-black/60 backdrop-blur-md p-4 rounded-2xl border border-white/5 space-y-3">
            
            {/* Progress bar line */}
            <div className="relative flex items-center">
              <div className="w-full h-1 bg-zinc-800/60 rounded-full overflow-hidden">
                <div
                  className="h-full bg-red-600 rounded-full transition-all"
                  style={{ width: `${progress}%` }}
                />
              </div>
            </div>

            {/* Controls Row */}
            <div className="flex items-center justify-between">
              
              <div className="flex items-center gap-4">
                {/* Play / Pause toggle */}
                <button
                  onClick={() => setIsPlaying(!isPlaying)}
                  className="bg-red-600 hover:bg-red-700 text-white p-2.5 rounded-full transition-colors active:scale-95 cursor-pointer"
                >
                  {isPlaying ? <Pause className="w-4 h-4 fill-current" /> : <Play className="w-4 h-4 fill-current" />}
                </button>
                
                {/* Vol icon */}
                <Volume2 className="w-4 h-4 text-zinc-300" />
                
                {/* Duration indicator */}
                <span className="text-[11px] font-mono text-zinc-300">
                  0:{Math.floor((progress/100)*12).toString().padStart(2, "0")} / 0:12
                </span>
              </div>

              {/* Extras indicators to show attention to details */}
              <div className="flex items-center gap-3 text-zinc-400">
                <span className="text-[10px] bg-white/10 px-2 py-0.5 rounded font-mono font-bold text-white uppercase tracking-wider">
                  HD 1080p
                </span>
                <Maximize2 className="w-4 h-4 hover:text-white transition-colors cursor-pointer" />
              </div>

            </div>

          </div>

        </div>

        {/* Testimonial Quote breakdown */}
        <div className="p-6 bg-black/50 text-zinc-300 text-xs sm:text-sm font-light leading-relaxed border-t border-neutral-900">
          <span className="font-bold text-white mr-1">Resumen del caso:</span>
          {testimonial.quote}
        </div>

      </div>

    </div>
  );
}
