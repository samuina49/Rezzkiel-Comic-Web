"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription, CardFooter } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { toast } from "sonner";
import Link from "next/link";
import { 
  ChevronLeft, 
  Plus, 
  Image as ImageIcon, 
  Trash2, 
  Loader2, 
  Save, 
  FileEdit, 
  ExternalLink,
  BookOpen 
} from "lucide-react";
import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogTrigger, DialogFooter } from "@/components/ui/dialog";

export default function AdminStoryDetailPage() {
  const params = useParams();
  const storyId = params.id as string;
  const { user } = useAuth();
  const router = useRouter();

  const [story, setStory] = useState<any>(null);
  const [chapters, setChapters] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // Edit Story Form
  const [title, setTitle] = useState("");
  const [description, setDescription] = useState("");
  const [price, setPrice] = useState("0");
  const [isPublished, setIsPublished] = useState(false);
  const [category, setCategory] = useState("General");
  const [savingStory, setSavingStory] = useState(false);
  const [newCoverFile, setNewCoverFile] = useState<File | null>(null);

  // Chapter Logic
  const [isAddChapterOpen, setIsAddChapterOpen] = useState(false);
  const [chapterTitle, setChapterTitle] = useState("");
  const [chapterNum, setChapterNum] = useState("1");
  const [isFree, setIsFree] = useState(false);
  const [savingChapter, setSavingChapter] = useState(false);
  
  // Image Manager Logic
  const [selectedChapter, setSelectedChapter] = useState<any>(null);
  const [uploadingImage, setUploadingImage] = useState(false);
  const [imageSequence, setImageSequence] = useState("1");

  // Edit Chapter Logic
  const [isEditChapterOpen, setIsEditChapterOpen] = useState(false);
  const [editChapterTitle, setEditChapterTitle] = useState("");
  const [editChapterNum, setEditChapterNum] = useState("");
  const [editIsFree, setEditIsFree] = useState(false);
  const [updatingChapter, setUpdatingChapter] = useState(false);

  useEffect(() => {
    if (user) {
      fetchStory();
      fetchChapters();
    }
  }, [user, storyId]);

  const fetchStory = async () => {
    try {
      const data = await api.get(`/stories/${storyId}`);
      setStory(data);
      setTitle(data.title);
      setDescription(data.description);
      setPrice(data.price.toString());
      setIsPublished(data.isPublished);
      setCategory(data.category || "General");
    } catch {
      router.push("/admin/stories");
    } finally {
      setLoading(false);
    }
  };

  const fetchChapters = async () => {
    try {
      const data = await api.get(`/chapters/story/${storyId}`);
      setChapters(data || []);
      if (data && data.length > 0) {
          const maxNum = Math.max(...data.map((c: any) => c.chapterNumber));
          setChapterNum((maxNum + 1).toString());
      }
    } catch (e) {
      console.error(e);
    }
  };

  const handleUpdateStory = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingStory(true);
    try {
      let coverUrl = story.coverImageUrl;
      if (newCoverFile) {
        const formData = new FormData();
        formData.append("file", newCoverFile);
        formData.append("folderName", "covers");
        const uploadRes = await api.post("/upload/image", formData);
        coverUrl = uploadRes.url;
      }

      await api.put(`/stories/${storyId}`, { 
        title, 
        description, 
        price: parseFloat(price), 
        isPublished, 
        category,
        coverImageUrl: coverUrl 
      });
      toast.success("Story lore updated");
      fetchStory();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingStory(false);
    }
  };

  const handleCreateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    setSavingChapter(true);
    try {
      await api.post("/chapters", { storyId, title: chapterTitle, chapterNumber: parseInt(chapterNum), isFree });
      toast.success("Chapter added");
      setChapterTitle("");
      setIsAddChapterOpen(false);
      fetchChapters();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setSavingChapter(false);
    }
  };

  const loadChapterDetails = async (id: string) => {
    try {
      const data = await api.get(`/chapters/${id}`);
      setSelectedChapter(data);
      setImageSequence((data.images.length + 1).toString());
      setEditChapterTitle(data.chapter.title);
      setEditChapterNum(data.chapter.chapterNumber.toString());
      setEditIsFree(data.chapter.isFree);
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUpdateChapter = async (e: React.FormEvent) => {
    e.preventDefault();
    setUpdatingChapter(true);
    try {
      await api.put(`/chapters/${selectedChapter.chapter.id}`, {
        title: editChapterTitle,
        chapterNumber: parseInt(editChapterNum),
        isFree: editIsFree
      });
      toast.success("Episode updated");
      setIsEditChapterOpen(false);
      fetchChapters();
      loadChapterDetails(selectedChapter.chapter.id);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUpdatingChapter(false);
    }
  };

  const handleDeleteChapter = async (id: string, title: string) => {
    if (!confirm(`Exterminate Chapter "${title}"?`)) return;
    try {
      await api.delete(`/chapters/${id}`);
      toast.success("Chapter removed");
      if (selectedChapter?.chapter?.id === id) setSelectedChapter(null);
      fetchChapters();
    } catch (err: any) {
      toast.error(err.message);
    }
  };

  const handleUploadPage = async (e: React.ChangeEvent<HTMLInputElement>) => {
    if (!e.target.files?.length || !selectedChapter) return;
    
    setUploadingImage(true);
    try {
      const file = e.target.files[0];
      const formData = new FormData();
      formData.append("file", file);
      formData.append("folderName", "pages");

      const uploadData = await api.post("/upload/image", formData);

      await api.post(`/chapters/${selectedChapter.chapter.id}/images`, {
        imageUrl: uploadData.url,
        pageNumber: parseInt(imageSequence)
      });

      toast.success("Page added");
      loadChapterDetails(selectedChapter.chapter.id);
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setUploadingImage(false);
      e.target.value = ""; 
    }
  };

  const handleDeletePage = async (imageId: string) => {
    if (!confirm("Erase this page?")) return;
    try {
        await api.delete(`/chapters/images/${imageId}`);
        toast.success("Page erased");
        loadChapterDetails(selectedChapter.chapter.id);
    } catch (err: any) {
        toast.error(err.message);
    }
  };

  if (loading) return (
    <div className="flex flex-col items-center justify-center h-[60vh] space-y-4">
      <Loader2 className="h-10 w-10 animate-spin text-primary" />
      <p className="text-muted-foreground">Scrying story structure...</p>
    </div>
  );

  return (
    <div className="space-y-8 container mx-auto py-8 px-4 max-w-7xl">
      <div className="flex flex-col md:flex-row md:items-center gap-4 justify-between">
        <div className="flex items-center space-x-4">
          <Link href="/admin/stories" className={buttonVariants({ variant: "ghost", size: "icon" })}>
            <ChevronLeft className="h-5 w-5" />
          </Link>
          <div className="flex-1">
            <h1 className="text-2xl font-bold tracking-tight bg-gradient-to-r from-primary to-purple-400 bg-clip-text text-transparent">
              {story?.title}
            </h1>
            <p className="text-sm text-muted-foreground">Episode structure</p>
          </div>
        </div>
        <div className="flex gap-2">
            <Link href={`/story/${storyId}`} target="_blank" className={buttonVariants({ variant: "outline", size: "sm" })}>
                <ExternalLink className="h-4 w-4 mr-2" /> Live View
            </Link>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        <div className="lg:col-span-1 space-y-6">
            <Card className="glass-morphism border-primary/5 shadow-2xl overflow-hidden">
                <CardHeader className="text-center pt-8">
                    <div className="h-32 w-24 mx-auto rounded shadow-xl overflow-hidden mb-4 border-2 border-background bg-muted">
                        {story?.coverImageUrl && <img src={story.coverImageUrl} className="h-full w-full object-cover" />}
                    </div>
                    <CardTitle className="text-lg">Edit Legend</CardTitle>
                </CardHeader>
                <CardContent>
                    <form onSubmit={handleUpdateStory} className="space-y-4">
                        <div className="space-y-1">
                            <Label className="text-xs">Title</Label>
                            <Input value={title} onChange={e => setTitle(e.target.value)} required className="bg-background/40" />
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Description</Label>
                            <Textarea value={description} onChange={e => setDescription(e.target.value)} className="h-24 bg-background/40" />
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                            <div className="space-y-1">
                                <Label className="text-xs">Price ($)</Label>
                                <Input type="number" step="0.01" value={price} onChange={e => setPrice(e.target.value)} required className="bg-background/40" />
                            </div>
                            <div className="flex items-center space-x-2 pt-6">
                                <input type="checkbox" id="published-edit" checked={isPublished} onChange={e => setIsPublished(e.target.checked)} />
                                <Label htmlFor="published-edit" className="text-xs">Published</Label>
                            </div>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Category</Label>
                            <select 
                                value={category} 
                                onChange={e => setCategory(e.target.value)}
                                className="w-full h-9 rounded-md bg-background/40 border border-white/5 px-3 text-xs focus:ring-primary/20"
                            >
                                <option value="General">General</option>
                                <option value="Action">Action</option>
                                <option value="Romance">Romance</option>
                                <option value="Fantasy">Fantasy</option>
                                <option value="Horror">Horror</option>
                                <option value="Comedy">Comedy</option>
                                <option value="Sci-Fi">Sci-Fi</option>
                            </select>
                        </div>
                        <div className="space-y-1">
                            <Label className="text-xs">Update Cover</Label>
                            <Input type="file" accept="image/*" onChange={e => setNewCoverFile(e.target.files?.[0] || null)} className="bg-background/40 text-xs h-8" />
                        </div>
                        <Button type="submit" disabled={savingStory} className="w-full">
                            {savingStory ? <Loader2 className="h-4 w-4 animate-spin mr-2" /> : <Save className="h-4 w-4 mr-2" />}
                            Update
                        </Button>
                    </form>
                </CardContent>
            </Card>

            <Card className="glass-morphism border-primary/5 shadow-2xl">
                <CardHeader className="flex flex-row items-center justify-between pb-2">
                    <CardTitle className="text-lg">Episodes</CardTitle>
                    <Dialog open={isAddChapterOpen} onOpenChange={setIsAddChapterOpen}>
                        <DialogTrigger
                          render={
                            <Button size="icon" variant="ghost" className="rounded-full bg-primary/10 hover:bg-primary/20">
                              <Plus className="h-4 w-4" />
                            </Button>
                          }
                        />
                        <DialogContent className="glass-morphism border-primary/20">
                            <DialogHeader>
                                <DialogTitle>New Episode</DialogTitle>
                            </DialogHeader>
                            <form onSubmit={handleCreateChapter} className="space-y-4 pt-4">
                                <div className="grid grid-cols-4 gap-4">
                                    <div className="col-span-1 space-y-2">
                                        <Label>Num</Label>
                                        <Input type="number" value={chapterNum} onChange={e=>setChapterNum(e.target.value)} required />
                                    </div>
                                    <div className="col-span-3 space-y-2">
                                        <Label>Title</Label>
                                        <Input value={chapterTitle} onChange={e=>setChapterTitle(e.target.value)} required />
                                    </div>
                                </div>
                                <div className="flex items-center space-x-2">
                                    <input type="checkbox" id="isFree" checked={isFree} onChange={e=>setIsFree(e.target.checked)} />
                                    <Label htmlFor="isFree">Free</Label>
                                </div>
                                <Button type="submit" disabled={savingChapter} className="w-full">Save</Button>
                            </form>
                        </DialogContent>
                    </Dialog>
                </CardHeader>
                <CardContent className="space-y-2 max-h-[500px] overflow-y-auto pr-2 scrollbar-hide">
                    {chapters.map(ch => (
                        <div key={ch.id} 
                             className={`group flex items-center justify-between p-3 border rounded-xl cursor-pointer transition-all ${selectedChapter?.chapter?.id === ch.id ? 'bg-primary/20 border-primary/30 shadow-lg' : 'hover:bg-primary/5 bg-background/40'}`}
                             onClick={() => loadChapterDetails(ch.id)}
                        >
                            <div className="flex items-center gap-3">
                                <span className="font-bold text-xs">{ch.chapterNumber}</span>
                                <h4 className="font-bold text-sm truncate max-w-[120px]">{ch.title}</h4>
                            </div>
                            <div className="flex gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                                <Dialog open={isEditChapterOpen} onOpenChange={setIsEditChapterOpen}>
                                    <DialogTrigger
                                      onClick={(e) => e.stopPropagation()}
                                      render={
                                        <Button variant="ghost" size="icon" className="h-8 w-8 text-primary hover:bg-primary/10">
                                            <FileEdit className="h-3.5 w-3.5" />
                                        </Button>
                                      }
                                    />
                                    <DialogContent className="glass-morphism border-primary/20" onClick={(e) => e.stopPropagation()}>
                                        <DialogHeader>
                                            <DialogTitle>Edit Episode</DialogTitle>
                                        </DialogHeader>
                                        <form onSubmit={handleUpdateChapter} className="space-y-4 pt-4">
                                            <div className="grid grid-cols-4 gap-4">
                                                <Input type="number" value={editChapterNum} onChange={e=>setEditChapterNum(e.target.value)} />
                                                <div className="col-span-3">
                                                   <Input value={editChapterTitle} onChange={e=>setEditChapterTitle(e.target.value)} />
                                                </div>
                                            </div>
                                            <Button type="submit" disabled={updatingChapter} className="w-full">Update</Button>
                                        </form>
                                    </DialogContent>
                                </Dialog>
                                <Button variant="ghost" size="icon" className="h-8 w-8 text-destructive hover:bg-destructive/10" onClick={(e) => { e.stopPropagation(); handleDeleteChapter(ch.id, ch.title); }}>
                                    <Trash2 className="h-3.5 w-3.5" />
                                </Button>
                            </div>
                        </div>
                    ))}
                </CardContent>
            </Card>
        </div>

        <div className="lg:col-span-2">
            {selectedChapter ? (
                <Card className="glass-morphism border-primary/5 shadow-2xl min-h-[600px]">
                    <CardHeader className="flex flex-row items-center justify-between">
                        <div>
                            <CardTitle>Pages: Episode {selectedChapter.chapter.chapterNumber}</CardTitle>
                        </div>
                        <div className="relative">
                            <Input type="file" accept="image/*" onChange={handleUploadPage} disabled={uploadingImage} className="absolute inset-0 opacity-0 cursor-pointer" />
                            <Button disabled={uploadingImage} size="sm">
                                {uploadingImage ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Plus className="h-4 w-4 mr-2" />}
                                Upload
                            </Button>
                        </div>
                    </CardHeader>
                    <CardContent>
                        <div className="grid grid-cols-2 sm:grid-cols-3 md:grid-cols-4 lg:grid-cols-5 gap-4">
                            {selectedChapter.images.map((img: any) => (
                                <div key={img.id} className="relative group rounded-xl border border-primary/5 overflow-hidden aspect-[2/3] bg-muted shadow-lg">
                                    <img src={img.imageUrl} alt={`Page ${img.pageNumber}`} className="object-cover w-full h-full" />
                                    <div className="absolute inset-0 bg-black/60 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col items-center justify-center gap-2">
                                        <span className="text-white font-bold">P.{img.pageNumber}</span>
                                        <Button variant="destructive" size="icon" className="h-8 w-8 rounded-full" onClick={() => handleDeletePage(img.id)}>
                                            <Trash2 className="h-4 w-4" />
                                        </Button>
                                    </div>
                                </div>
                            ))}
                        </div>
                    </CardContent>
                </Card>
            ) : (
                <div className="h-full min-h-[600px] flex flex-col items-center justify-center border-2 border-dashed border-primary/10 rounded-3xl bg-primary/5 backdrop-blur-sm">
                    <BookOpen className="h-16 w-16 mb-4 text-primary opacity-20" />
                    <p className="text-xl font-bold text-muted-foreground opacity-40">Select an Episode</p>
                </div>
            )}
        </div>
      </div>
    </div>
  );
}
