"use client";

import { useEffect, useState } from "react";
import Link from "next/link";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { Dialog, DialogContent, DialogDescription, DialogHeader, DialogTitle } from "@/components/ui/dialog";
import { Separator } from "@/components/ui/separator";
import { CommentSection } from "@/components/Community/CommentSection";
import { ChevronLeft, Lock, Unlock, Play, Loader2 } from "lucide-react";
import { toast } from "sonner";

export default function StoryDetailPage() {
  const params = useParams();
  const storyId = params.id as string;
  const router = useRouter();
  const { user, token, isLoading: authLoading } = useAuth();
  
  const [story, setStory] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Payment state
  const [isPurchaseModalOpen, setIsPurchaseModalOpen] = useState(false);
  const [isProcessing, setIsProcessing] = useState(false);

  useEffect(() => {
    fetchData();
    // Increment view count
    api.post(`/stories/${storyId}/view`).catch(err => console.error("View tracking error:", err));
  }, [storyId, token]); // Re-fetch when token loads to re-validate access headers

  const fetchData = async () => {
    try {
      // Pass token if exists, so backend might eventually tell us purchase status
      const storyData = await api.get(`/stories/${storyId}`, token || undefined);
      setStory(storyData);

      const chaptersData = await api.get(`/chapters/story/${storyId}`, token || undefined);
      setChapters(chaptersData);
    } catch (err: any) {
      toast.error(err.message || "Failed to load story");
    } finally {
      setLoading(false);
    }
  };

  const handleReadChapter = async (chap: any) => {
    if (chap.isFree || user?.role === "Admin") {
      router.push(`/reader/${chap.id}`);
      return;
    }

    if (!user) {
      toast.error("Please login to read locked chapters.");
      router.push("/login");
      return;
    }

    // Try to navigate. If forbidden, trigger purchase modal via catch.
    try {
      await api.get(`/chapters/${chap.id}`, token!);
      router.push(`/reader/${chap.id}`);
    } catch (err: any) {
       if (err.message === "PurchaseRequired") {
          setIsPurchaseModalOpen(true);
       } else {
          toast.error(err.message);
       }
    }
  };

  const handlePurchase = async () => {
    setIsProcessing(true);
    try {
      const res = await api.post("/payments/checkout", { storyId }, token!);
      toast.success(res.message);
      setIsPurchaseModalOpen(false);
      // Wait for toast, then reload chapter accesses
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsProcessing(false);
    }
  };

  if (loading || authLoading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;
  if (!story) return <div className="p-20 text-center">Story not found or not published.</div>;

  const firstChapter = chapters.length > 0 ? chapters[0] : null;

  return (
    <main className="container mx-auto py-8 px-4 min-h-[calc(100vh-4rem)] max-w-4xl">
      <Link href="/" className={buttonVariants({ variant: "ghost", className: "mb-6" })}>
        <ChevronLeft className="h-4 w-4 mr-2" /> Back to Library
      </Link>
      
      <div className="flex flex-col md:flex-row gap-8 mb-12">
        <div className="w-full md:w-1/3 shrink-0 relative aspect-[2/3] rounded-lg overflow-hidden bg-muted border shadow-sm">
           {story.coverImageUrl ? (
             <img src={story.coverImageUrl} alt={story.title} className="object-cover w-full h-full" />
           ) : (
             <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No Cover</div>
           )}
        </div>
        <div className="space-y-4">
          <h1 className="text-4xl font-extrabold tracking-tight">{story.title}</h1>
          <div className="inline-block px-3 py-1 bg-primary/10 text-primary font-bold rounded-full text-sm">
            {story.price > 0 ? `Full Access: $${story.price.toFixed(2)}` : "Free to Read"}
          </div>
          <div className="pt-4 border-t whitespace-pre-wrap text-muted-foreground leading-relaxed">
            {story.description || "No description provided."}
          </div>
          <div className="pt-4 flex items-center gap-4">
            {firstChapter && (
              <Button size="lg" onClick={() => handleReadChapter(firstChapter)}>
                 <Play className="h-4 w-4 mr-2" /> Read First Chapter
              </Button>
            )}
            {story.price > 0 && user && user.role !== "Admin" && (
              <Button size="lg" variant="secondary" onClick={() => setIsPurchaseModalOpen(true)}>
                 Purchase Full Access
              </Button>
            )}
          </div>
        </div>
      </div>

      {/* LORE GRAPH PROMO/BANNER */}
      <div className="mb-12 p-6 border rounded-xl bg-gradient-to-r from-background to-muted/50 shadow-sm flex flex-col md:flex-row items-center justify-between gap-4">
         <div>
            <h3 className="text-xl font-extrabold tracking-tight">Immersive Character Lore</h3>
            <p className="text-muted-foreground mt-1 text-sm">Explore the tangled relationships and hidden pasts of the characters in this series through our interactive node graph.</p>
         </div>
         <Link href={`/story/${storyId}/lore`} className={buttonVariants({ variant: "outline" })}>
           Launch Lore Viewer
         </Link>
      </div>

      <div className="space-y-4">
        <h2 className="text-2xl font-bold tracking-tight mb-6">Chapters</h2>
        
        {chapters.length === 0 ? (
          <div className="p-8 text-center text-muted-foreground border rounded-lg bg-card/30">
            No chapters are currently available. Check back later.
          </div>
        ) : (
          <div className="grid gap-3">
             {chapters.map((ch: any) => (
                <div key={ch.id} className="flex items-center justify-between p-4 border rounded-lg bg-card shadow-sm hover:shadow transition-shadow">
                  <div className="flex items-center gap-4">
                     <div className="flex items-center justify-center h-12 w-12 rounded-full bg-muted font-bold text-muted-foreground">
                        {ch.chapterNumber}
                     </div>
                     <div>
                       <h3 className="font-bold">{ch.title}</h3>
                       <p className="text-xs text-muted-foreground">{new Date(ch.createdAt).toLocaleDateString()}</p>
                     </div>
                  </div>
                  <div>
                    {ch.isFree || user?.role === "Admin" ? (
                       <Button variant="outline" size="sm" onClick={() => handleReadChapter(ch)}>
                          <Unlock className="h-4 w-4 mr-2" /> Free
                       </Button>
                    ) : (
                       <Button variant="secondary" size="sm" onClick={() => handleReadChapter(ch)}>
                          <Lock className="h-4 w-4 mr-2" /> Locked
                       </Button>
                    )}
                  </div>
                </div>
             ))}
          </div>
        )}
      </div>

      <Separator className="my-16" />

      <CommentSection storyId={storyId} />

      <Dialog open={isPurchaseModalOpen} onOpenChange={setIsPurchaseModalOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Unlock Full Access</DialogTitle>
            <DialogDescription>
               Purchase "{story.title}" to unlock all chapters forever!
            </DialogDescription>
          </DialogHeader>
          <div className="py-6 flex flex-col items-center border rounded-md bg-muted/30">
             <span className="text-4xl font-extrabold text-primary">${story.price.toFixed(2)}</span>
             <span className="text-sm text-muted-foreground mt-2">One-time payment</span>
          </div>
          <div className="flex justify-end gap-3 mt-4">
             <Button variant="outline" onClick={() => setIsPurchaseModalOpen(false)}>Cancel</Button>
             <Button onClick={handlePurchase} disabled={isProcessing}>
               {isProcessing ? <Loader2 className="mr-2 h-4 w-4 animate-spin" /> : <Lock className="mr-2 h-4 w-4" />}
               Confirm Purchase
             </Button>
          </div>
        </DialogContent>
      </Dialog>
    </main>
  );
}
