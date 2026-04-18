"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { Card, CardContent } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { MessageSquare, Heart, Share2, Clock, Sparkles, X } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";
import { Dialog, DialogContent, DialogHeader, DialogTitle } from "@/components/ui/dialog";

export function CreatorFeed({ compact = false }: { compact?: boolean }) {
  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedPost, setSelectedPost] = useState<any | null>(null);

  useEffect(() => {
    fetchPosts();
  }, []);

  const fetchPosts = async () => {
    try {
      const data = await api.get("/news");
      setPosts(data || []);
    } catch (err) {
      console.error("Feed Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  if (loading) return (
    <div className="space-y-6">
      {[1, 2, 3].map(i => (
        <div key={i} className="h-48 bg-zinc-900 border-2 border-white/5 rounded-[2.5rem] animate-pulse" />
      ))}
    </div>
  );

  if (posts.length === 0) return (
    <motion.div 
      initial={{ opacity: 0, scale: 0.9 }}
      animate={{ opacity: 1, scale: 1 }}
      className="p-16 text-center border-4 border-dashed border-white/5 rounded-[3rem] bg-card/40"
    >
       <Sparkles className="h-10 w-10 text-accent mx-auto mb-4 animate-pulse" />
       <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-[10px]">Transmission Silence</p>
    </motion.div>
  );

  return (
    <div className="w-full">
      <AnimatePresence>
        <div className="grid grid-cols-1 gap-6">
          {posts.map((post, idx) => (
            <motion.div
              key={post.id}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              transition={{ delay: idx * 0.1, duration: 0.8 }}
              viewport={{ once: true }}
              onClick={() => setSelectedPost(post)}
              className="cursor-pointer"
            >
              <Card className="comfort-card overflow-hidden hover:border-accent/40 transition-all duration-500 shadow-2xl group/card border-2 border-white/5 bg-background/40 backdrop-blur-sm">
                <CardContent className="p-6">
                     <div className="flex items-center gap-4 mb-4">
                       <div className="h-10 w-10 rounded-lg border border-white/10 overflow-hidden bg-background shrink-0">
                           <Avatar className="h-full w-full rounded-none">
                             <AvatarImage src={post.creator.avatarUrl || undefined} />
                             <AvatarFallback className="bg-secondary text-[10px] font-black">{post.creator.displayName?.[0] || 'R'}</AvatarFallback>
                           </Avatar>
                       </div>
                       <div className="flex-1 min-w-0">
                           <div className="flex items-center gap-2">
                             <h4 className="font-black text-[12px] uppercase italic truncate">{post.creator.displayName || "Rezzkiel Prime"}</h4>
                             <span className="text-[7px] font-black uppercase tracking-[0.1em] text-accent px-1.5 py-0.5 border border-accent/20 rounded-md bg-accent/5 shrink-0">CREATOR</span>
                           </div>
                           <div className="flex items-center text-[8px] text-zinc-500 font-bold uppercase tracking-widest">
                             <Clock className="h-2 w-2 mr-1" /> {new Date(post.createdAt).toLocaleDateString()}
                           </div>
                       </div>
                     </div>
   
                     <div className="space-y-3">
                       <h3 className="text-lg font-black italic tracking-tighter uppercase leading-tight group-hover/card:text-accent transition-colors">{post.title}</h3>
                       <p className="text-zinc-400 text-xs leading-relaxed line-clamp-3 font-medium">{post.content}</p>
                       
                       {post.imageUrl && (
                           <div className="relative aspect-video rounded-2xl overflow-hidden bg-black/20 border border-white/5 mt-3 shadow-lg group">
                             <img 
                                 src={post.imageUrl || undefined} 
                                 className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" 
                                 alt="Transmission Media" 
                             />
                             <div className="absolute inset-0 bg-gradient-to-t from-background/40 to-transparent opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                                <div className="px-3 py-1.5 bg-black/60 backdrop-blur-md rounded-full text-[8px] font-black uppercase tracking-widest text-white border border-white/20">Expand Protocol</div>
                             </div>
                           </div>
                       )}
                     </div>
   
                     <div className="flex items-center gap-4 mt-4 pt-4 border-t border-white/5 text-zinc-500">
                       <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest">
                         <Heart className="h-3.5 w-3.5" /> {Math.floor(Math.random() * 50)}
                       </div>
                       <div className="flex items-center gap-1.5 text-[8px] font-black uppercase tracking-widest">
                         <MessageSquare className="h-3.5 w-3.5" /> {post.comments?.length || 0}
                       </div>
                       <div className="ml-auto">
                          <Share2 className="h-3 w-3" />
                       </div>
                     </div>
                </CardContent>
              </Card>
            </motion.div>
          ))}
        </div>
      </AnimatePresence>

      <Dialog open={!!selectedPost} onOpenChange={(open) => !open && setSelectedPost(null)}>
         <DialogContent className="max-w-[95vw] lg:max-w-7xl w-full h-auto max-h-[90vh] p-0 overflow-hidden bg-background/95 backdrop-blur-2xl border-white/10 shadow-[0_0_100px_rgba(0,0,0,0.8)] rounded-[2rem]">
            <div className="flex flex-col lg:flex-row h-full max-h-[90vh]">
               {/* Media Section (Dominant) */}
               <div className="flex-1 bg-black/60 flex items-center justify-center p-2 md:p-6 relative overflow-hidden min-h-[300px] lg:min-h-0">
                  {selectedPost?.imageUrl ? (
                    <motion.img 
                      initial={{ scale: 0.95, opacity: 0 }}
                      animate={{ scale: 1, opacity: 1 }}
                      src={selectedPost.imageUrl} 
                      className="w-auto h-auto max-w-full max-h-[85vh] object-contain rounded-lg shadow-2xl relative z-10"
                    />
                  ) : (
                    <div className="flex flex-col items-center gap-4 text-zinc-800">
                       <Sparkles className="h-16 w-16 animate-pulse" />
                       <span className="font-black uppercase tracking-[0.5em] text-[10px]">Pure Data Stream</span>
                    </div>
                  )}
                  
                  {/* Ambient Backdrop */}
                  {selectedPost?.imageUrl && (
                    <div 
                      className="absolute inset-0 blur-[120px] opacity-20 scale-150 pointer-events-none"
                      style={{ backgroundImage: `url(${selectedPost.imageUrl})`, backgroundSize: 'cover', backgroundPosition: 'center' }}
                    />
                  )}
               </div>

               {/* Content Section (Refined) */}
               <div className="w-full lg:w-[400px] shrink-0 p-6 md:p-8 overflow-y-auto border-t lg:border-t-0 lg:border-l border-white/10 bg-background/40 flex flex-col">
                  {/* Header */}
                  <div className="flex items-center gap-3 mb-8 pb-6 border-b border-white/5">
                    <Avatar className="h-12 w-12 border border-primary/30 p-0.5">
                      <AvatarImage src={selectedPost?.creator.avatarUrl || undefined} />
                      <AvatarFallback className="font-black text-xs">R</AvatarFallback>
                    </Avatar>
                    <div className="flex flex-col">
                      <h4 className="text-sm md:text-md font-black uppercase italic leading-none truncate">{selectedPost?.creator.displayName || "Rezzkiel Prime"}</h4>
                      <div className="flex items-center gap-2 mt-1">
                        <span className="text-[8px] font-black uppercase text-accent tracking-widest px-1.5 py-0.5 bg-accent/10 rounded">Verified</span>
                        <span className="text-[8px] text-zinc-600 font-bold uppercase tracking-widest">{selectedPost && new Date(selectedPost.createdAt).toLocaleDateString()}</span>
                      </div>
                    </div>
                  </div>

                  {/* Body */}
                  <div className="space-y-6 flex-1">
                     <h2 className="text-xl md:text-2xl font-black italic uppercase tracking-tighter leading-tight text-white/90">
                        {selectedPost?.title}
                     </h2>
                     <p className="text-zinc-400 text-sm md:text-md leading-relaxed whitespace-pre-wrap font-medium">
                        {selectedPost?.content}
                     </p>
                  </div>

                  {/* Actions */}
                  <div className="pt-8 mt-8 border-t border-white/5">
                     <div className="flex items-center justify-between">
                        <div className="flex items-center gap-6">
                           <button className="flex flex-col items-center gap-1 group">
                              <div className="h-11 w-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-primary/20 group-hover:border-primary/40 transition-all text-zinc-500 group-hover:text-primary">
                                 <Heart className="h-5 w-5" />
                              </div>
                              <span className="text-[8px] font-black text-zinc-600 uppercase">Resonate</span>
                           </button>
                           <button className="flex flex-col items-center gap-1 group">
                              <div className="h-11 w-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center group-hover:bg-accent/20 group-hover:border-accent/40 transition-all text-zinc-500 group-hover:text-accent">
                                 <MessageSquare className="h-5 w-5" />
                               </div>
                              <span className="text-[8px] font-black text-zinc-600 uppercase">Discuss</span>
                           </button>
                        </div>
                        <button className="h-11 w-11 rounded-full bg-white/5 border border-white/10 flex items-center justify-center hover:bg-white/10 transition-all text-zinc-500">
                           <Share2 className="h-4 w-4" />
                        </button>
                     </div>
                  </div>
               </div>
            </div>
         </DialogContent>
      </Dialog>
    </div>
  );
}
