"use client";

import { useEffect, useState } from "react";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import Link from "next/link";
import { useRouter } from "next/navigation";
import { Plus, Trash2, Edit, Loader2, BookOpen, Sparkles, Filter, Zap } from "lucide-react";
import { cn } from "@/lib/utils";
import { motion, AnimatePresence } from "framer-motion";

export default function AdminStoriesPage() {
  const [stories, setStories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const { user, token } = useAuth();
  const router = useRouter();

  const [isOpen, setIsOpen] = useState(false);
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [isPublished, setIsPublished] = useState(false);
  const [category, setCategory] = useState("General");
  const [coverFile, setCoverFile] = useState<File | null>(null);
  const [submitting, setSubmitting] = useState(false);

  useEffect(() => {
    if (user) fetchStories();
  }, [user]);

  const fetchStories = async () => {
    try {
      setLoading(true);
      const data = await api.get("/stories/admin", token!);
      setStories(data || []);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setLoading(false);
    }
  };

  const handleCreate = async (e: React.FormEvent) => {
    e.preventDefault();
    setSubmitting(true);
    try {
      let coverUrl = "";
      if (coverFile) {
        const formData = new FormData();
        formData.append("file", coverFile);
        formData.append("folderName", "covers");

        const uploadData = await api.post("/upload/image", formData);
        coverUrl = uploadData.url;
      }

      const res = await api.post("/stories", {
        title,
        description,
        price: parseFloat(price),
        isPublished,
        category,
        coverImageUrl: coverUrl
      }, token!);

      toast.success("Story forged in the nexus!");
      setIsOpen(false);
      fetchStories();
      router.push(`/admin/stories/${res.id}`);
    } catch (error: any) {
      toast.error(error.message);
    } finally {
      setSubmitting(false);
    }
  };

  const handleDelete = async (id: string, storyTitle: string) => {
    if (!confirm(`Are you sure you want to erase "${storyTitle}" from the multiverse?`)) return;
    
    try {
      await api.delete(`/stories/${id}`, token!);
      toast.success("Story collapsed back to stardust.");
      fetchStories();
    } catch (error: any) {
      toast.error(error.message);
    }
  };

  return (
    <div className="space-y-12">
      <div className="flex flex-col md:flex-row md:items-end justify-between border-b-2 border-white/5 pb-10 gap-8">
         <div className="space-y-4">
            <div className="inline-flex items-center gap-2 px-4 py-1.5 bg-primary/10 border border-primary/20 rounded-lg text-[10px] font-black text-primary uppercase tracking-widest">
               <Zap className="h-3 w-3" /> CHRONICLES ARCHIVE
            </div>
            <h1 className="text-6xl md:text-8xl font-black italic tracking-tighter uppercase leading-none">Comic <span className="text-primary">Vault</span></h1>
         </div>

        <Dialog open={isOpen} onOpenChange={setIsOpen}>
          <DialogTrigger
            render={
              <Button className="rounded-2xl h-18 px-10 text-lg font-black uppercase italic italic bg-primary hover:bg-white hover:text-black transition-all glow-primary">
                <Plus className="h-6 w-6 mr-3" /> Forge New Lore
              </Button>
            }
          />
          <DialogContent className="comfort-card border-primary/20 bg-background max-w-2xl p-10">
            <DialogHeader className="mb-10">
              <DialogTitle className="text-4xl font-black italic uppercase">Forge New <span className="text-primary">Legend</span></DialogTitle>
            </DialogHeader>
            <form onSubmit={handleCreate} className="space-y-8">
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Legacy Title</Label>
                <Input value={title} onChange={e => setTitle(e.target.value)} required className="h-16 bg-card border-white/5 rounded-2xl text-xl font-black italic uppercase px-6" />
              </div>
              <div className="space-y-2">
                <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Resonance Summary</Label>
                <Textarea value={description} onChange={e => setDescription(e.target.value)} className="min-h-[150px] bg-card border-white/5 rounded-[2rem] p-6 text-md font-medium" />
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Exchange Value ($)</Label>
                  <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required className="h-14 bg-card border-white/5 rounded-xl font-mono" />
                </div>
                <div className="flex items-center space-x-4 pt-10">
                  <input type="checkbox" id="published" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} className="h-6 w-6 rounded border-white/10 accent-primary" />
                  <Label htmlFor="published" className="text-xs font-black uppercase tracking-widest text-zinc-500">Initiate Manifest</Label>
                </div>
              </div>
              <div className="grid grid-cols-2 gap-8">
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Lore Category</Label>
                  <select 
                    value={category} 
                    onChange={e => setCategory(e.target.value)}
                    className="w-full h-14 rounded-xl bg-card border border-white/5 px-6 text-xs font-black uppercase tracking-widest focus:ring-primary/20"
                  >
                    <option value="General">General</option>
                    <option value="Action">Action</option>
                    <option value="Romance">Romance</option>
                    <option value="Fantasy">Fantasy</option>
                    <option value="Horror">Horror</option>
                    <option value="Sci-Fi">Sci-Fi</option>
                  </select>
                </div>
                <div className="space-y-2">
                  <Label className="text-[10px] font-black uppercase tracking-widest text-zinc-500 ml-2">Graphic Seal</Label>
                  <Input type="file" accept="image/*" onChange={e => setCoverFile(e.target.files?.[0] || null)} className="h-14 bg-card border-white/5 rounded-xl text-[10px] pt-4" />
                </div>
              </div>
              <Button type="submit" disabled={submitting} className="w-full h-20 rounded-2xl text-2xl font-black uppercase italic glow-primary shadow-2xl">
                {submitting ? <Loader2 className="animate-spin h-8 w-8 mr-4" /> : null}
                {submitting ? "MANIFESTING..." : "FORGE CHRONICLE"}
              </Button>
            </form>
          </DialogContent>
        </Dialog>
      </div>

      <div className="grid grid-cols-1 gap-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center py-40 space-y-6">
            <Loader2 className="animate-spin h-12 w-12 text-primary/40" />
            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest italic animate-pulse">Retrieving archived legends...</p>
          </div>
        ) : (
          <div className="comfort-card overflow-hidden">
            <Table>
              <TableHeader className="bg-white/5">
                <TableRow className="border-b-2 border-white/5 h-20">
                  <TableHead className="w-[100px] text-[10px] font-black uppercase tracking-widest px-8">Seal</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Identity</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Resonance</TableHead>
                  <TableHead className="text-[10px] font-black uppercase tracking-widest">Status</TableHead>
                  <TableHead className="text-right text-[10px] font-black uppercase tracking-widest px-8">Tactical</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {stories.length === 0 ? (
                  <TableRow>
                    <TableCell colSpan={5} className="text-center h-48 text-zinc-600 font-black uppercase tracking-[0.3em] text-xs">The vault is currently void. Begin the forge.</TableCell>
                  </TableRow>
                ) : (
                  stories.map((story, idx) => (
                    <TableRow key={story.id} className="border-b border-white/5 group hover:bg-white/5 transition-all h-32">
                      <TableCell className="px-8">
                         <div className="h-20 w-14 rounded-lg overflow-hidden border-2 border-white/5 shadow-2xl group-hover:scale-110 transition-transform">
                            {story.coverImageUrl ? (
                              <img src={story.coverImageUrl} className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-700" />
                            ) : (
                              <div className="h-full w-full flex items-center justify-center bg-card"><BookOpen className="h-6 w-6 text-zinc-800" /></div>
                            )}
                         </div>
                      </TableCell>
                      <TableCell>
                         <div className="space-y-1">
                            <p className="font-black text-2xl uppercase italic leading-none group-hover:text-primary transition-colors">{story.title}</p>
                            <p className="text-[10px] font-black text-zinc-600 uppercase tracking-widest">{story.category}</p>
                         </div>
                      </TableCell>
                      <TableCell className="font-mono text-zinc-300 font-bold italic">${story.price.toFixed(2)}</TableCell>
                      <TableCell>
                        <span className={cn(
                          "px-4 py-1.5 rounded-lg text-[8px] font-black uppercase tracking-widest border transition-all",
                          story.isPublished 
                            ? 'bg-green-500/10 text-green-400 border-green-500/30 glow-green' 
                            : 'bg-zinc-800 text-zinc-500 border-white/10'
                        )}>
                          {story.isPublished ? 'MANIFESTED' : 'SIGNAL DRAFT'}
                        </span>
                      </TableCell>
                      <TableCell className="text-right px-8">
                        <div className="flex justify-end gap-4">
                          <Link href={`/admin/stories/${story.id}`} className={cn(buttonVariants({ variant: "secondary", size: "lg" }), "h-14 w-14 rounded-2xl bg-white/5 hover:bg-primary hover:text-white p-0")}>
                            <Edit className="h-6 w-6" />
                          </Link>
                          <Button 
                            variant="ghost" 
                            className="h-14 w-14 rounded-2xl bg-white/5 hover:bg-destructive hover:text-white" 
                            onClick={() => handleDelete(story.id, story.title)}
                          >
                            <Trash2 className="h-6 w-6" />
                          </Button>
                        </div>
                      </TableCell>
                    </TableRow>
                  ))
                )}
              </TableBody>
            </Table>
          </div>
        )}
      </div>
    </div>
  );
}
