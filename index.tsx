import React, { useState, useRef, useEffect } from "react";
import { createRoot } from "react-dom/client";
import { GoogleGenAI } from "@google/genai";
import ReactMarkdown from 'react-markdown';

// --- ICONS ---
const UploadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="17 8 12 3 7 8"/><line x1="12" x2="12" y1="3" y2="15"/></svg>
);

const SparklesIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 3-1.912 5.813a2 2 0 0 1-1.275 1.275L3 12l5.813 1.912a2 2 0 0 1 1.275 1.275L12 21l1.912-5.813a2 2 0 0 1 1.275-1.275L12 3Z"/></svg>
);

const DownloadIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"/><polyline points="7 10 12 15 17 10"/><line x1="12" x2="12" y1="15" y2="3"/></svg>
);

const MagicWandIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="m19 2 2 2-2 2-2-2 2-2Z"/>
    <path d="m5 7 2 2-2 2-2-2 2-2Z"/>
    <path d="m15 11 2 2-2 2-2-2 2-2Z"/>
    <path d="M18 13l-6.5 6.5a2.12 2.12 0 1 1-3-3L15 10"/>
  </svg>
);

const BrainIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9.5 2A2.5 2.5 0 0 1 12 4.5v15a2.5 2.5 0 0 1-4.96.44 2.5 2.5 0 0 1-2.96-3.08 3 3 0 0 1-.34-5.58 2.5 2.5 0 0 1 1.32-4.24 2.5 2.5 0 0 1 1.98-3A2.5 2.5 0 0 1 9.5 2Z"/><path d="M14.5 2A2.5 2.5 0 0 0 12 4.5v15a2.5 2.5 0 0 0 4.96.44 2.5 2.5 0 0 0 2.96-3.08 3 3 0 0 0 .34-5.58 2.5 2.5 0 0 0-1.32-4.24 2.5 2.5 0 0 0-1.98-3A2.5 2.5 0 0 0 14.5 2Z"/></svg>
);

const UndoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M9 14 4 9l5-5"/><path d="M4 9h10.5a5.5 5.5 0 0 1 5.5 5.5v0a5.5 5.5 0 0 1-5.5 5.5H11"/></svg>
);

const RedoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m15 14 5-5-5-5"/><path d="M20 9H9.5A5.5 5.5 0 0 0 4 14.5v0A5.5 5.5 0 0 0 9.5 20H13"/></svg>
);

const VideoIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m22 8-6 4 6 4V8Z"/><rect width="14" height="12" x="2" y="6" rx="2" ry="2"/></svg>
);

const SliderIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/></svg>
);

const SideBySideIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M12 3v18"/><path d="M3 12h18"/></svg>
);

const EditIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 20h9"/><path d="M16.5 3.5a2.121 2.121 0 0 1 3 3L7 19l-4 1 1-4L16.5 3.5z"/></svg>
);

const ImageIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2" ry="2"/><circle cx="9" cy="9" r="2"/><path d="m21 15-3.086-3.086a2 2 0 0 0-2.828 0L6 21"/></svg>
);

const SearchIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="11" cy="11" r="8"/><path d="m21 21-4.3-4.3"/></svg>
);

const AnalyzeIcon = (props: React.SVGProps<SVGSVGElement>) => (
    <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M16 16v4h4v-4z"/><path d="M12 12v8"/><path d="M8 8v12"/><path d="M4 4v16"/></svg>
);

const SunIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="4"/><path d="M12 2v2"/><path d="M12 20v2"/><path d="m4.93 4.93 1.41 1.41"/><path d="m17.66 17.66 1.41 1.41"/><path d="M2 12h2"/><path d="M20 12h2"/><path d="m6.34 17.66-1.41 1.41"/><path d="m19.07 4.93-1.41 1.41"/></svg>
);

const MoonIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M12 3a6 6 0 0 0 9 9 9 9 0 1 1-9-9Z"/></svg>
);

// Style-specific Icons
const WindIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}>
    <path d="M17.7 7.7a2.5 2.5 0 1 1 1.8 4.3H2" />
    <path d="M9.6 4.6A2 2 0 1 1 11 8H2" />
    <path d="M12.6 19.4A2 2 0 1 0 14 16H2" />
  </svg>
);

const DiamondIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M6 3h12l4 6-10 13L2 9Z"/></svg>
);

const ZapIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><polygon points="13 2 3 14 12 14 11 22 21 10 12 10 13 2"/></svg>
);

const FilmIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="18" height="18" x="3" y="3" rx="2"/><path d="M7 3v18"/><path d="M3 7.5h4"/><path d="M3 12h18"/><path d="M3 16.5h4"/><path d="M17 3v18"/><path d="M17 7.5h4"/><path d="M17 16.5h4"/></svg>
);

const PenToolIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="m12 19 7-7 3 3-7 7-3-3z"/><path d="m18 13-1.5-7.5L2 2l3.5 14.5L13 18l5-5z"/><path d="m2 2 7.586 7.586"/><circle cx="11" cy="11" r="2"/></svg>
);

const EyeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M2 12s3-7 10-7 10 7 10 7-3 7-10 7-10-7-10-7Z"/><circle cx="12" cy="12" r="3"/></svg>
);

const MaximizeIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><path d="M15 3h6v6"/><path d="M9 21H3v-6"/><path d="M21 3l-7 7"/><path d="M3 21l7-7"/></svg>
);

const ContrastIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><circle cx="12" cy="12" r="10"/><path d="M12 2a10 10 0 0 1 0 20z"/></svg>
);

const MonitorIcon = (props: React.SVGProps<SVGSVGElement>) => (
  <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" {...props}><rect width="20" height="14" x="2" y="3" rx="2"/><line x1="8" x2="16" y1="21" y2="21"/><line x1="12" x2="12" y1="17" y2="21"/></svg>
);

// --- CONSTANTS & CONFIG ---

const ENHANCEMENT_STYLES = [
  {
    id: "fantastic_hd",
    title: "Fantastic HD",
    description: "Crystal clear 4K resolution.",
    prompt: "Enhance this image to be Fantastic HD, extremely sharp focus, 4k resolution, highly detailed, removing all blur and noise. Photorealistic.",
    color: "from-blue-500 to-cyan-400",
    icon: SparklesIcon
  },
  {
    id: "auto_screen",
    title: "Auto Screen Fix",
    description: "Smart contrast & layout adjust.",
    prompt: "Optimize this image for screen display. Automatically correct brightness, contrast, and framing. Make it look perfect on a digital screen.",
    color: "from-sky-400 to-blue-500",
    icon: MonitorIcon
  },
  {
    id: "clarity_boost",
    title: "Clarity Boost",
    description: "Reduce noise, sharpen details.",
    prompt: "Enhance this image for maximum clarity, reduce noise, sharpen details, and improve overall quality. Photorealistic.",
    color: "from-sky-500 to-indigo-500",
    icon: EyeIcon
  },
  {
    id: "more_hd",
    title: "More HD",
    description: "Maximum detail boost.",
    prompt: "Make this image Ultra HD, increase clarity, restore lost details, upscale, perfect lighting, hyper-realistic.",
    color: "from-emerald-500 to-teal-400",
    icon: MaximizeIcon
  },
  {
    id: "luxurious",
    title: "Luxurious",
    description: "Premium lighting and rich colors.",
    prompt: "Make this image look luxurious, expensive, golden hour lighting, cinematic atmosphere, high contrast, elegant, 8k.",
    color: "from-amber-500 to-orange-400",
    icon: DiamondIcon
  },
  {
    id: "cyber",
    title: "Cyber Pop",
    description: "Vibrant neon clarity.",
    prompt: "Enhance this image with a cyberpunk aesthetic, neon lighting, vibrant colors, sharp edges, futuristic high definition.",
    color: "from-fuchsia-500 to-purple-500",
    icon: ZapIcon
  },
  {
    id: "vintage_film",
    title: "Vintage Film",
    description: "Analog look with warm tones.",
    prompt: "Enhance this image to look like a vintage film photograph, Kodak Portra style, warm tones, slight grain, nostalgic atmosphere, high quality.",
    color: "from-orange-600 to-red-500",
    icon: FilmIcon
  },
  {
    id: "anime_art",
    title: "Anime Art",
    description: "Stylized animation look.",
    prompt: "Transform this image into a high-quality anime art style, Makoto Shinkai style, vibrant colors, clean lines, beautiful lighting, detailed background.",
    color: "from-pink-400 to-rose-400",
    icon: PenToolIcon
  },
  {
    id: "sketch_art",
    title: "Sketch Art",
    description: "Realistic pencil sketch.",
    prompt: "Transform this image into a highly detailed and realistic pencil sketch, capturing fine lines, subtle shading, and an artistic feel. Black and white.",
    color: "from-gray-600 to-gray-400",
    icon: PenToolIcon
  },
  {
    id: "bw_noir",
    title: "B&W Noir",
    description: "Dramatic monochrome.",
    prompt: "Convert this image to high-contrast black and white photography, film noir style, dramatic lighting, deep shadows, sharp details, artistic.",
    color: "from-gray-400 to-gray-100",
    icon: ContrastIcon
  },
  {
    id: "auto_colorize",
    title: "Auto Colorize",
    description: "Add color to black and white images.",
    prompt: "Colorize this black and white image realistically, preserving details and natural colors.",
    color: "from-blue-500 to-green-500",
    icon: SparklesIcon
  },
  {
    id: "motion_blur",
    title: "Motion Blur",
    description: "Add speed and dynamism.",
    prompt: "Apply a realistic motion blur effect to this image, suggesting fast movement in a specific direction.",
    color: "from-yellow-400 to-orange-500",
    icon: WindIcon
  },
  {
    id: "3d_render",
    title: "3D Render",
    description: "Gives the image a realistic 3D rendered appearance.",
    prompt: "Transform this image into a high-quality 3D render, with realistic lighting, smooth surfaces, sharp details, and a photorealistic appearance.",
    color: "from-cyan-500 to-blue-500",
    icon: MaximizeIcon
  },
  {
    id: "custom",
    title: "Custom Edit",
    description: "Your own prompt.",
    prompt: "custom", 
    color: "from-violet-600 to-indigo-600",
    icon: EditIcon
  }
];

interface ErrorDetail {
    title: string;
    message: string;
    suggestion?: string;
}

const LOADING_MESSAGES = {
    enhance: ["Analyzing image composition...", "Identifying improvement areas...", "Enhancing resolution and details...", "Adjusting color and lighting...", "Applying final artistic touches..."],
    'create-image': ["Weaving the concept...", "Sketching the outlines...", "Painting the details...", "Refining lighting and shadows...", "Finalizing your masterpiece..."],
    analyze: ["Scanning media data...", "Identifying objects and scenes...", "Analyzing visual elements...", "Synthesizing insights...", "Generating detailed report..."],
    'create-video': ["Initializing video engine...", "Generating keyframes...", "Interpolating motion...", "Rendering high-quality video...", "Finalizing output..."],
    thinking: ["Pondering complex details...", "Reasoning through the context...", "Connecting deep concepts...", "Formulating a comprehensive answer..."]
};

// --- HELPERS ---

const analyzeError = (error: any): ErrorDetail => {
  if (!error) return { title: "Unknown Error", message: "An unknown error occurred." };
  if (error.title && error.message) return error as ErrorDetail;

  const msg = (error.message || error.toString()).toLowerCase();
  
  if (msg.includes("400")) return { title: "Bad Request", message: "The request might be invalid.", suggestion: "Try a different image or prompt." };
  if (msg.includes("401")) return { title: "Unauthorized", message: "Invalid API Key.", suggestion: "Check your API key." };
  if (msg.includes("403")) return { title: "Access Denied", message: "Permission denied for this model.", suggestion: "Your API key might not support this model." };
  if (msg.includes("404")) return { title: "Model Not Found", message: "The requested AI model is unavailable.", suggestion: "Service temporarily down." };
  if (msg.includes("413") || msg.includes("too large")) return { title: "Image Too Large", message: "Image exceeds size limit.", suggestion: "Use a smaller image (under 20MB)." };
  if (msg.includes("429") || msg.includes("quota")) return { title: "Rate Limit", message: "Too many requests.", suggestion: "Wait a moment and try again." };
  if (msg.includes("500")) return { title: "Server Error", message: "Google service error.", suggestion: "Try again later." };
  if (msg.includes("safety") || msg.includes("blocked")) return { title: "Safety Block", message: "Content flagged by safety filters.", suggestion: "Avoid sensitive or prohibited content." };
  if (msg.includes("fetch failed")) return { title: "Connection Error", message: "Could not connect.", suggestion: "Check internet connection." };
  
  return {
      title: "Error",
      message: msg.length < 200 ? (error.message || String(error)) : "An unexpected error occurred.",
      suggestion: "Please try again."
  };
};

const resizeImage = (file: File): Promise<string> => {
  return new Promise((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement("canvas");
        let width = img.width;
        let height = img.height;
        // Increased max dimension for better HD results
        const MAX_DIMENSION = 1600;
        if (width > height) {
          if (width > MAX_DIMENSION) {
            height *= MAX_DIMENSION / width;
            width = MAX_DIMENSION;
          }
        } else {
          if (height > MAX_DIMENSION) {
            width *= MAX_DIMENSION / height;
            height = MAX_DIMENSION;
          }
        }
        canvas.width = width;
        canvas.height = height;
        const ctx = canvas.getContext("2d");
        if (ctx) {
            ctx.drawImage(img, 0, 0, width, height);
            resolve(canvas.toDataURL("image/jpeg", 0.7));
        } else {
            reject(new Error("Could not get canvas context"));
        }
      };
      img.onerror = reject;
      img.src = e.target?.result as string;
    };
    reader.onerror = reject;
    reader.readAsDataURL(file);
  });
};

const processFile = async (file: File): Promise<{ data: string, type: 'image' | 'video' }> => {
    if (file.type.startsWith('video/')) {
        return new Promise((resolve, reject) => {
            const reader = new FileReader();
            reader.onload = (e) => resolve({ data: e.target?.result as string, type: 'video' });
            reader.onerror = reject;
            reader.readAsDataURL(file);
        });
    } else {
         const resized = await resizeImage(file);
         return { data: resized, type: 'image' };
    }
}


// --- COMPONENTS ---

const ImageComparison = ({ before, after, labelBefore = "Original", labelAfter = "Enhanced" }: { before: string, after: string, labelBefore?: string, labelAfter?: string }) => {
    const [sliderPos, setSliderPos] = useState(50);
    const containerRef = useRef<HTMLDivElement>(null);
    const isDragging = useRef(false);

    const handleMove = (clientX: number) => {
        if (!containerRef.current) return;
        const rect = containerRef.current.getBoundingClientRect();
        const x = Math.max(0, Math.min(clientX - rect.left, rect.width));
        setSliderPos(Math.max(0, Math.min((x / rect.width) * 100, 100)));
    };

    return (
        <div 
            ref={containerRef}
            className="relative w-full h-full min-h-[300px] overflow-hidden cursor-ew-resize select-none touch-none group"
            onMouseDown={() => isDragging.current = true}
            onMouseUp={() => isDragging.current = false}
            onMouseLeave={() => isDragging.current = false}
            onMouseMove={(e) => isDragging.current && handleMove(e.clientX)}
            onTouchMove={(e) => handleMove(e.touches[0].clientX)}
        >
            <img src={before} className="absolute inset-0 w-full h-full object-contain pointer-events-none" alt="Before" />
            <div className="absolute top-4 left-4 bg-black/60 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm z-20 pointer-events-none">{labelBefore}</div>
            <div className="absolute inset-0 w-full h-full overflow-hidden" style={{ clipPath: `inset(0 0 0 ${sliderPos}%)` }}>
                <img src={after} className="absolute inset-0 w-full h-full object-contain pointer-events-none" alt="After" />
                 <div className="absolute top-4 right-4 bg-indigo-600/90 text-white px-3 py-1 rounded-full text-xs font-bold backdrop-blur-sm z-20 pointer-events-none">{labelAfter}</div>
            </div>
            <div className="absolute inset-y-0 w-1 bg-white/80 backdrop-blur-sm shadow-[0_0_15px_rgba(0,0,0,0.5)] z-30" style={{ left: `${sliderPos}%` }}>
                <div className="absolute top-1/2 left-1/2 -translate-x-1/2 -translate-y-1/2 w-8 h-8 bg-white rounded-full flex items-center justify-center shadow-xl text-indigo-600 border border-indigo-100">
                    <svg xmlns="http://www.w3.org/2000/svg" width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round"><path d="m9 18 6-6-6-6"/><path d="m15 6-6 6 6 6"/></svg>
                </div>
            </div>
        </div>
    );
};

// --- MAIN APP ---

type Mode = 'enhance' | 'create-image' | 'create-video' | 'analyze';

function App() {
  const [mode, setMode] = useState<Mode>('enhance');
  
  // Theme State
  const [darkMode, setDarkMode] = useState(false);

  // Shared State
  const [uploadedMedia, setUploadedMedia] = useState<string | null>(null);
  const [mediaType, setMediaType] = useState<'image' | 'video'>('image');
  
  const [loading, setLoading] = useState(false);
  const [loadingProgress, setLoadingProgress] = useState(0); // For progress bar (0-100)
  const [loadingStatus, setLoadingStatus] = useState("Processing..."); // Status text
  const [error, setError] = useState<ErrorDetail | null>(null);

  // Enhance Mode State
  const [history, setHistory] = useState<{ image: string; style: typeof ENHANCEMENT_STYLES[0] }[]>([]);
  const [historyIndex, setHistoryIndex] = useState(-1);
  const [selectedStyle, setSelectedStyle] = useState(ENHANCEMENT_STYLES[0]);
  const [customPrompt, setCustomPrompt] = useState("");
  const [enhancementStrength, setEnhancementStrength] = useState(75);
  const [contrastLevel, setContrastLevel] = useState(50);
  const [viewMode, setViewMode] = useState<'slider' | 'side-by-side'>('slider');

  // Create Image Mode State
  const [imagePrompt, setImagePrompt] = useState("");
  const [imageSize, setImageSize] = useState<"1K" | "2K" | "4K">("1K");
  const [generatedImage, setGeneratedImage] = useState<string | null>(null);

  // Create Video Mode State
  const [videoPrompt, setVideoPrompt] = useState("");
  const [videoAspectRatio, setVideoAspectRatio] = useState<"16:9" | "9:16">("16:9");
  const [generatedVideo, setGeneratedVideo] = useState<string | null>(null);

  // Analyze Mode State
  const [analyzePrompt, setAnalyzePrompt] = useState("");
  const [analysisResult, setAnalysisResult] = useState<string | null>(null);
  const [useSearch, setUseSearch] = useState(false);
  const [isThinking, setIsThinking] = useState(false);

  const fileInputRef = useRef<HTMLInputElement>(null);

  // Derived
  const enhancedImage = historyIndex >= 0 ? history[historyIndex].image : null;

  // --- EFFECTS ---

  // Dark Mode
  useEffect(() => {
    if (darkMode) {
      document.documentElement.classList.add('dark');
    } else {
      document.documentElement.classList.remove('dark');
    }
  }, [darkMode]);

  // Simulated progress for non-video modes
  useEffect(() => {
    let interval: any;
    if (loading && mode !== 'create-video') {
        setLoadingProgress(0);
        // Simulate progress up to 90%
        interval = setInterval(() => {
            setLoadingProgress(prev => {
                if (prev >= 90) return prev;
                // Logarithmic slowdown
                const remaining = 90 - prev;
                const inc = Math.max(0.5, remaining * 0.1 * Math.random());
                return Math.min(90, prev + inc);
            });
        }, 300);
    } else if (!loading) {
        setLoadingProgress(100);
    }
    return () => clearInterval(interval);
  }, [loading, mode]);

  // Derived status text for non-video modes
  useEffect(() => {
    if (loading && mode !== 'create-video') {
        const messages = isThinking ? LOADING_MESSAGES.thinking : LOADING_MESSAGES[mode];
        const step = Math.floor((loadingProgress / 100) * messages.length);
        setLoadingStatus(messages[Math.min(step, messages.length - 1)]);
    }
  }, [loadingProgress, loading, mode, isThinking]);


  // --- HANDLERS ---

  const handleFileChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (file) {
        try {
            const result = await processFile(file);
            setUploadedMedia(result.data);
            setMediaType(result.type);
            setHistory([]); setHistoryIndex(-1); setError(null);
            setAnalysisResult(null);
        } catch(e) { setError(analyzeError(e)); }
    }
  };

  const loadExampleImage = async () => {
    try {
        const response = await fetch('https://images.unsplash.com/photo-1520337222409-d5c215162235?q=80&w=600&auto=format&fit=crop');
        const blob = await response.blob();
        const reader = new FileReader();
        reader.onloadend = () => {
             setUploadedMedia(reader.result as string);
             setMediaType('image');
             setHistory([]); setHistoryIndex(-1); setError(null);
        };
        reader.readAsDataURL(blob);
    } catch (e) {
        // Fallback to a simple placeholder if fetch fails
        const canvas = document.createElement('canvas');
        canvas.width = 600;
        canvas.height = 400;
        const ctx = canvas.getContext('2d');
        if (ctx) {
            ctx.fillStyle = '#e2e8f0';
            ctx.fillRect(0,0,600,400);
            ctx.fillStyle = '#64748b';
            ctx.font = '30px sans-serif';
            ctx.textAlign = 'center';
            ctx.fillText('Example Image', 300, 200);
            setUploadedMedia(canvas.toDataURL());
            setMediaType('image');
            setHistory([]); setHistoryIndex(-1); setError(null);
        }
    }
  };

  const checkApiKey = async () => {
      // @ts-ignore
      if (window.aistudio && window.aistudio.hasSelectedApiKey) {
          // @ts-ignore
           const hasKey = await window.aistudio.hasSelectedApiKey();
           // @ts-ignore
           if (!hasKey) await window.aistudio.openSelectKey();
      }
  };

  const handleEnhance = async () => {
    if (!uploadedMedia) return;
    if (mediaType === 'video') { setError({title: "Invalid Media", message: "Enhance mode only supports images."}); return; }
    
    setLoading(true); setError(null);
    try {
      const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
      const base64Data = uploadedMedia.split(',')[1];
      const mimeType = uploadedMedia.split(';')[0].split(':')[1];
      let prompt = selectedStyle.id === 'custom' ? customPrompt : selectedStyle.prompt;
      if (!prompt) throw new Error("Please enter a prompt.");

      // Add specific instructions for BW Noir
      if (selectedStyle.id === 'bw_noir') {
          prompt += ` Adjust the contrast to level ${contrastLevel} on a scale of 0-100 (where 100 is maximum contrast).`;
      }
      
      let strengthDesc = "moderately";
      if (enhancementStrength < 30) strengthDesc = "subtly";
      else if (enhancementStrength > 70) strengthDesc = "strongly";

      const fullPrompt = `${prompt} Apply this effect ${strengthDesc} (intensity level ${enhancementStrength}/100). Return ONLY the edited image.`;
      
      const response = await ai.models.generateContent({
        model: 'gemini-2.5-flash-image',
        contents: { parts: [{ inlineData: { data: base64Data, mimeType } }, { text: fullPrompt }] },
        config: {
            systemInstruction: "You are an expert AI image editor. Your task is to edit or enhance the provided input image based strictly on the user's prompt. You MUST return a single image as the output. Do not provide textual descriptions. Maintain the original composition unless explicitly asked to transform it.",
        }
      });

      let found = false;
      if (response.candidates?.[0]?.content?.parts) {
        for (const part of response.candidates[0].content.parts) {
          if (part.inlineData) {
            const newItem = { image: `data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`, style: selectedStyle };
            const newHist = history.slice(0, historyIndex + 1);
            newHist.push(newItem);
            setHistory(newHist);
            setHistoryIndex(newHist.length - 1);
            found = true;
            break;
          }
        }
      }
      if (!found) {
           const textPart = response.candidates?.[0]?.content?.parts?.find(p => p.text);
           if (textPart) throw new Error("AI declined to generate image: " + textPart.text);
           throw new Error("No image returned from the model.");
      }
    } catch (e) { setError(analyzeError(e)); }
    finally { setLoading(false); }
  };

  const handleGenerateImage = async () => {
      if (!imagePrompt) { setError({title: "Missing Prompt", message: "Enter a description."}); return; }
      setLoading(true); setError(null);
      try {
        await checkApiKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const response = await ai.models.generateContent({
            model: 'gemini-3-pro-image-preview',
            contents: { parts: [{ text: imagePrompt }] },
            config: { imageConfig: { imageSize: imageSize, aspectRatio: "1:1" } } // 1:1 default for gen
        });
        
        let found = false;
        if (response.candidates?.[0]?.content?.parts) {
            for (const part of response.candidates[0].content.parts) {
                if (part.inlineData) {
                    setGeneratedImage(`data:${part.inlineData.mimeType || 'image/png'};base64,${part.inlineData.data}`);
                    found = true; break;
                }
            }
        }
        if (!found) throw new Error(response.text || "No image generated.");
      } catch (e) { setError(analyzeError(e)); }
      finally { setLoading(false); }
  };

  const handleGenerateVideo = async () => {
      if (!videoPrompt) { setError({title: "Missing Prompt", message: "Enter a description."}); return; }
      setLoading(true); setLoadingProgress(0); setLoadingStatus("Initializing Veo..."); setError(null);
      try {
        await checkApiKey();
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        
        let imagePart = undefined;
        if (uploadedMedia && mediaType === 'image') {
            imagePart = {
                imageBytes: uploadedMedia.split(',')[1],
                mimeType: uploadedMedia.split(';')[0].split(':')[1]
            };
        }

        setLoadingProgress(10); // Start
        setLoadingStatus("Sending request...");

        let operation = await ai.models.generateVideos({
            model: 'veo-3.1-fast-generate-preview',
            prompt: videoPrompt,
            image: imagePart,
            config: {
                numberOfVideos: 1,
                resolution: '720p',
                aspectRatio: videoAspectRatio
            }
        });

        setLoadingProgress(20); // Request sent
        setLoadingStatus("Generating frames...");

        let pollingCount = 0;
        while (!operation.done) {
            pollingCount++;
            setLoadingProgress(prev => Math.min(95, 20 + (pollingCount * 5))); // Increment progress
            if (pollingCount > 2) setLoadingStatus("Compiling video...");
            if (pollingCount > 6) setLoadingStatus("Finalizing...");
            await new Promise(r => setTimeout(r, 4000));
            operation = await ai.operations.getVideosOperation({operation});
        }
        
        setLoadingProgress(100);
        setLoadingStatus("Complete!");

        const uri = operation.response?.generatedVideos?.[0]?.video?.uri;
        if (uri) setGeneratedVideo(`${uri}&key=${process.env.API_KEY}`);
        else throw new Error("No video generated.");

      } catch (e) { setError(analyzeError(e)); }
      finally { setLoading(false); setLoadingProgress(0); }
  };

  const handleAnalyze = async () => {
      if (!uploadedMedia) { setError({title: "No Media", message: "Upload an image or video first."}); return; }
      setLoading(true); setError(null);
      try {
        const ai = new GoogleGenAI({ apiKey: process.env.API_KEY });
        const base64Data = uploadedMedia.split(',')[1];
        const mimeType = uploadedMedia.split(';')[0].split(':')[1];
        
        // If video or thinking mode or search, use gemini-3-pro-preview
        const model = (mediaType === 'video' || isThinking || useSearch) ? 'gemini-3-pro-preview' : 'gemini-3-pro-preview';
        const tools = useSearch ? [{ googleSearch: {} }] : undefined;
        const thinkingConfig = isThinking ? { thinkingBudget: 32768 } : undefined;

        const response = await ai.models.generateContent({
            model: model,
            contents: {
                parts: [
                    { inlineData: { data: base64Data, mimeType } },
                    { text: analyzePrompt || "Analyze this media in detail. Describe what you see." }
                ]
            },
            config: { 
                tools, 
                thinkingConfig
            }
        });
        
        setAnalysisResult(response.text || "No analysis returned.");

      } catch (e) { setError(analyzeError(e)); }
      finally { setLoading(false); }
  };

  return (
    <div className={`min-h-screen flex flex-col items-center font-sans selection:bg-indigo-100 dark:selection:bg-indigo-900 transition-colors duration-300 ${darkMode ? 'bg-slate-950 text-slate-100' : 'bg-slate-50 text-slate-900'}`}>
      
      {/* Navigation Bar */}
      <nav className={`sticky top-0 z-50 w-full backdrop-blur-md border-b transition-colors duration-300 ${darkMode ? 'bg-slate-950/80 border-slate-800' : 'bg-white/80 border-slate-200'}`}>
          <div className="max-w-7xl mx-auto px-4 h-16 flex items-center justify-between">
            <div className="flex items-center gap-2 font-bold text-xl tracking-tight">
                <span className="bg-gradient-to-tr from-indigo-600 to-violet-500 text-white p-1.5 rounded-lg shadow-sm">
                    <SparklesIcon className="w-5 h-5" />
                </span>
                <span className="hidden sm:inline">Nyrix</span>
            </div>
            
            <div className="flex items-center gap-4">
                <div className="flex items-center gap-1 overflow-x-auto no-scrollbar">
                    {[
                        { id: 'enhance', label: 'Enhance', icon: MagicWandIcon },
                        { id: 'create-image', label: 'Create Image', icon: ImageIcon },
                        { id: 'create-video', label: 'Create Video', icon: VideoIcon },
                        { id: 'analyze', label: 'Analyze', icon: AnalyzeIcon },
                    ].map((item) => (
                        <button
                            key={item.id}
                            onClick={() => {
                                setMode(item.id as Mode);
                                setError(null);
                            }}
                            className={`flex items-center gap-2 px-4 py-2 rounded-full text-sm font-medium transition-all whitespace-nowrap
                                ${mode === item.id 
                                    ? 'bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 ring-1 ring-indigo-200 dark:ring-indigo-800 shadow-sm' 
                                    : 'text-slate-500 dark:text-slate-400 hover:text-slate-900 dark:hover:text-slate-200 hover:bg-slate-100/50 dark:hover:bg-slate-800/50'
                                }`}
                        >
                            <item.icon className="w-4 h-4" />
                            {item.label}
                        </button>
                    ))}
                </div>

                <button
                    onClick={() => setDarkMode(!darkMode)}
                    className={`p-2 rounded-full transition-all ${darkMode ? 'bg-slate-800 text-yellow-400 hover:bg-slate-700' : 'bg-slate-100 text-slate-600 hover:bg-slate-200'}`}
                    title={darkMode ? "Switch to Light Mode" : "Switch to Dark Mode"}
                >
                    {darkMode ? <SunIcon className="w-5 h-5" /> : <MoonIcon className="w-5 h-5" />}
                </button>
            </div>
          </div>
      </nav>

      <main className="w-full max-w-7xl mx-auto p-4 md:p-8 flex-1 grid grid-cols-1 lg:grid-cols-12 gap-8">
        
        {/* LEFT PANEL: CONTROLS */}
        <div className="lg:col-span-5 space-y-6">
            
            {/* Enhance / Video / Analyze: Image Upload */}
            {(mode === 'enhance' || mode === 'create-video' || mode === 'analyze') && (
                <div 
                    onClick={() => fileInputRef.current?.click()}
                    className={`relative group cursor-pointer border-2 border-dashed rounded-3xl p-8 transition-all h-64 flex flex-col items-center justify-center text-center overflow-hidden
                        ${uploadedMedia 
                            ? 'border-indigo-500/30 bg-white dark:bg-slate-900' 
                            : 'border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:border-indigo-500 hover:bg-indigo-50/30 dark:hover:bg-indigo-900/20'
                        }
                    `}
                >
                    <input 
                        type="file" 
                        ref={fileInputRef} 
                        onChange={handleFileChange} 
                        accept={mode === 'analyze' ? "image/*,video/*" : "image/*"} 
                        className="hidden" 
                    />
                    
                    {uploadedMedia ? (
                        <>
                            {mediaType === 'video' ? (
                                <video src={uploadedMedia} className="absolute inset-0 w-full h-full object-cover opacity-40 group-hover:opacity-20 transition-opacity" muted />
                            ) : (
                                <img src={uploadedMedia} alt="Upload" className="absolute inset-0 w-full h-full object-contain p-4 opacity-40 group-hover:opacity-20 transition-opacity" />
                            )}
                            <div className="z-10 bg-white/90 dark:bg-slate-800/90 backdrop-blur px-4 py-2 rounded-full shadow-sm text-sm font-medium text-slate-700 dark:text-slate-300 flex items-center gap-2">
                                <span className="w-2 h-2 rounded-full bg-green-500"></span> {mediaType === 'video' ? 'Video Loaded' : 'Image Loaded'}
                            </div>
                            <button 
                                onClick={(e) => { e.stopPropagation(); setUploadedMedia(null); setMediaType('image'); }}
                                className="z-10 mt-4 text-xs text-red-500 hover:underline"
                            >
                                Remove Media
                            </button>
                        </>
                    ) : (
                        <>
                            <div className="w-12 h-12 bg-indigo-50 dark:bg-indigo-900/30 text-indigo-600 dark:text-indigo-400 rounded-2xl flex items-center justify-center mb-4 group-hover:scale-110 transition-transform">
                                <UploadIcon width={24} height={24} />
                            </div>
                            <p className="font-medium text-slate-700 dark:text-slate-300">
                                {mode === 'create-video' ? "Upload optional image to animate" : 
                                 mode === 'analyze' ? "Upload an image or video" : "Upload an image"}
                            </p>
                            <p className="text-slate-400 dark:text-slate-500 text-sm mt-1 mb-3">
                                {mode === 'analyze' ? "JPG, PNG, WEBP, MP4" : "JPG, PNG, WEBP"}
                            </p>
                             <button
                                onClick={(e) => { e.stopPropagation(); loadExampleImage(); }}
                                className="z-10 text-xs bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-600 dark:text-slate-400 px-3 py-1.5 rounded-full transition-colors font-medium border border-slate-200 dark:border-slate-700"
                            >
                                Try Example
                            </button>
                        </>
                    )}
                </div>
            )}

            {/* MODE SPECIFIC CONTROLS */}

            {mode === 'enhance' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                        {ENHANCEMENT_STYLES.map((style) => (
                            <button
                                key={style.id}
                                onClick={() => setSelectedStyle(style)}
                                className={`relative p-4 rounded-2xl border text-left transition-all duration-300 overflow-hidden min-h-[90px] group
                                    ${selectedStyle.id === style.id 
                                        ? 'border-indigo-500 bg-indigo-50 dark:bg-indigo-900/20 ring-1 ring-indigo-500 shadow-md' 
                                        : 'border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 hover:border-indigo-300 dark:hover:border-indigo-500 hover:shadow-md'
                                    }
                                `}
                            >
                                {/* Gradient Blob Background */}
                                <div className={`absolute -right-6 -top-6 w-24 h-24 rounded-full bg-gradient-to-br ${style.color} opacity-10 group-hover:opacity-20 transition-opacity blur-xl`} />
                                <div className={`absolute -right-2 top-1/2 -translate-y-1/2 w-16 h-16 rounded-full bg-gradient-to-br ${style.color} opacity-5 group-hover:opacity-10 transition-opacity`} />

                                <div className="relative z-10 pr-10">
                                    <h4 className={`font-bold text-sm mb-1 ${selectedStyle.id === style.id ? 'text-indigo-900 dark:text-indigo-100' : 'text-slate-800 dark:text-slate-200'}`}>
                                        {style.title}
                                    </h4>
                                    <p className="text-xs text-slate-500 dark:text-slate-400 leading-relaxed line-clamp-2">
                                        {style.description}
                                    </p>
                                </div>

                                {/* Icon */}
                                <div className={`absolute top-4 right-4 transition-all duration-300 ${selectedStyle.id === style.id ? 'scale-110 opacity-100' : 'opacity-50 group-hover:opacity-100 group-hover:scale-110'}`}>
                                    {selectedStyle.id === style.id ? (
                                        <div className={`bg-gradient-to-br ${style.color} text-white p-1.5 rounded-lg shadow-sm`}>
                                            <style.icon className="w-4 h-4" />
                                        </div>
                                    ) : (
                                        <div className="p-1.5">
                                            <style.icon className={`w-5 h-5 text-slate-400 dark:text-slate-500`} />
                                        </div>
                                    )}
                                </div>
                            </button>
                        ))}
                    </div>

                    {selectedStyle.id === 'custom' && (
                        <div>
                            <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Custom Prompt</label>
                            <textarea 
                                value={customPrompt}
                                onChange={(e) => setCustomPrompt(e.target.value)}
                                placeholder="Describe the edit..."
                                className="w-full p-3 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm min-h-[100px] text-slate-900 dark:text-white"
                            />
                        </div>
                    )}

                    {/* CONTRAST SLIDER FOR BW NOIR */}
                    {selectedStyle.id === 'bw_noir' && (
                        <div className="animate-in fade-in slide-in-from-top-2">
                             <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                <span>Contrast</span>
                                <span>{contrastLevel}%</span>
                            </div>
                            <input 
                                type="range" 
                                min="0" 
                                max="100" 
                                value={contrastLevel} 
                                onChange={(e) => setContrastLevel(Number(e.target.value))} 
                                className="w-full accent-zinc-600 dark:accent-zinc-400 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" 
                            />
                        </div>
                    )}

                    <div>
                        <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                            <span>Intensity</span>
                            <span>{enhancementStrength}%</span>
                        </div>
                        <input type="range" min="0" max="100" value={enhancementStrength} onChange={(e) => setEnhancementStrength(Number(e.target.value))} className="w-full accent-indigo-600 h-2 bg-slate-200 dark:bg-slate-700 rounded-lg appearance-none cursor-pointer" />
                    </div>

                    <button
                        onClick={handleEnhance}
                        disabled={!uploadedMedia || loading}
                        className="w-full py-3 bg-indigo-600 hover:bg-indigo-700 dark:bg-indigo-500 dark:hover:bg-indigo-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-indigo-200 dark:shadow-indigo-900/30 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span> : <MagicWandIcon className="w-5 h-5" />}
                        Enhance Image
                    </button>
                </div>
            )}

            {mode === 'create-image' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Prompt</label>
                        <textarea 
                            value={imagePrompt}
                            onChange={(e) => setImagePrompt(e.target.value)}
                            placeholder="A futuristic city with flying cars, neon lights, 4k..."
                            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-indigo-500 focus:border-transparent outline-none text-sm min-h-[120px] text-slate-900 dark:text-white"
                        />
                    </div>
                    
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Image Size</label>
                        <div className="flex gap-2">
                            {['1K', '2K', '4K'].map((size) => (
                                <button
                                    key={size}
                                    onClick={() => setImageSize(size as any)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all
                                        ${imageSize === size 
                                            ? 'bg-indigo-600 text-white border-indigo-600' 
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-indigo-300'
                                        }
                                    `}
                                >
                                    {size}
                                </button>
                            ))}
                        </div>
                    </div>

                    <button
                        onClick={handleGenerateImage}
                        disabled={loading || !imagePrompt}
                        className="w-full py-3 bg-purple-600 hover:bg-purple-700 dark:bg-purple-500 dark:hover:bg-purple-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-purple-200 dark:shadow-purple-900/30 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span> : <ImageIcon className="w-5 h-5" />}
                        Generate Image
                    </button>
                </div>
            )}

            {mode === 'create-video' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Video Prompt</label>
                        <textarea 
                            value={videoPrompt}
                            onChange={(e) => setVideoPrompt(e.target.value)}
                            placeholder="A camera pans over a beautiful mountain landscape..."
                            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-pink-500 focus:border-transparent outline-none text-sm min-h-[120px] text-slate-900 dark:text-white"
                        />
                    </div>

                    <div>
                        <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Aspect Ratio</label>
                        <div className="flex gap-2">
                            {[
                                { id: '16:9', label: 'Landscape (16:9)' },
                                { id: '9:16', label: 'Portrait (9:16)' }
                            ].map((ratio) => (
                                <button
                                    key={ratio.id}
                                    onClick={() => setVideoAspectRatio(ratio.id as any)}
                                    className={`flex-1 py-2 rounded-lg text-sm font-medium border transition-all
                                        ${videoAspectRatio === ratio.id 
                                            ? 'bg-pink-600 text-white border-pink-600' 
                                            : 'bg-white dark:bg-slate-800 text-slate-600 dark:text-slate-300 border-slate-200 dark:border-slate-700 hover:border-pink-300'
                                        }
                                    `}
                                >
                                    {ratio.label}
                                </button>
                            ))}
                        </div>
                    </div>

                    <div className="bg-blue-50 dark:bg-blue-900/20 p-3 rounded-lg flex items-start gap-2 text-xs text-blue-700 dark:text-blue-300">
                        <span className="font-bold">Note:</span> 
                        Using Veo requires a paid API key. You will be prompted to select one.
                    </div>

                    <button
                        onClick={handleGenerateVideo}
                        disabled={loading || !videoPrompt}
                        className="w-full py-3 bg-pink-600 hover:bg-pink-700 dark:bg-pink-500 dark:hover:bg-pink-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-pink-200 dark:shadow-pink-900/30 transition-all flex items-center justify-center gap-2"
                    >
                        {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span> : <VideoIcon className="w-5 h-5" />}
                        Generate Video
                    </button>
                </div>
            )}

            {mode === 'analyze' && (
                <div className="space-y-6 animate-in fade-in slide-in-from-left-4 duration-500">
                    <div>
                         <label className="text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2 block">Question / Instruction</label>
                         <textarea 
                            value={analyzePrompt}
                            onChange={(e) => setAnalyzePrompt(e.target.value)}
                            placeholder="What is in this media? List the main colors..."
                            className="w-full p-4 rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 focus:ring-2 focus:ring-emerald-500 focus:border-transparent outline-none text-sm min-h-[100px] text-slate-900 dark:text-white"
                        />
                    </div>
                    
                    <div className="space-y-3">
                        <label className="flex items-center gap-3 p-4 bg-white dark:bg-slate-800 border border-slate-200 dark:border-slate-700 rounded-xl cursor-pointer hover:border-emerald-500 dark:hover:border-emerald-500 transition-colors">
                            <input type="checkbox" checked={useSearch} onChange={(e) => setUseSearch(e.target.checked)} className="w-5 h-5 accent-emerald-600 rounded" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm">
                                    <SearchIcon className="w-4 h-4" /> Use Google Search
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Get real-time information grounding.</p>
                            </div>
                        </label>

                        <label className={`flex items-center gap-3 p-4 border rounded-xl cursor-pointer transition-colors ${isThinking ? 'bg-indigo-50 dark:bg-indigo-900/20 border-indigo-300 dark:border-indigo-700' : 'bg-white dark:bg-slate-800 border-slate-200 dark:border-slate-700 hover:border-indigo-300'}`}>
                            <input type="checkbox" checked={isThinking} onChange={(e) => setIsThinking(e.target.checked)} className="w-5 h-5 accent-indigo-600 rounded" />
                            <div className="flex-1">
                                <div className="flex items-center gap-2 font-semibold text-slate-700 dark:text-slate-200 text-sm">
                                    <BrainIcon className={`w-4 h-4 ${isThinking ? 'text-indigo-600 dark:text-indigo-400' : 'text-slate-500'}`} /> 
                                    <span>Deep Reasoning (Thinking Mode)</span>
                                </div>
                                <p className="text-xs text-slate-500 dark:text-slate-400">Use Gemini 3.0 Pro for complex queries.</p>
                            </div>
                        </label>
                    </div>

                    <button
                        onClick={handleAnalyze}
                        disabled={!uploadedMedia || loading}
                        className="w-full py-3 bg-emerald-600 hover:bg-emerald-700 dark:bg-emerald-500 dark:hover:bg-emerald-600 disabled:opacity-50 disabled:cursor-not-allowed text-white rounded-xl font-semibold shadow-lg shadow-emerald-200 dark:shadow-emerald-900/30 transition-all flex items-center justify-center gap-2"
                    >
                         {loading ? <span className="animate-spin w-4 h-4 border-2 border-white/30 border-t-white rounded-full"></span> : <AnalyzeIcon className="w-5 h-5" />}
                        {isThinking ? 'Deep Analyze' : 'Analyze'}
                    </button>
                </div>
            )}

            {error && (
                <div className="p-4 bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 rounded-xl text-red-700 dark:text-red-300 text-sm flex items-start gap-3 animate-in fade-in slide-in-from-top-2">
                    <div className="mt-0.5 text-red-500 shrink-0">
                         <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10"/><line x1="12" x2="12" y1="8" y2="12"/><line x1="12" x2="12.01" y1="16" y2="16"/></svg>
                    </div>
                    <div>
                        <h4 className="font-bold mb-1">{error.title}</h4>
                        <p className="mb-2 opacity-90">{error.message}</p>
                        {error.suggestion && <p className="text-red-700 dark:text-red-300 text-xs font-semibold bg-red-100/80 dark:bg-red-800/40 px-2 py-1 rounded inline-block">Tip: {error.suggestion}</p>}
                    </div>
                </div>
            )}

        </div>

        {/* RIGHT PANEL: RESULT */}
        <div className="lg:col-span-7">
            <div className="bg-white dark:bg-slate-900 rounded-3xl border border-slate-200 dark:border-slate-800 shadow-xl shadow-slate-200/50 dark:shadow-black/50 min-h-[350px] lg:min-h-[500px] h-full overflow-hidden flex flex-col relative transition-colors">
                
                {/* Result Views */}
                {mode === 'enhance' && (
                    <div className="flex-1 relative">
                        {enhancedImage && uploadedMedia && mediaType === 'image' ? (
                            viewMode === 'slider' ? (
                                <ImageComparison before={uploadedMedia} after={enhancedImage} />
                            ) : (
                                <div className="grid grid-cols-2 h-full">
                                    <div className="relative border-r border-white/20">
                                        <img src={uploadedMedia} className="w-full h-full object-contain bg-slate-100 dark:bg-slate-950" />
                                        <span className="absolute top-2 left-2 bg-black/50 text-white text-xs px-2 py-1 rounded">Original</span>
                                    </div>
                                    <div className="relative">
                                         <img src={enhancedImage} className="w-full h-full object-contain bg-slate-100 dark:bg-slate-950" />
                                         <span className="absolute top-2 left-2 bg-indigo-600 text-white text-xs px-2 py-1 rounded">Enhanced</span>
                                    </div>
                                </div>
                            )
                        ) : (
                            <div className="absolute inset-0 flex items-center justify-center text-slate-400 dark:text-slate-600">
                                <p>Enhancement preview will appear here</p>
                            </div>
                        )}
                        
                        {/* View Toggle */}
                        {enhancedImage && (
                            <div className="absolute top-4 right-4 flex bg-white/90 dark:bg-slate-800/90 backdrop-blur rounded-full p-1 border border-slate-200 dark:border-slate-700 shadow-sm z-30">
                                <button onClick={() => setViewMode('slider')} className={`p-1.5 rounded-full ${viewMode === 'slider' ? 'bg-indigo-600 text-white' : 'text-slate-400 dark:text-slate-500'}`}><SliderIcon width={16} /></button>
                                <button onClick={() => setViewMode('side-by-side')} className={`p-1.5 rounded-full ${viewMode === 'side-by-side' ? 'bg-indigo-600 text-white' : 'text-slate-400 dark:text-slate-500'}`}><SideBySideIcon width={16} /></button>
                            </div>
                        )}
                        
                        {/* Download */}
                         {enhancedImage && (
                             <div className="absolute bottom-4 right-4 z-30">
                                 <a href={enhancedImage} download="enhanced.png" className="bg-white hover:bg-slate-50 dark:bg-slate-800 dark:hover:bg-slate-700 text-indigo-600 dark:text-indigo-400 px-4 py-2 rounded-full shadow-lg font-semibold text-sm flex items-center gap-2 transition-all">
                                    <DownloadIcon width={16} /> Download
                                 </a>
                             </div>
                         )}

                         {/* History Controls */}
                         {history.length > 0 && (
                             <div className="absolute bottom-4 left-4 z-30 flex gap-2">
                                <button onClick={() => setHistoryIndex(i => Math.max(-1, i-1))} disabled={historyIndex < 0} className="p-2 bg-white dark:bg-slate-800 rounded-full shadow disabled:opacity-50 text-slate-700 dark:text-slate-300"><UndoIcon width={16} /></button>
                                <button onClick={() => setHistoryIndex(i => Math.min(history.length-1, i+1))} disabled={historyIndex >= history.length - 1} className="p-2 bg-white dark:bg-slate-800 rounded-full shadow disabled:opacity-50 text-slate-700 dark:text-slate-300"><RedoIcon width={16} /></button>
                             </div>
                         )}
                    </div>
                )}

                {mode === 'create-image' && (
                    <div className="flex-1 flex items-center justify-center bg-slate-50 dark:bg-slate-950/50 relative p-4">
                        {generatedImage ? (
                            <div className="relative w-full h-full flex items-center justify-center">
                                <img src={generatedImage} alt="Generated" className="max-w-full max-h-full rounded-lg shadow-lg object-contain" />
                                <a href={generatedImage} download="generated.png" className="absolute bottom-4 right-4 bg-white/90 hover:bg-white text-purple-600 px-4 py-2 rounded-full shadow-lg font-semibold text-sm flex items-center gap-2 backdrop-blur">
                                    <DownloadIcon width={16} /> Download
                                </a>
                            </div>
                        ) : (
                            <div className="text-center text-slate-400 dark:text-slate-600">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <ImageIcon className="w-8 h-8 opacity-50" />
                                </div>
                                <p>Your masterpiece will appear here</p>
                            </div>
                        )}
                    </div>
                )}

                {mode === 'create-video' && (
                    <div className="flex-1 flex items-center justify-center bg-black relative p-4">
                        {generatedVideo ? (
                            <div className="w-full h-full flex flex-col items-center justify-center">
                                <video src={generatedVideo} controls autoPlay loop className="max-w-full max-h-[80%] rounded-lg shadow-lg" />
                                <div className="mt-6">
                                     <a href={generatedVideo} download="video.mp4" className="bg-white/10 hover:bg-white/20 text-white px-6 py-2 rounded-full border border-white/20 font-semibold text-sm flex items-center gap-2 transition-all">
                                        <DownloadIcon width={16} /> Download Video
                                    </a>
                                </div>
                            </div>
                        ) : (
                            <div className="text-center text-slate-600 dark:text-slate-500">
                                <div className="w-16 h-16 bg-slate-900 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <VideoIcon className="w-8 h-8 text-slate-700" />
                                </div>
                                <p>Video preview area</p>
                            </div>
                        )}
                    </div>
                )}

                {mode === 'analyze' && (
                     <div className="flex-1 p-8 overflow-y-auto">
                        {analysisResult ? (
                            <div className="prose prose-slate dark:prose-invert max-w-none">
                                <h3 className="flex items-center gap-2 text-emerald-600 dark:text-emerald-400 font-bold mb-6">
                                    <AnalyzeIcon className="w-5 h-5" /> Analysis Result
                                </h3>
                                <ReactMarkdown>{analysisResult}</ReactMarkdown>
                            </div>
                        ) : (
                             <div className="h-full flex flex-col items-center justify-center text-slate-400 dark:text-slate-600 text-center">
                                <div className="w-16 h-16 bg-slate-100 dark:bg-slate-800 rounded-full flex items-center justify-center mx-auto mb-4">
                                    <AnalyzeIcon className="w-8 h-8 opacity-50" />
                                </div>
                                <p>AI analysis insights will appear here</p>
                            </div>
                        )}
                     </div>
                )}

                {/* Visual Loading Overlay */}
                {loading && (
                    <div className="absolute inset-0 bg-white/90 dark:bg-slate-900/90 backdrop-blur-2xl z-50 flex flex-col items-center justify-center transition-all duration-500 overflow-hidden rounded-3xl">
                        <style>{`
                            @keyframes shimmer {
                                0% { transform: translateX(-100%); }
                                100% { transform: translateX(100%); }
                            }
                            @keyframes float {
                                0%, 100% { transform: translateY(0); }
                                50% { transform: translateY(-10px); }
                            }
                            @keyframes pulse-ring {
                                0% { transform: scale(0.8); opacity: 0.5; }
                                100% { transform: scale(1.5); opacity: 0; }
                            }
                                @keyframes scan {
                                0% { transform: translateY(-100%); opacity: 0; }
                                50% { opacity: 1; }
                                100% { transform: translateY(100%); opacity: 0; }
                            }
                                @keyframes scan-laser {
                                0% { top: -10%; opacity: 0; }
                                20% { opacity: 1; }
                                80% { opacity: 1; }
                                100% { top: 110%; opacity: 0; }
                            }
                            @keyframes spin-slow {
                                from { transform: rotate(0deg); }
                                to { transform: rotate(360deg); }
                            }
                            @keyframes progress-stripes {
                                from { background-position: 1rem 0; }
                                to { background-position: 0 0; }
                            }
                            .animate-shimmer {
                                animation: shimmer 2s infinite linear;
                            }
                            .animate-float {
                                animation: float 3s ease-in-out infinite;
                            }
                            .animate-pulse-ring {
                                animation: pulse-ring 2s cubic-bezier(0.4, 0, 0.6, 1) infinite;
                            }
                            .animate-scan {
                                animation: scan 2s linear infinite;
                            }
                            .animate-scan-laser {
                                animation: scan-laser 2s ease-in-out infinite;
                            }
                            .animate-spin-slow {
                                animation: spin-slow 8s linear infinite;
                            }
                            .animate-progress-stripes {
                                background-image: linear-gradient(45deg,rgba(255,255,255,.15) 25%,transparent 25%,transparent 50%,rgba(255,255,255,.15) 50%,rgba(255,255,255,.15) 75%,transparent 75%,transparent);
                                background-size: 1rem 1rem;
                                animation: progress-stripes 1s linear infinite;
                            }
                        `}</style>
                        
                        {/* Dynamic Background Mesh */}
                        <div className={`absolute inset-0 bg-gradient-to-br ${
                                mode === 'enhance' ? selectedStyle.color : 
                                mode === 'create-image' ? 'from-purple-100 to-indigo-100' : 
                                mode === 'create-video' ? 'from-pink-100 to-rose-100' : 
                                'from-emerald-100 to-teal-100'
                        } opacity-40 dark:opacity-20 transition-colors duration-1000`}></div>
                        
                        {/* Ambient Orbs - Animated */}
                            <div className={`absolute top-1/4 left-1/4 w-96 h-96 bg-gradient-to-r ${mode === 'enhance' ? selectedStyle.color : 'from-indigo-400 to-purple-400'} rounded-full blur-[120px] opacity-30 dark:opacity-20 animate-pulse`}></div>
                            <div className={`absolute bottom-1/4 right-1/4 w-96 h-96 bg-gradient-to-r ${mode === 'enhance' ? selectedStyle.color : 'from-blue-400 to-cyan-400'} rounded-full blur-[120px] opacity-30 dark:opacity-20 animate-pulse delay-700`}></div>

                        <div className="relative z-10 w-full max-w-sm p-8 bg-white/60 dark:bg-slate-800/60 border border-white/80 dark:border-slate-700/80 shadow-2xl rounded-[2rem] backdrop-blur-xl flex flex-col items-center ring-1 ring-white/50 dark:ring-slate-700/50">
                                
                                {/* Icon Animation Container */}
                                <div className="relative mb-8">
                                {/* Rings */}
                                <div className={`absolute inset-0 bg-gradient-to-tr ${mode === 'enhance' ? selectedStyle.color : (mode === 'create-image' ? 'from-purple-500 to-indigo-500' : (mode === 'create-video' ? 'from-pink-500 to-rose-500' : 'from-emerald-500 to-teal-500'))} rounded-full blur-2xl opacity-50 animate-pulse-ring`}></div>
                                
                                {/* Center Icon Bubble */}
                                <div className="relative w-32 h-32 bg-white dark:bg-slate-900 rounded-[2rem] shadow-xl flex items-center justify-center ring-4 ring-white/40 dark:ring-slate-700/40 animate-float overflow-hidden group">
                                        
                                        {/* Thumbnail Preview for Enhance/Analyze */}
                                        {uploadedMedia && (mode === 'enhance' || mode === 'analyze' || (mode === 'create-video' && mediaType === 'image')) && (
                                            <div className="absolute inset-0 z-0 opacity-40 grayscale group-hover:grayscale-0 transition-all duration-700">
                                            <img src={uploadedMedia} className="w-full h-full object-cover blur-[1px] scale-110" alt="Processing" />
                                            <div className="absolute inset-0 bg-white/10 dark:bg-black/20"></div>
                                            </div>
                                        )}

                                        {/* Video Mode: Spinning Dashed Ring */}
                                        {mode === 'create-video' && (
                                            <div className="absolute inset-3 border-4 border-dashed border-pink-500/50 rounded-full animate-spin-slow z-10"></div>
                                        )}

                                        {/* Scan Line Effect */}
                                        {(selectedStyle.id === 'cyber' || selectedStyle.id === 'clarity_boost' || mode === 'analyze' || mode === 'enhance') && (
                                            <div className="absolute left-0 right-0 h-[2px] bg-white/80 shadow-[0_0_15px_rgba(255,255,255,0.8)] animate-scan-laser z-20"></div>
                                        )}

                                        <div className="relative z-30 scale-110 drop-shadow-xl bg-white/20 dark:bg-black/20 p-3 rounded-2xl backdrop-blur-sm">
                                        {isThinking ? <BrainIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-pulse" /> : 
                                            mode === 'create-video' ? <VideoIcon className="w-10 h-10 text-pink-500 dark:text-pink-400 animate-pulse" /> :
                                            mode === 'create-image' ? <ImageIcon className="w-10 h-10 text-purple-500 dark:text-purple-400 animate-bounce" /> :
                                            mode === 'analyze' ? <AnalyzeIcon className="w-10 h-10 text-emerald-500 dark:text-emerald-400 animate-pulse" /> :
                                            (selectedStyle.icon ? <selectedStyle.icon className={`w-10 h-10 text-indigo-600 dark:text-indigo-400 ${selectedStyle.id === 'fantastic_hd' ? 'animate-spin' : 'animate-pulse'}`} style={{animationDuration: selectedStyle.id === 'fantastic_hd' ? '3s' : '2s'}} /> : <SparklesIcon className="w-10 h-10 text-indigo-600 dark:text-indigo-400 animate-pulse" />)}
                                        </div>
                                </div>
                                </div>

                                {/* Dynamic Title */}
                                <h3 className="text-2xl font-bold text-slate-800 dark:text-slate-100 mb-2 tracking-tight">
                                {isThinking ? 'Deep Reasoning...' :
                                    mode === 'enhance' ? 'Enhancing...' : 
                                    mode === 'create-image' ? 'Creating Art' :
                                    mode === 'create-video' ? 'Generating Video' : 'Analyzing'}
                                </h3>

                                {/* Status Text with Style Info */}
                                <div className="h-8 mb-6 flex items-center justify-center text-center w-full">
                                    <p className="text-sm font-medium text-slate-600 dark:text-slate-300 bg-white/70 dark:bg-slate-800/70 px-6 py-1.5 rounded-full shadow-sm animate-pulse border border-white/60 dark:border-slate-700/60 backdrop-blur-sm truncate max-w-full">
                                        {loadingStatus}
                                    </p>
                                </div>
                                
                                {/* Detailed Progress Bar */}
                                <div className="w-full relative">
                                <div className="flex justify-between text-xs font-bold text-slate-500 dark:text-slate-400 uppercase tracking-wider mb-2">
                                    <span>Progress</span>
                                    <span>{Math.round(loadingProgress)}%</span>
                                </div>
                                <div className="w-full h-3 bg-slate-200/60 dark:bg-slate-700/60 rounded-full overflow-hidden relative shadow-inner ring-1 ring-black/5">
                                    {/* Progress Bar Fill with Stripes */}
                                    <div 
                                        className={`h-full rounded-full transition-all duration-500 ease-out relative overflow-hidden bg-gradient-to-r ${mode === 'enhance' ? selectedStyle.color : (mode === 'create-image' ? 'from-purple-500 to-indigo-500' : (mode === 'create-video' ? 'from-pink-500 to-rose-500' : 'from-emerald-500 to-teal-500'))} animate-progress-stripes`}
                                        style={{ width: `${loadingProgress}%` }}
                                    >
                                        <div className="absolute inset-0 bg-white/40 w-full -translate-x-full animate-shimmer"></div>
                                    </div>
                                </div>
                                </div>

                                <div className="mt-6 text-xs text-slate-500 dark:text-slate-400 text-center max-w-[260px] leading-relaxed opacity-80">
                                    {isThinking ? "Using Gemini 3.0 Pro's advanced reasoning capabilities. This may take a moment." :
                                    mode === 'create-video' 
                                    ? "Video generation involves complex cloud rendering. This process can take a minute or two." 
                                    : mode === 'enhance'
                                    ? "Applying advanced AI filters to upscale and refine your image."
                                    : "Using Gemini AI to process your request."}
                                </div>
                        </div>
                    </div>
                )}
            </div>
        </div>
      </main>

      <footer className="w-full border-t border-slate-200 dark:border-slate-800 bg-white/50 dark:bg-slate-900/50 backdrop-blur-sm mt-auto transition-colors">
        <div className="max-w-7xl mx-auto px-4 py-6 flex flex-col md:flex-row justify-between items-center gap-4 text-sm text-slate-500 dark:text-slate-400">
          <div className="flex items-center gap-1">
             <span>Created by</span>
             <span className="font-semibold text-slate-700 dark:text-slate-300">Avinash Sharma</span>
          </div>
          <div className="flex items-center gap-2">
             <span>Email:</span>
             <a href="mailto:om157158@gmail.com" className="text-indigo-600 hover:text-indigo-700 dark:text-indigo-400 dark:hover:text-indigo-300 font-medium transition-colors">
               om157158@gmail.com
             </a>
          </div>
        </div>
      </footer>
    </div>
  );
}

const root = createRoot(document.getElementById("root")!);
root.render(<App />);