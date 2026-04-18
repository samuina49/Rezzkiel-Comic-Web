"use client";

import React, { useEffect, useState, useCallback, useMemo } from "react";
import { useParams } from "next/navigation";
import { api } from "@/lib/api";
import { useAuth } from "@/contexts/AuthContext";
import {
  ReactFlow,
  MiniMap,
  Controls,
  Background,
  useNodesState,
  useEdgesState,
  Edge,
  Node,
  BackgroundVariant
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import { Dialog, DialogContent, DialogHeader, DialogTitle, DialogDescription } from "@/components/ui/dialog";
import { Button, buttonVariants } from "@/components/ui/button";
import { ChevronLeft, Maximize2 } from "lucide-react";
import Link from "next/link";
import { toast } from "sonner";

export default function LoreGraphPage() {
  const params = useParams();
  const storyId = params.id as string;
  const { token } = useAuth(); // If needed for locked stories, backend handles checking

  const [nodes, setNodes, onNodesChange] = useNodesState<Node>([]);
  const [edges, setEdges, onEdgesChange] = useEdgesState<Edge>([]);
  
  const [loading, setLoading] = useState(true);
  const [selectedCharacter, setSelectedCharacter] = useState<any>(null);

  useEffect(() => {
    fetchGraphData();
  }, [storyId, token]);

  const fetchGraphData = async () => {
    try {
      const data = await api.get(`/characters/graph/story/${storyId}`, token || undefined);
      
      const charNodes = data.nodes || [];
      const charEdges = data.edges || [];

      // Circular Layout Formula
      const radius = 250;
      const center = { x: 400, y: 300 };

      const processedNodes: Node[] = charNodes.map((char: any, i: number) => {
         const angle = (i / charNodes.length) * 2 * Math.PI;
         return {
           id: char.id,
           position: { 
             x: center.x + radius * Math.cos(angle), 
             y: center.y + radius * Math.sin(angle) 
           },
           data: { label: char.name, fullData: char },
           // Styling the ReactFlow nodes
           style: { 
             background: "#18181b", 
             color: "#fff", 
             border: "2px solid #3f3f46", 
             borderRadius: "8px",
             padding: "10px 20px",
             fontWeight: "bold",
             width: 150,
             textAlign: "center"
           }
         };
      });

      const processedEdges: Edge[] = charEdges.map((rel: any) => ({
         id: rel.id,
         source: rel.character1Id,
         target: rel.character2Id,
         label: rel.relationType,
         type: "straight",
         labelBgStyle: { fill: "#18181b", color: "#fff", rx: 4, ry: 4 },
         labelStyle: { fill: "#fff", fontWeight: "bold" },
         style: { stroke: "#71717a", strokeWidth: 2 }
      }));

      setNodes(processedNodes);
      setEdges(processedEdges);

    } catch (err: any) {
      toast.error(err.message || "Failed to load lore map.");
    } finally {
      setLoading(false);
    }
  };

  const onNodeClick = useCallback((event: React.MouseEvent, node: Node) => {
    setSelectedCharacter(node.data.fullData);
  }, []);

  if (loading) return <div className="h-screen flex text-white bg-black items-center justify-center">Initializing Neuro-Links...</div>;

  return (
    <div className="w-full h-screen bg-black relative flex flex-col pt-14">
      {/* Absolute top nav floating above canvas */}
      <nav className="absolute top-0 w-full h-14 bg-background/80 backdrop-blur z-50 flex items-center px-4 border-b border-border shadow-sm">
        <Link href={`/story/${storyId}`} className={buttonVariants({ variant: "ghost", size: "sm" })}>
          <ChevronLeft className="h-4 w-4 mr-1" /> Return to Story
        </Link>
        <div className="flex-1 text-center font-bold tracking-widest uppercase truncate px-4">
           Lore Visualizer
        </div>
        <div className="w-[100px]" /> {/* Spacer */}
      </nav>

      {/* React Flow Canvas */}
      <div className="flex-1 w-full relative">
        <ReactFlow
          nodes={nodes}
          edges={edges}
          onNodesChange={onNodesChange}
          onEdgesChange={onEdgesChange}
          onNodeClick={onNodeClick}
          fitView
          colorMode="dark"
        >
          <Background variant={BackgroundVariant.Dots} gap={24} size={2} color="#333" />
          <Controls />
          <MiniMap nodeColor="#3f3f46" maskColor="rgba(0,0,0,0.7)" style={{ backgroundColor: "#18181b" }} />
        </ReactFlow>
      </div>

      {/* Character Dialog */}
      <Dialog open={!!selectedCharacter} onOpenChange={(open) => !open && setSelectedCharacter(null)}>
        <DialogContent className="max-w-md bg-card text-card-foreground">
          <DialogHeader>
             <DialogTitle className="text-2xl font-bold">{selectedCharacter?.name}</DialogTitle>
             <DialogDescription>{selectedCharacter?.shortLore}</DialogDescription>
          </DialogHeader>
          <div className="py-4 whitespace-pre-wrap leading-relaxed text-sm">
             {selectedCharacter?.detailedLore || "No deep lore is available for this entity. Their past is shrouded in mystery."}
          </div>
          <div className="flex justify-end mt-4">
             <Button variant="outline" onClick={() => setSelectedCharacter(null)}>Close</Button>
          </div>
        </DialogContent>
      </Dialog>

    </div>
  );
}
