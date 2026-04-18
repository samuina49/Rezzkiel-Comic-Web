"use client"

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import { Button, buttonVariants } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { toast } from "sonner";
import Link from "next/link";
import { ChevronLeft, Plus, Image as ImageIcon, Link as LinkIcon, Trash2 } from "lucide-react";

export default function AdminLoreDashboard() {
  const params = useParams();
  const storyId = params.id as string;
  const { token } = useAuth();
  
  const [characters, setCharacters] = useState<any[]>([]);
  const [relations, setRelations] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  // New Character Form
  const [name, setName] = useState("");
  const [shortLore, setShortLore] = useState("");
  const [detailedLore, setDetailedLore] = useState("");
  const [isCreatingChar, setIsCreatingChar] = useState(false);

  // New Relation Form
  const [char1, setChar1] = useState("");
  const [char2, setChar2] = useState("");
  const [relType, setRelType] = useState("");
  const [relDesc, setRelDesc] = useState("");
  const [isCreatingRel, setIsCreatingRel] = useState(false);

  useEffect(() => {
    if (token) fetchGraph();
  }, [token, storyId]);

  const fetchGraph = async () => {
    try {
      const data = await api.get(`/characters/graph/story/${storyId}`, token!);
      setCharacters(data.nodes || []);
      setRelations(data.edges || []);
    } catch (e: any) {
      toast.error(e.message || "Failed to load lore mappings.");
    } finally {
      setLoading(false);
    }
  };

  const handleCreateCharacter = async (e: React.FormEvent) => {
    e.preventDefault();
    setIsCreatingChar(true);
    try {
      await api.post("/characters", { storyId, name, shortLore, detailedLore }, token!);
      toast.success("Character Created");
      setName(""); setShortLore(""); setDetailedLore("");
      fetchGraph();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsCreatingChar(false);
    }
  };

  const handleDeleteCharacter = async (id: string) => {
    if(!confirm("Are you sure? This deletes relationships too.")) return;
    try {
      await fetch(`http://localhost:5042/api/characters/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
      toast.success("Character Deleted");
      fetchGraph();
    } catch (e: any) {
      toast.error("Failed to delete");
    }
  };

  const handleCreateRelation = async (e: React.FormEvent) => {
    e.preventDefault();
    if (char1 === char2) return toast.error("Select different characters.");
    setIsCreatingRel(true);
    try {
      await api.post("/characters/relations", { character1Id: char1, character2Id: char2, relationType: relType, description: relDesc }, token!);
      toast.success("Relationship Established");
      setChar1(""); setChar2(""); setRelType(""); setRelDesc("");
      fetchGraph();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setIsCreatingRel(false);
    }
  };

  const handleDeleteRelation = async (id: string) => {
    try {
      await fetch(`http://localhost:5000/api/characters/relations/${id}`, { method: "DELETE", headers: { "Authorization": `Bearer ${token}` } });
      toast.success("Relationship Removed");
      fetchGraph();
    } catch {
      toast.error("Failed to remove relation");
    }
  };

  const getCharName = (id: string) => characters.find(c => c.id === id)?.name || "Unknown";

  if (loading) return <div>Loading Lore Context...</div>;

  return (
    <div className="space-y-8 max-w-6xl mx-auto">
      <div className="flex items-center space-x-4">
        <Link href={`/admin/stories/${storyId}`} className={buttonVariants({ variant: "ghost", size: "icon" })}>
          <ChevronLeft className="h-5 w-5" />
        </Link>
        <div>
          <h1 className="text-2xl font-bold tracking-tight">Lore Mapping Dashboard</h1>
          <p className="text-sm text-muted-foreground">Manage characters and their relationships securely.</p>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
        
        {/* CHARACTER CREATION */}
        <Card>
          <CardHeader>
             <CardTitle>Register Character</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateCharacter} className="space-y-4">
              <div className="space-y-2">
                <Label>Name</Label>
                <Input value={name} onChange={e => setName(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Short Summary</Label>
                <Input value={shortLore} onChange={e => setShortLore(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Detailed Lore</Label>
                <Textarea value={detailedLore} onChange={e => setDetailedLore(e.target.value)} className="h-24" />
              </div>
              <Button type="submit" disabled={isCreatingChar} className="w-full">
                 <Plus className="mr-2 h-4 w-4" /> Add Character
              </Button>
            </form>
          </CardContent>
        </Card>

        {/* RELATIONSHIP CREATION */}
        <Card>
          <CardHeader>
             <CardTitle>Link Relationship</CardTitle>
          </CardHeader>
          <CardContent>
            <form onSubmit={handleCreateRelation} className="space-y-4">
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                   <Label>Character A</Label>
                   <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={char1} onChange={e=>setChar1(e.target.value)} required>
                     <option value="">Select...</option>
                     {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                </div>
                <div className="space-y-2">
                   <Label>Character B</Label>
                   <select className="flex h-10 w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background" value={char2} onChange={e=>setChar2(e.target.value)} required>
                     <option value="">Select...</option>
                     {characters.map(c => <option key={c.id} value={c.id}>{c.name}</option>)}
                   </select>
                </div>
              </div>
              <div className="space-y-2">
                <Label>Relationship Label (ex: "Siblings", "Nemesis")</Label>
                <Input value={relType} onChange={e => setRelType(e.target.value)} required />
              </div>
              <div className="space-y-2">
                <Label>Secret Details / Context</Label>
                <Input value={relDesc} onChange={e => setRelDesc(e.target.value)} />
              </div>
              <Button type="submit" variant="secondary" disabled={isCreatingRel || characters.length < 2} className="w-full">
                 <LinkIcon className="mr-2 h-4 w-4" /> Link Entities
              </Button>
            </form>
          </CardContent>
        </Card>
      </div>

      {/* RENDER CURRENT ENTITIES */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
         <Card>
           <CardHeader><CardTitle>Mapped Characters ({characters.length})</CardTitle></CardHeader>
           <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
             {characters.map(c => (
               <div key={c.id} className="flex justify-between items-center p-3 border rounded-md text-sm bg-muted/20">
                 <span className="font-bold">{c.name}</span>
                 <Button variant="ghost" size="icon" onClick={() => handleDeleteCharacter(c.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
               </div>
             ))}
           </CardContent>
         </Card>
         <Card>
           <CardHeader><CardTitle>Active Edges ({relations.length})</CardTitle></CardHeader>
           <CardContent className="space-y-2 max-h-[300px] overflow-y-auto">
             {relations.map(r => (
               <div key={r.id} className="flex justify-between items-center p-3 border rounded-md text-sm bg-muted/20">
                 <div className="font-medium text-xs">
                    {getCharName(r.character1Id)} <span className="text-primary mx-2">--[{r.relationType}]--&gt;</span> {getCharName(r.character2Id)}
                 </div>
                 <Button variant="ghost" size="icon" onClick={() => handleDeleteRelation(r.id)} className="text-destructive hover:bg-destructive/10"><Trash2 className="h-4 w-4" /></Button>
               </div>
             ))}
           </CardContent>
         </Card>
      </div>
    </div>
  );
}
