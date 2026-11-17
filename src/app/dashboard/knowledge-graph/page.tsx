import { getKnowledgeGraph } from "@/lib/actions/graph.actions";
import { auth } from "@/auth";
import { redirect } from "next/navigation";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Network,
  Link as LinkIcon,
  FileText,
  Briefcase,
  Lightbulb,
  GraduationCap,
} from "lucide-react";
import SearchGraphClient from "./SearchGraphClient";
import { GraphVisualizer } from "./GraphVisualizer";

export default async function KnowledgeGraphPage() {
  const session = await auth();
  if (!session) redirect("/login");

  const { nodes, edges } = await getKnowledgeGraph();

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "PROBLEM":
        return <Lightbulb className="w-4 h-4 text-orange-500" />;
      case "PROJECT":
        return <Briefcase className="w-4 h-4 text-blue-500" />;
      case "PAPER":
        return <FileText className="w-4 h-4 text-purple-500" />;
      case "STARTUP":
        return <Network className="w-4 h-4 text-green-500" />;
      default:
        return <GraduationCap className="w-4 h-4 text-gray-500" />;
    }
  };

  const getTargetNode = (targetId: string) => nodes.find((n) => n.id === targetId);
  const getSourceNode = (sourceId: string) => nodes.find((n) => n.id === sourceId);

  return (
    <div className="flex-1 space-y-6 p-6 md:p-8 pt-6">
      <div className="flex items-center space-x-3 mb-2">
        <div className="p-3 bg-primary/10 rounded-2xl">
          <Network className="w-7 h-7 text-primary" />
        </div>
        <div>
          <h2 className="text-3xl font-extrabold tracking-tight">Semantic Knowledge Graph</h2>
          <p className="text-sm text-muted-foreground">
            Explore topological relationships between industry problems, academic workspaces, and
            research artifacts.
          </p>
        </div>
      </div>

      {/* Interactive Visual Network Canvas */}
      <Card className="rounded-2xl border-border/60">
        <CardHeader>
          <CardTitle className="text-lg">Network Topology View</CardTitle>
          <CardDescription>
            Visual graph mapping cross-institutional lineages between challenges and research
            solutions.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <GraphVisualizer nodes={nodes} edges={edges} />
        </CardContent>
      </Card>

      <div className="grid gap-6 md:grid-cols-2">
        <Card className="md:col-span-2 rounded-2xl border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">Semantic Natural Language Search</CardTitle>
            <CardDescription>
              Explore the graph using semantic queries or concept keywords.
            </CardDescription>
          </CardHeader>
          <CardContent>
            <SearchGraphClient />
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">Ecosystem Lineages</CardTitle>
            <CardDescription>Verified connected relationship tuples</CardDescription>
          </CardHeader>
          <CardContent className="space-y-3">
            {edges.length === 0 ? (
              <div className="text-xs text-muted-foreground py-6 text-center">
                No active relationship lineages recorded yet.
              </div>
            ) : (
              edges.map((edge) => {
                const src = getSourceNode(edge.sourceId);
                const tgt = getTargetNode(edge.targetId);
                if (!src || !tgt) return null;

                return (
                  <div
                    key={edge.id}
                    className="flex items-center space-x-2 text-xs bg-muted/30 border border-border/40 p-3 rounded-xl"
                  >
                    <div
                      className="flex items-center space-x-1.5 font-semibold w-1/3 truncate"
                      title={src.label}
                    >
                      {getNodeIcon(src.type)}
                      <span className="truncate">{src.label}</span>
                    </div>

                    <div className="flex-1 flex flex-col items-center justify-center px-2">
                      <span className="text-[9px] uppercase text-primary font-mono font-bold tracking-wider">
                        {edge.relation}
                      </span>
                      <div className="w-full h-px bg-border my-1 flex items-center justify-center">
                        <LinkIcon className="w-3 h-3 text-muted-foreground bg-card px-0.5" />
                      </div>
                    </div>

                    <div
                      className="flex items-center space-x-1.5 font-semibold w-1/3 truncate"
                      title={tgt.label}
                    >
                      {getNodeIcon(tgt.type)}
                      <span className="truncate">{tgt.label}</span>
                    </div>
                  </div>
                );
              })
            )}
          </CardContent>
        </Card>

        <Card className="rounded-2xl border-border/60">
          <CardHeader>
            <CardTitle className="text-lg">Network Statistics</CardTitle>
            <CardDescription>Indexed nodes and semantic links</CardDescription>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-xs text-muted-foreground">Total Indexed Nodes</span>
              <span className="font-mono font-bold text-base">{nodes.length}</span>
            </div>
            <div className="flex justify-between items-center border-b border-border/40 pb-2.5">
              <span className="text-xs text-muted-foreground">Active Semantic Edges</span>
              <span className="font-mono font-bold text-base">{edges.length}</span>
            </div>

            <div className="pt-2 space-y-2">
              <p className="font-semibold text-xs text-foreground">Node Distribution by Category</p>
              {Array.from(new Set(nodes.map((n) => n.type))).map((type) => (
                <div key={type} className="flex justify-between text-xs">
                  <span className="text-muted-foreground font-mono">{type}</span>
                  <span className="font-bold">{nodes.filter((n) => n.type === type).length}</span>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
