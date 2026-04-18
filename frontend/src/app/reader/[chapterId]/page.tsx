"use client";

import { useEffect, useState, useRef } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { CommentSection } from "@/components/Community/CommentSection";
import { ChevronLeft, Loader2 } from "lucide-react";
import { toast } from "sonner";
import Link from "next/link";

export default function ReaderPage() {
  const params = useParams();
  const chapterId = params.chapterId as string;
  const router = useRouter();
  const { token, isLoading: authLoading } = useAuth();
  
  const [chapterDetails, setChapterDetails] = useState<any>(null);
  const [images, setImages] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Hidden Nav on scroll
  const [showNav, setShowNav] = useState(true);
  const lastScrollY = useRef(0);

  useEffect(() => {
    if (authLoading) return;
    fetchChapterData();

    const handleScroll = () => {
      const currentScrollY = window.scrollY;
      if (currentScrollY > lastScrollY.current && currentScrollY > 50) {
        setShowNav(false); // scrolling down
      } else {
        setShowNav(true); // scrolling up
      }
      lastScrollY.current = currentScrollY;
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, [chapterId, token, authLoading]);

  const fetchChapterData = async () => {
    try {
      // Backend automatically checks Purchases logic here
      const data = await api.get(`/chapters/${chapterId}`, token || undefined);
      setChapterDetails(data.chapter);
      setImages(data.images);
    } catch (err: any) {
      if (err.message === "PurchaseRequired" || err.message.includes("403")) {
          toast.error("You need to purchase this story to read this chapter.");
          // Could pull the storyId from the error if we attached it properly in the backend, but basic fallback works:
          router.back(); 
      } else {
          toast.error(err.message || "Failed to load chapter");
          router.push("/");
      }
    } finally {
      setLoading(false);
    }
  };

  if (loading || authLoading) {
    return (
      <div className="h-screen w-full flex flex-col items-center justify-center bg-black">
        <Loader2 className="animate-spin h-10 w-10 text-primary mb-4" />
        <p className="text-muted-foreground animate-pulse">Loading Chapter...</p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#111] text-zinc-300">
      {/* Sticky Reader Navbar */}
      <nav 
        className={`fixed top-0 left-0 right-0 z-50 bg-[#1a1a1a]/95 backdrop-blur-md border-b border-zinc-800 transition-transform duration-300 ${
          showNav ? "translate-y-0" : "-translate-y-full"
        }`}
      >
        <div className="container mx-auto px-4 h-14 flex items-center justify-between">
           <Link href={`/story/${chapterDetails?.storyId}`} className={buttonVariants({ variant: "ghost", size: "sm", className: "text-zinc-300 hover:text-white hover:bg-zinc-800" })}>
               <ChevronLeft className="h-5 w-5 mr-1" />
               Exit
           </Link>
           <div className="font-bold text-sm tracking-widest text-center truncate px-4">
             CHAPTER {chapterDetails?.chapterNumber} <span className="opacity-50 mx-2">|</span> {chapterDetails?.title}
           </div>
           <div className="w-[72px]"></div> {/* spacer for centering */}
        </div>
      </nav>

      {/* Comic Pages Container */}
      <main className="w-full max-w-[800px] mx-auto pt-14 pb-20 select-none">
        {images.length === 0 ? (
           <div className="text-center py-32 text-zinc-500">
              No pages uploaded yet.
           </div>
        ) : (
           <div className="flex flex-col w-full bg-black">
             {images.map((img) => (
               <img 
                 key={img.id}
                 src={img.imageUrl} 
                 alt={`Page ${img.pageNumber}`}
                 className="w-full h-auto block object-cover"
                 loading="lazy"
               />
             ))}
           </div>
        )}

        <div className="text-center py-12 text-zinc-600 font-bold tracking-widest uppercase">
          End of Chapter
        </div>

        <div className="px-4 pb-20 border-t border-zinc-800 mt-12 bg-black/50">
           <CommentSection chapterId={chapterId} />
        </div>
      </main>
    </div>
  );
}
