"use client";

import { useEffect, useState } from "react";
import { useAuth } from "@/contexts/AuthContext";
import { api } from "@/lib/api";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { toast } from "sonner";
import { User, Send, Loader2, MessageSquare, Trash2, Reply } from "lucide-react";
import { Card } from "@/components/ui/card";
import Link from "next/link";
import { buttonVariants } from "@/components/ui/button";

interface CommentSectionProps {
  storyId?: string;
  chapterId?: string;
}

export function CommentSection({ storyId, chapterId }: CommentSectionProps) {
  const { user, isLoading: authLoading } = useAuth();
  const [comments, setComments] = useState<any[]>([]);
  const [content, setContent] = useState("");
  const [loading, setLoading] = useState(true);
  const [posting, setPosting] = useState(false);
  
  // Reply State
  const [replyTo, setReplyTo] = useState<string | null>(null);
  const [replyContent, setReplyContent] = useState("");

  useEffect(() => {
    fetchComments();
  }, [storyId, chapterId]);

  const fetchComments = async () => {
    try {
      const endpoint = storyId ? `/comments/story/${storyId}` : `/comments/chapter/${chapterId}`;
      const data = await api.get(endpoint);
      setComments(data || []);
    } catch (err: any) {
      toast.error("Failed to load community thoughts");
    } finally {
      setLoading(false);
    }
  };

  const handlePost = async (e: React.FormEvent, parentId?: string) => {
    e.preventDefault();
    const activeContent = parentId ? replyContent : content;
    
    if (!user) {
      toast.error("Please login to participate.");
      return;
    }
    if (!activeContent.trim()) return;

    setPosting(true);
    try {
      await api.post("/comments", { 
        storyId, 
        chapterId, 
        content: activeContent,
        parentId: parentId 
      });
      
      if (parentId) {
        setReplyTo(null);
        setReplyContent("");
      } else {
        setContent("");
      }
      
      fetchComments();
      toast.success(parentId ? "Reply manifest complete!" : "Comment captured!");
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setPosting(false);
    }
  };

  const handleDelete = async (commentId: string) => {
    if (!confirm("Erase this contribution from the timeline?")) return;
    try {
      await api.delete(`/comments/${commentId}`);
      toast.success("Contribution erased");
      fetchComments();
    } catch (err: any) {
      toast.error(err.message || "Failed to delete");
    }
  };

  const formatTime = (date: string) => {
    return new Date(date).toLocaleDateString(undefined, {
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit'
    });
  };

  const CommentItem = ({ c, isReply = false }: { c: any, isReply?: boolean }) => (
    <div className={`group relative space-y-3 ${isReply ? 'ml-12 mt-4' : 'border-b border-white/5 pb-8'}`}>
      <div className="flex gap-4">
        <div className={`shrink-0 rounded-full bg-zinc-900 flex items-center justify-center overflow-hidden border border-white/5 shadow-md ${isReply ? 'h-8 w-8' : 'h-10 w-10'}`}>
           {c.userAvatarUrl ? (
             <img src={c.userAvatarUrl} alt={c.userDisplayName} className="h-full w-full object-cover" />
           ) : (
             <User className={isReply ? 'h-4 w-4' : 'h-5 w-5'} />
           )}
        </div>
        <div className="flex-1 min-w-0">
           <div className="flex items-center justify-between mb-1">
              <div className="flex items-center gap-2">
                  <span className={cn(
                    "font-extrabold text-sm transition-all italic uppercase tracking-tighter",
                    c.role === "Admin" ? "neon-text-primary" : "text-white"
                  )}>
                    {c.userDisplayName}
                  </span>
                  {c.userId === user?.id && <span className="text-[10px] bg-accent/20 text-accent px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter glow-accent border border-accent/30">You</span>}
                  {c.role === "Admin" && <span className="text-[10px] bg-primary/20 text-primary px-1.5 py-0.5 rounded font-bold uppercase tracking-tighter glow-primary border border-primary/30">Nexus Creator</span>}
              </div>
              <span className="text-[10px] text-zinc-500 uppercase tracking-widest">{formatTime(c.createdAt)}</span>
           </div>
           <p className="text-sm leading-relaxed text-zinc-400 whitespace-pre-wrap">
             {c.content}
           </p>
           
           <div className="flex items-center gap-4 mt-3">
              {!isReply && user && (
                <button 
                  onClick={() => setReplyTo(replyTo === c.id ? null : c.id)}
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-primary transition-colors flex items-center"
                >
                   <Reply className="h-3 w-3 mr-1" /> Reply
                </button>
              )}
              
              {(user?.id === c.userId || user?.role === "Admin") && (
                <button 
                  onClick={() => handleDelete(c.id)}
                  className="text-[10px] font-black uppercase tracking-widest text-zinc-500 hover:text-destructive transition-colors flex items-center"
                 >
                  <Trash2 className="h-3 w-3 mr-1" /> Delete
                </button>
              )}
           </div>
        </div>
      </div>

      {/* Reply Input Box */}
      {replyTo === c.id && (
        <div className="ml-12 mt-4 space-y-3 animate-in fade-in slide-in-from-top-2 duration-300">
           <Textarea 
             value={replyContent}
             onChange={e => setReplyContent(e.target.value)}
             placeholder={`Replying to ${c.userDisplayName}...`}
             className="bg-zinc-900/50 border-white/5 min-h-[80px] text-sm focus:ring-primary/20"
           />
           <div className="flex justify-end gap-2">
              <Button size="sm" variant="ghost" onClick={() => setReplyTo(null)}>Cancel</Button>
              <Button size="sm" onClick={(e) => handlePost(e, c.id)} disabled={posting || !replyContent.trim()}>
                 {posting ? <Loader2 className="animate-spin h-3 w-3 mr-1" /> : <Send className="h-3 w-3 mr-1" />}
                 Post Reply
              </Button>
           </div>
        </div>
      )}

      {/* Render Nested Replies */}
      {c.replies && c.replies.map((r: any) => (
        <CommentItem key={r.id} c={r} isReply={true} />
      ))}
    </div>
  );

  return (
    <div className="mt-20 space-y-10 max-w-4xl mx-auto mb-32">
      <div className="flex items-center gap-3">
        <div className="h-10 w-10 rounded-xl bg-primary/10 flex items-center justify-center">
           <MessageSquare className="h-5 w-5 text-primary" />
        </div>
        <div>
           <h2 className="text-2xl font-black tracking-tight italic uppercase">Communication Portal</h2>
           <p className="text-xs text-zinc-500 font-bold uppercase tracking-[0.2em]">{comments.length} transmissions captured</p>
        </div>
      </div>

      {/* Post Form */}
      <Card className="border-none bg-zinc-900/30 backdrop-blur-xl shadow-2xl overflow-hidden p-6 ring-1 ring-white/5">
         {!user && !authLoading ? (
            <div className="text-center py-6">
               <p className="text-sm text-zinc-500 mb-6">Authorize your presence to merge with the discussion.</p>
               <Link href="/login" className={cn(buttonVariants({ size: "lg", variant: "default" }), "rounded-full px-8 shadow-primary/10")}>Initialize Login</Link>
            </div>
         ) : authLoading ? (
            <div className="flex justify-center py-6"><Loader2 className="animate-spin h-6 w-6 text-primary" /></div>
         ) : (
            <form onSubmit={handlePost} className="space-y-4">
               <div className="flex gap-4">
                  <div className="h-10 w-10 shrink-0 rounded-full bg-zinc-800 border border-white/5 flex items-center justify-center overflow-hidden">
                     {user?.avatarUrl ? <img src={user.avatarUrl} alt="Avatar" className="h-full w-full object-cover" /> : <User className="h-5 w-5" />}
                  </div>
                   <div className="flex-1 space-y-4">
                      {/* Lore Stickers Bar */}
                      <div className="flex items-center gap-3 p-3 bg-white/5 rounded-2xl border border-white/5 overflow-x-auto no-scrollbar">
                         {['🔥', '✨', '💖', '💀', '😂', '🚀', '🔮', '⚡'].map(s => (
                           <button 
                            key={s} 
                            type="button"
                            onClick={() => setContent(prev => prev + s)}
                            className="h-10 w-10 min-w-[2.5rem] rounded-xl bg-background/50 border border-white/5 flex items-center justify-center hover:scale-110 active:scale-95 transition-all text-xl"
                           >
                            {s}
                           </button>
                         ))}
                      </div>

                      <Textarea 
                        value={content} 
                        onChange={e => setContent(e.target.value)}
                        placeholder="Contribute to the collective wisdom..."
                        className="min-h-[120px] bg-zinc-800/20 border-white/5 focus:ring-primary/20 text-sm rounded-[1.5rem] p-6"
                      />
                   </div>
               </div>
               <div className="flex justify-end">
                  <Button type="submit" disabled={posting || !content.trim()} className="rounded-full px-6">
                    {posting ? <Loader2 className="animate-spin h-4 w-4 mr-2" /> : <Send className="h-4 w-4 mr-2" />}
                    Broadcast Message
                  </Button>
               </div>
            </form>
         )}
      </Card>

      {/* Comment List */}
      <div className="space-y-10 mt-12">
        {loading ? (
          <div className="flex flex-col items-center justify-center p-20 space-y-4">
             <Loader2 className="animate-spin h-8 w-8 text-primary" />
             <p className="text-xs text-zinc-500 uppercase font-black tracking-widest">Decoding transmissions...</p>
          </div>
        ) : comments.length === 0 ? (
          <div className="text-center py-20 bg-zinc-950/40 rounded-3xl border border-dashed border-white/10">
             <MessageSquare className="h-10 w-10 text-zinc-800 mx-auto mb-4" />
             <p className="text-zinc-600 font-medium italic">Silence echoing in the void. Break it.</p>
          </div>
        ) : (
          comments.map((c) => (
            <CommentItem key={c.id} c={c} />
          ))
        )}
      </div>
    </div>
  );
}
