"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import { Loader2, User, Clock, BookOpen, Settings, Camera, Map, Edit3, Sparkles, Zap } from "lucide-react";
import Link from "next/link";
import { cn } from "@/lib/utils";

import { motion, AnimatePresence } from "framer-motion";
import { ImageCropper } from "@/components/ui/ImageCropper";

export default function ProfilePage() {
  const { user: authUser, isLoading: authLoading } = useAuth();
  
  const [profile, setProfile] = useState<any>(null);
  const [history, setHistory] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [isEditing, setIsEditing] = useState(false);
  const [displayName, setDisplayName] = useState("");
  const [avatarUrl, setAvatarUrl] = useState("");
  const [bio, setBio] = useState("");
  const [bannerUrl, setBannerUrl] = useState("");
  const [saving, setSaving] = useState(false);
  
  // Cropper State
  const [cropModal, setCropModal] = useState<{ isOpen: boolean; image: string; type: 'avatar' | 'banner' }>({
    isOpen: false,
    image: '',
    type: 'avatar'
  });

  useEffect(() => {
    if (!authLoading && authUser) {
      fetchData();
    } else if (!authLoading && !authUser) {
      setLoading(false);
    }
  }, [authLoading, authUser]);

  const fetchData = async () => {
    try {
      setLoading(true);
      const p = await api.get("/profiles");
      setProfile(p);
      setDisplayName(p.displayName || "");
      setAvatarUrl(p.avatarUrl || "");
      setBio(p.bio || "");
      setBannerUrl(p.bannerUrl || "");

      const h = await api.get("/profiles/history");
      setHistory(h || []);
    } catch (err: any) {
      toast.error(err.message || "Failed to load profile");
    } finally {
      setLoading(false);
    }
  };

  const handleFileSelect = (e: React.ChangeEvent<HTMLInputElement>, type: 'avatar' | 'banner') => {
    const file = e.target.files?.[0];
    if (!file) return;

    const reader = new FileReader();
    reader.onload = () => {
      setCropModal({ isOpen: true, image: reader.result as string, type });
    };
    reader.readAsDataURL(file);
  };

  const handleCropComplete = async (croppedBlob: Blob) => {
    const type = cropModal.type;
    setCropModal({ ...cropModal, isOpen: false });
    
    const formData = new FormData();
    formData.append("file", croppedBlob, "upload.jpg");

    try {
      toast.loading(`Syncing ${type === 'avatar' ? 'Core' : 'Horizon'}...`, { id: 'upload-toast' });
      const { url } = await api.post("/upload/profile", formData);
      if (type === 'avatar') setAvatarUrl(url);
      else setBannerUrl(url);
      toast.success(`${type === 'avatar' ? 'Core Identity' : 'Sector Horizon'} synchronized!`, { id: 'upload-toast' });
    } catch (err: any) {
      toast.error("Signal interference: Link failed.", { id: 'upload-toast' });
    }
  };

  const handleUpdate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSaving(true);
    try {
      await api.put("/profiles", { displayName, avatarUrl, bio, bannerUrl });
      toast.success("Multiverse identity locked!");
      setIsEditing(false);
      fetchData();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSaving(false);
    }
  };

  if (authLoading || loading) {
    return (
      <div className="min-h-screen flex flex-col items-center justify-center space-y-6 bg-background">
        <div className="h-32 w-32 relative">
           <div className="absolute inset-0 rounded-full border-4 border-primary/20 border-t-primary animate-spin" />
           <Loader2 className="absolute inset-0 m-auto h-12 w-12 text-primary opacity-50" />
        </div>
        <p className="text-zinc-500 font-black uppercase tracking-[0.5em] animate-pulse">Syncing Resonance Profile...</p>
      </div>
    );
  }

  if (!authUser) {
    return (
      <div className="container mx-auto py-32 text-center h-[80vh] flex flex-col items-center justify-center bg-background">
        <div className="h-24 w-24 rounded-[2rem] bg-card border-2 border-white/10 flex items-center justify-center mb-10 shadow-2xl">
           <User className="h-12 w-12 text-zinc-800" />
        </div>
        <h2 className="text-5xl font-black mb-6 tracking-tighter uppercase italic">Identity Error</h2>
        <p className="text-zinc-500 mb-10 max-w-sm font-bold uppercase tracking-widest text-xs">Verify your digital signature to access this resonance chamber.</p>
        <Link href="/login" className={cn(buttonVariants({ size: "lg" }), "rounded-full px-16 h-18 text-xl font-black italic")}>
          Initiate Login
        </Link>
      </div>
    );
  }

  return (
    <main className="min-h-screen pb-32 bg-background">
      <ImageCropper 
        isOpen={cropModal.isOpen}
        image={cropModal.image}
        cropShape={cropModal.type === 'avatar' ? 'round' : 'rect'}
        aspect={cropModal.type === 'avatar' ? 1 : 16 / 9}
        onClose={() => setCropModal({ ...cropModal, isOpen: false })}
        onCropComplete={handleCropComplete}
      />
      
      {/* 1. CINEMATIC BANNER */}
      <motion.div 
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="relative h-[350px] md:h-[500px] w-full group overflow-hidden border-b border-white/10"
      >
        {bannerUrl ? (
          <img src={bannerUrl || undefined} alt="Banner" className="w-full h-full object-cover transition-all duration-1000 group-hover:scale-105" />
        ) : (
          <div className="w-full h-full bg-secondary flex items-center justify-center">
             <Map className="h-24 w-24 text-white opacity-10" />
          </div>
        )}

        {/* Cinematic Blur Mask */}
        <div className="absolute inset-0 bg-gradient-to-t from-background via-transparent to-transparent z-10" />
        <div className="absolute inset-x-0 bottom-0 h-32 backdrop-blur-[2px] z-10" />
        
        {/* Banner Overlay Controls - Only active during Tuning */}
        {isEditing && (
          <motion.div 
            initial={{ opacity: 0, y: -20 }}
            animate={{ opacity: 1, y: 0 }}
            className="absolute top-12 right-12 z-20"
          >
           <input 
              type="file" 
              id="banner-upload" 
              className="hidden" 
              accept="image/*"
              onChange={(e) => handleFileSelect(e, 'banner')}
           />
           <Button 
              variant="secondary" 
              size="lg" 
              onClick={() => document.getElementById('banner-upload')?.click()} 
              className="rounded-full bg-background/80 backdrop-blur-md border border-white/20 hover:border-primary text-[10px] font-black uppercase tracking-[0.3em] px-8 h-14 shadow-2xl transition-all"
           >
              <Camera className="h-4 w-4 mr-3" />
              Tune Horizon
           </Button>
        </motion.div>
        )}
      </motion.div>

      {/* AMBIENT BACKDROP - Reflects banner essence */}
      <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden">
         <div 
          className="absolute top-[-10%] left-[-10%] w-[120%] h-[120%] opacity-[0.08] blur-[120px] saturate-[2]"
          style={{ 
            backgroundImage: bannerUrl ? `url(${bannerUrl})` : 'none',
            backgroundSize: 'cover',
            backgroundPosition: 'center'
          }}
         />
      </div>

      <div className="container mx-auto px-4 lg:px-12 -mt-40 relative z-30">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-16">
          
          {/* PROFILE INFO CARD */}
          <motion.div 
            initial={{ opacity: 0, y: 50 }}
            animate={{ opacity: 1, y: 0 }}
            className="space-y-8 lg:col-span-4"
          >
             <div className="comfort-card p-12 text-center shadow-2xl relative overflow-hidden">
                <div className="absolute top-0 left-0 w-full h-1.5 bg-gradient-to-r from-primary to-accent" />
                
                <div className="relative inline-block mb-12">
                   {/* Avatar with clear interaction cue */}
                   <div 
                     className="h-56 w-56 rounded-[4rem] border-8 border-background bg-background shadow-2xl overflow-hidden group relative cursor-pointer"
                     onClick={() => isEditing && document.getElementById('avatar-upload')?.click()}
                   >
                      {avatarUrl ? (
                        <img src={avatarUrl || undefined} alt="Avatar" className="h-full w-full object-cover transition-transform group-hover:scale-110" />
                      ) : (
                        <div className="h-full w-full flex items-center justify-center bg-secondary">
                           <User className="h-24 w-24 text-zinc-500" />
                        </div>
                      )}
                      
                      {isEditing && (
                        <div className="absolute inset-0 bg-primary/40 flex items-center justify-center transition-opacity">
                           <div className="flex flex-col items-center gap-2">
                             <Camera className="h-10 w-10 text-white" />
                             <span className="text-[10px] font-black uppercase tracking-widest text-white shadow-sm">Sync Core</span>
                           </div>
                        </div>
                       )}
                      
                      <input 
                         type="file" 
                         id="avatar-upload" 
                         className="hidden" 
                         accept="image/*"
                         onChange={(e) => handleFileSelect(e, 'avatar')}
                      />
                   </div>
                   <motion.div 
                    animate={{ rotate: 360 }}
                    transition={{ duration: 10, repeat: Infinity, ease: "linear" }}
                    className="absolute -bottom-4 -right-4 h-16 w-16 bg-accent rounded-3xl border-4 border-background flex items-center justify-center shadow-xl p-4"
                   >
                      <Sparkles className="h-full w-full text-white" />
                   </motion.div>
                </div>

                <div className="space-y-2 mb-10">
                  <h2 className="text-5xl font-black tracking-tighter uppercase italic leading-none">{profile?.displayName || profile?.email.split('@')[0]}</h2>
                  <span className="text-[10px] items-center gap-2 font-black uppercase tracking-[0.2em] text-accent inline-flex">
                     <div className="h-2 w-2 rounded-full bg-accent animate-pulse" /> REZZKIEL CORE
                  </span>
                </div>

                <div className="space-y-4 py-8 mb-10 border-y border-white/5">
                   <p className="text-lg text-zinc-400 font-bold leading-relaxed italic uppercase tracking-tighter">
                      "{profile?.bio || "No lore frequency transmitted. Initializing silence protocol."}"
                   </p>
                </div>

                <div className="flex flex-col gap-6">
                   <Button 
                    variant={isEditing ? "default" : "secondary"} 
                    className="w-full rounded-[1.5rem] h-16 font-black uppercase tracking-widest text-xs transition-all glow-primary" 
                    onClick={() => setIsEditing(!isEditing)}
                   >
                      {isEditing ? "Finalize Config" : "Identity Tuner"}
                   </Button>
                   <Link href="/logout" className="text-[10px] font-black text-zinc-600 hover:text-red-400 transition-all tracking-[0.4em] uppercase underline decoration-2 underline-offset-8">Terminate Session</Link>
                </div>
             </div>

             {/* STATS OVERVIEW */}
             <div className="comfort-card p-10 bg-card/40">
                <h4 className="text-[10px] font-black uppercase tracking-[0.4em] text-accent mb-10 flex items-center gap-3">
                   <Zap className="h-3 w-3" /> Core Metrics
                </h4>
                <div className="space-y-8">
                   <div className="flex justify-between items-center bg-background/40 p-6 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Resonance Age</span>
                      <span className="text-xs font-black font-mono text-zinc-300">01-Y REZZ</span>
                   </div>
                   <div className="flex justify-between items-center bg-background/40 p-6 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Transmission Status</span>
                      <span className="text-xs font-black font-mono text-accent animate-pulse">OPTIMAL</span>
                   </div>
                   <div className="flex justify-between items-center bg-background/40 p-6 rounded-2xl border border-white/5">
                      <span className="text-[10px] font-black text-zinc-500 uppercase tracking-widest">Lore Packets</span>
                      <span className="text-xs font-black font-mono text-zinc-300">{history.length}</span>
                   </div>
                </div>
             </div>
          </motion.div>

          {/* MAIN COLUMN */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            className="lg:col-span-8 space-y-16"
          >
             <AnimatePresence mode="wait">
               {isEditing ? (
                 <motion.div
                  key="editing"
                  initial={{ opacity: 0, scale: 0.98 }}
                  animate={{ opacity: 1, scale: 1 }}
                  exit={{ opacity: 0, scale: 0.98 }}
                  className="comfort-card p-12 lg:p-16 shadow-2xl relative overflow-hidden"
                 >
                   <div className="absolute top-0 right-0 p-10 opacity-5 pointer-events-none">
                      <Settings className="h-64 w-64" />
                   </div>
                   
                   <div className="space-y-12 relative z-10">
                     <div className="space-y-3">
                       <h2 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">CORE <span className="text-primary">TUNER</span></h2>
                       <p className="text-zinc-500 font-black uppercase tracking-[0.3em] text-[10px]">Reconfiguring biometric signature for multiverse synchronization.</p>
                     </div>

                     <form onSubmit={handleUpdate} className="space-y-12">
                        <div className="grid grid-cols-1 gap-12">
                           <div className="space-y-4">
                              <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-2">Digital Signature</Label>
                              <Input 
                                value={displayName} 
                                onChange={e => setDisplayName(e.target.value)} 
                                placeholder="Public Handle" 
                                className="h-20 bg-background border-2 border-white/5 rounded-3xl focus:border-primary/50 text-3xl font-black uppercase italic px-10 transition-all shadow-inner" 
                              />
                           </div>

                           <div className="space-y-4">
                              <Label className="text-[10px] font-black uppercase tracking-[0.4em] text-zinc-500 ml-2">Resonance Bio (Lore)</Label>
                              <Textarea 
                                value={bio} 
                                onChange={e => setBio(e.target.value)} 
                                placeholder="Transmit your resonance handle to the nexus..." 
                                className="min-h-[250px] bg-background border-2 border-white/5 rounded-[3rem] focus:border-primary/50 p-10 text-2xl font-bold italic transition-all leading-relaxed shadow-inner" 
                              />
                           </div>
                        </div>

                        <div className="flex flex-wrap items-center gap-8 pt-8 border-t border-white/5">
                           <Button type="submit" size="lg" disabled={saving} className="rounded-full px-16 h-20 text-2xl font-black uppercase italic glow-primary">
                              {saving ? <Loader2 className="animate-spin h-8 w-8 mr-4" /> : null}
                              COMMIT CONFIG
                           </Button>
                           <Button type="button" variant="ghost" className="rounded-full px-10 h-20 text-zinc-500 font-black uppercase tracking-[0.3em] text-xs hover:text-white" onClick={() => setIsEditing(false)}>ABORT TUNING</Button>
                        </div>
                     </form>
                   </div>
                 </motion.div>
               ) : (
                 <motion.div 
                  key="view"
                  initial={{ opacity: 0 }}
                  animate={{ opacity: 1 }}
                  className="space-y-20"
                 >
                    {/* ACCESS LOGS HEADERS */}
                    <div className="space-y-12">
                       <div className="flex flex-col md:flex-row md:items-end justify-between border-b pb-10 border-white/10 gap-8">
                          <div className="flex items-center gap-8">
                             <div className="h-16 w-16 rounded-[1.5rem] bg-accent/20 border-2 border-accent/30 flex items-center justify-center glow-accent">
                                <Clock className="h-10 w-10 text-accent" />
                             </div>
                             <h3 className="text-7xl font-black tracking-tighter italic uppercase leading-none">Access Logs</h3>
                          </div>
                          <span className="text-[10px] font-black uppercase tracking-[0.5em] text-zinc-600 font-mono">ACTIVE SESSIONS: {history.length}</span>
                       </div>

                       {history.length === 0 ? (
                          <div className="p-32 text-center comfort-card border-dashed bg-card/20 group">
                             <div className="inline-block p-10 rounded-full bg-white/5 mb-10 group-hover:scale-110 transition-transform">
                                <Sparkles className="h-16 w-16 text-zinc-800" />
                             </div>
                             <p className="text-zinc-500 font-black uppercase tracking-[0.4em] text-sm">Transmissions static. No active syncs detected.</p>
                             <Link href="/explore" className={cn(buttonVariants({ variant: "outline", className: "mt-16 rounded-full h-20 px-16 border-2 border-white/10 font-black uppercase tracking-widest text-sm" }))}>Search Frequency</Link>
                          </div>
                       ) : (
                          <div className="grid gap-12">
                             {history.map((h: any, idx: number) => (
                                <motion.div 
                                  key={h.storyId} 
                                  initial={{ opacity: 0, x: 20 }}
                                  animate={{ opacity: 1, x: 0 }}
                                  transition={{ delay: idx * 0.1 }}
                                >
                                   <Link 
                                      href={`/reader/${h.chapterId}`}
                                      className="group flex flex-col md:flex-row items-center gap-12 p-12 comfort-card relative overflow-hidden"
                                   >
                                      <div className="h-64 w-44 shrink-0 rounded-[2.5rem] overflow-hidden shadow-2xl bg-background border border-white/10 relative z-10">
                                         <img src={h.storyCoverUrl || undefined} alt={h.storyTitle} className="h-full w-full object-cover transition-all duration-700 group-hover:scale-110" />
                                      </div>
                                      <div className="flex-1 space-y-4 text-center md:text-left min-w-0 py-4 relative z-10">
                                         <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-background border border-accent/20 rounded-lg text-[10px] font-black text-accent uppercase tracking-widest mb-4">
                                            <Zap className="h-3 w-3" /> SYNC PERSISTENT
                                         </div>
                                         <h4 className="text-5xl md:text-7xl font-black tracking-tighter uppercase italic leading-[0.8] truncate group-hover:text-accent transition-colors">{h.storyTitle}</h4>
                                         <p className="text-xl font-black text-zinc-500 uppercase tracking-tighter italic">
                                            Phase {h.chapterNumber}: <span className="text-zinc-300">{h.chapterTitle}</span>
                                         </p>
                                         
                                         {/* Progress Architecture */}
                                         <div className="flex items-center gap-8 pt-10">
                                            <div className="h-4 flex-1 bg-background rounded-full overflow-hidden border border-white/5 shadow-inner">
                                               <motion.div 
                                                initial={{ width: 0 }}
                                                animate={{ width: "82%" }}
                                                className="h-full bg-gradient-to-r from-primary to-accent shadow-[0_0_30px_rgba(255,255,255,0.1)]" 
                                               />
                                            </div>
                                            <span className="text-[12px] font-black font-mono text-accent uppercase tracking-[0.2em] shrink-0">82% COMPLETE</span>
                                         </div>
                                      </div>
                                   </Link>
                                </motion.div>
                             ))}
                          </div>
                       )}
                    </div>
                 </motion.div>
               )}
             </AnimatePresence>
          </motion.div>
        </div>
      </div>
    </main>
  );
}
