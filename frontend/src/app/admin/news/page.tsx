"use client";

import { useEffect, useState } from "react";
import { useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { Loader2, Megaphone, Trash2, Camera, Send, Sparkles, Clock, ImageIcon } from "lucide-react";
import { ImageCropper } from "@/components/ui/ImageCropper";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";

export default function AdminNewsPage() {
  const { user, token, isLoading: authLoading } = useAuth();
  const router = useRouter();

  const [posts, setPosts] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  // Create Post State
  const [title, setTitle] = useState("");
  const [content, setContent] = useState("");
  const [imageUrl, setImageUrl] = useState("");
  const [saving, setSaving] = useState(false);

  // Image Cropper State
  const [cropModal, setCropModal] = useState<{ isOpen: boolean; image: string }>({
    isOpen: false,
    image: '',
  });

  useEffect(() => {
    if (!authLoading && user) {
      fetchPosts();
    }
  }, [authLoading, user]);

  const fetchPosts = async () => {
    try {
      setLoading(true);
      const data = await api.get("/news");
      setPosts(data || []);
    } catch (err: any) {
      console.error("News Fetch Error:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropModal({ isOpen: true, image: reader.result as string });
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    setCropModal({ ...cropModal, isOpen: false });
    
    const formData = new FormData();
    formData.append("file", croppedBlob, "broadcast.jpg");

    try {
      toast.loading("Uploading broadcast media...", { id: 'upload-news' });
      const { url } = await api.post("/upload/image", formData);
      setImageUrl(url);
      toast.success("Broadcast media synchronized!", { id: 'upload-news' });
    } catch (err: any) {
      toast.error("Media link failed. Check sector bandwidth.", { id: 'upload-news' });
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title || !content) {
      toast.error("Title and Content are required to anchor the resonance.");
      return;
    }

    setSaving(true);
    try {
      await api.post("/news", { title, content, imageUrl }, token!);
      toast.success("Multiverse update broadcasted!");
      setTitle("");
      setContent("");
      setImageUrl("");
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message || "Failed to broadcast update");
    } finally {
      setSaving(false);
    }
  };

  const handleDelete = async (id: string, postTitle: string) => {
    if (!confirm(`Are you sure you want to terminate signal "${postTitle}"?`)) return;

    try {
      await api.delete(`/news/${id}`, token!);
      toast.success("Signal terminated.");
      fetchPosts();
    } catch (err: any) {
      toast.error(err.message || "Failed to terminate signal");
    }
  };

  if (authLoading) return <div className="p-20 flex justify-center"><Loader2 className="animate-spin h-8 w-8 text-primary" /></div>;

  return (
    <div className="space-y-16">
      <ImageCropper 
        isOpen={cropModal.isOpen}
        image={cropModal.image}
        cropShape="rect"
        aspect={16 / 9}
        onClose={() => setCropModal({ ...cropModal, isOpen: false })}
        onCropComplete={handleCropComplete}
      />

      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-white/5 pb-10 gap-8">
         <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-accent/10 border border-accent/20 rounded-lg text-[10px] font-black text-accent uppercase tracking-widest">
               <Sparkles className="h-3 w-3" /> ACTIVE STATION
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">Broadcast <span className="text-accent">Hub</span></h1>
         </div>
      </div>

      <div className="grid grid-cols-1 xl:grid-cols-12 gap-16">
         
         {/* POST FORM */}
         <div className="xl:col-span-5 space-y-10">
            <div className="space-y-3">
               <h3 className="text-3xl font-black italic uppercase italic">Initiate <span className="text-zinc-500">Signal</span></h3>
               <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">Transmit new lore updates directly to the nexus feed.</p>
            </div>

            <form onSubmit={handleCreate} className="space-y-10">
               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-2">Transmission Title</Label>
                  <Input 
                    value={title} 
                    onChange={e => setTitle(e.target.value)} 
                    placeholder="Sector Alpha Awakening..." 
                    className="h-16 bg-background border-2 border-white/5 rounded-2xl focus:border-accent/40 text-xl font-bold uppercase italic px-8" 
                  />
               </div>

               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-2">Signal Content</Label>
                  <Textarea 
                    value={content} 
                    onChange={e => setContent(e.target.value)} 
                    placeholder="Broadcast details of the universe shift..." 
                    className="min-h-[200px] bg-background border-2 border-white/5 rounded-[2rem] focus:border-accent/40 p-8 text-md font-medium leading-relaxed" 
                  />
               </div>

               <div className="space-y-4">
                  <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-2">Visual Resonance</Label>
                  <div className="relative group">
                     {imageUrl ? (
                        <div className="relative aspect-video rounded-[2rem] overflow-hidden border-2 border-accent/30 shadow-2xl group">
                           <img src={imageUrl} className="w-full h-full object-cover" />
                           <div 
                              className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center cursor-pointer"
                              onClick={() => document.getElementById('news-image-upload')?.click()}
                           >
                              <div className="flex flex-col items-center gap-2">
                                 <Camera className="h-8 w-8 text-white" />
                                 <span className="text-[10px] font-black text-white uppercase tracking-widest">Re-Link Media</span>
                              </div>
                           </div>
                        </div>
                     ) : (
                        <div 
                           className="aspect-video rounded-[2rem] border-2 border-dashed border-white/10 flex flex-col items-center justify-center gap-4 bg-background/50 hover:border-accent/20 cursor-pointer transition-all"
                           onClick={() => document.getElementById('news-image-upload')?.click()}
                        >
                           <ImageIcon className="h-12 w-12 text-zinc-800" />
                           <span className="text-[10px] font-black uppercase tracking-[0.3em] text-zinc-600">Forge Graphic Signal</span>
                        </div>
                     )}
                     <input 
                        type="file" 
                        id="news-image-upload" 
                        className="hidden" 
                        accept="image/*"
                        onChange={handleFileSelect}
                     />
                  </div>
               </div>

               <Button type="submit" disabled={saving} className="w-full rounded-2xl h-20 text-xl font-black uppercase italic glow-accent border-2 border-accent/20">
                  {saving ? <Loader2 className="animate-spin h-6 w-6 mr-4" /> : <Send className="h-6 w-6 mr-4" />}
                  INITIATE BROADCAST
               </Button>
            </form>
         </div>

         {/* HISTORY LIST */}
         <div className="xl:col-span-7 space-y-10">
            <div className="space-y-3">
               <h3 className="text-3xl font-black italic uppercase italic">Transmission <span className="text-zinc-500">History</span></h3>
               <p className="text-xs text-zinc-600 font-bold uppercase tracking-widest">Manage active signals in the multiverse nexus.</p>
            </div>

            {loading ? (
               <div className="p-32 flex flex-col items-center gap-6">
                  <Loader2 className="animate-spin h-10 w-10 text-accent/40" />
                  <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic animate-pulse">Retrieving signal logs...</p>
               </div>
            ) : (
               <div className="space-y-6">
                  <AnimatePresence>
                     {posts.map((post, idx) => (
                        <motion.div 
                           key={post.id}
                           initial={{ opacity: 0, x: 20 }}
                           animate={{ opacity: 1, x: 0 }}
                           transition={{ delay: idx * 0.05 }}
                           className="p-8 comfort-card flex flex-col md:flex-row gap-8 items-center group relative overflow-hidden"
                        >
                           <div className="h-32 w-48 shrink-0 rounded-2xl overflow-hidden bg-background border border-white/5">
                              {post.imageUrl ? (
                                 <img src={post.imageUrl} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                              ) : (
                                 <div className="h-full w-full flex items-center justify-center"><Megaphone className="h-8 w-8 text-zinc-800" /></div>
                              )}
                           </div>
                           
                           <div className="flex-1 min-w-0 space-y-2">
                              <h4 className="text-3xl font-black italic uppercase truncate group-hover:text-accent transition-colors">{post.title}</h4>
                              <div className="flex items-center gap-6 text-[10px] font-black text-zinc-600 uppercase tracking-widest">
                                 <div className="flex items-center gap-2"><Clock className="h-3.5 w-3.5" /> {new Date(post.createdAt).toLocaleDateString()}</div>
                                 <div className="flex items-center gap-2 text-accent/60 italic">STATION PRIMARY</div>
                              </div>
                           </div>

                           <Button 
                              variant="ghost" 
                              onClick={() => handleDelete(post.id, post.title)}
                              className="h-16 w-16 rounded-2xl bg-white/5 text-zinc-500 hover:bg-destructive hover:text-white transition-all shadow-xl"
                           >
                              <Trash2 className="h-6 w-6" />
                           </Button>
                        </motion.div>
                     ))}
                  </AnimatePresence>
               </div>
            )}
         </div>

      </div>
    </div>
  );
}
