import { getKnowledgeGraph } from "@/lib/actions/graph.actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Network, Link as LinkIcon, FileText, Briefcase, Lightbulb, GraduationCap } from "lucide-react";
import SearchGraphClient from "./SearchGraphClient";

export default async function KnowledgeGraphPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { nodes, edges } = await getKnowledgeGraph();

  const getNodeIcon = (type: string) => {
    switch(type) {
      case 'PROBLEM': return <Lightbulb className="w-4 h-4 text-orange-500" />;
      case 'PROJECT': return <Briefcase className="w-4 h-4 text-blue-500" />;
      case 'PAPER': return <FileText className="w-4 h-4 text-purple-500" />;
      case 'PATENT': return <Badge variant="outline" className="text-xs">PATENT</Badge>;
      case 'STARTUP': return <Network className="w-4 h-4 text-green-500" />;
      default: return <GraduationCap className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTargetNode = (targetId: string) => nodes.find(n => n.id === targetId);
  const getSourceNode = (sourceId: string) => nodes.find(n => n.id === sourceId);

  return (
    <div className="flex-1 space-y-4 p-8 pt-6">
      <div className="flex items-center space-x-3 mb-6">
        <div className="p-3 bg-primary/10 rounded-full">
          <Network className="w-8 h-8 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-bold tracking-tight">Knowledge Graph</h2>
          <p className="text-muted-foreground">Discover semantic relationships between problems, research, and startups.</p>
        </div>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2">
          <CardHeader>
            <CardTitle>Semantic Search</CardTitle>
            <CardDescription>Explore the graph using natural language or keywords.</CardDescription>
          </CardHeader>
          <CardContent>
            <SearchGraphClient />
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Ecosystem Flow</CardTitle>
            <CardDescription>Recent connected lineages</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            {edges.map(edge => {
              const src = getSourceNode(edge.sourceId);
              const tgt = getTargetNode(edge.targetId);
              if (!src || !tgt) return null;
              
              return (
                <div key={edge.id} className="flex items-center space-x-2 text-sm bg-secondary/50 p-3 rounded-md">
                  <div className="flex items-center space-x-1 font-medium w-1/3 truncate" title={src.label}>
                    {getNodeIcon(src.type)}
                    <span className="truncate">{src.label}</span>
                  </div>
                  
                  <div className="flex-1 flex flex-col items-center justify-center px-2">
                    <span className="text-[10px] uppercase text-muted-foreground font-bold tracking-wider">{edge.relation}</span>
                    <div className="w-full h-px bg-border my-1 flex items-center justify-center">
                      <LinkIcon className="w-3 h-3 text-muted-foreground bg-secondary/50 px-0.5" />
                    </div>
                  </div>

                  <div className="flex items-center space-x-1 font-medium w-1/3 truncate" title={tgt.label}>
                    {getNodeIcon(tgt.type)}
                    <span className="truncate">{tgt.label}</span>
                  </div>
                </div>
              );
            })}
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle>Network Statistics</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Total Nodes</span>
              <span className="font-bold text-lg">{nodes.length}</span>
            </div>
            <div className="flex justify-between items-center border-b pb-2">
              <span className="text-muted-foreground">Semantic Edges</span>
              <span className="font-bold text-lg">{edges.length}</span>
            </div>
            
            <div className="pt-4 space-y-2">
              <p className="font-medium text-sm">Node Distribution</p>
              {Array.from(new Set(nodes.map(n => n.type))).map(type => (
                <div key={type} className="flex justify-between text-sm">
                  <span className="text-muted-foreground">{type}</span>
                  <span>{nodes.filter(n => n.type === type).length}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

      </div>
    </div>
  );
}
