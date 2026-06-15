"use client";

import { useState } from "react";
import { searchGraph } from "@/lib/actions/graph.actions";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { Search, Link as LinkIcon } from "lucide-react";
import { Badge } from "@/components/ui/badge";

export default function SearchGraphClient() {
  const [query, setQuery] = useState("");
  const [loading, setLoading] = useState(false);
  const [results, setResults] = useState<any[] | null>(null);

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!query.trim()) return;
    
    setLoading(true);
    try {
      const res = await searchGraph(query);
      setResults(res);
    } catch (error) {
      console.error(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="space-y-4">
      <form onSubmit={handleSearch} className="flex space-x-2">
        <Input 
          placeholder="e.g. 'Purification' or 'Traffic'" 
          value={query}
          onChange={(e) => setQuery(e.target.value)}
        />
        <Button type="submit" disabled={loading || !query}>
          <Search className="w-4 h-4 mr-2" />
          {loading ? "Searching..." : "Search"}
        </Button>
      </form>

      {results && (
        <div className="mt-4 space-y-4">
          <h3 className="font-semibold text-sm text-muted-foreground">Search Results ({results.length})</h3>
          {results.map(node => (
            <div key={node.id} className="border p-4 rounded-md bg-background">
              <div className="flex justify-between items-start mb-2">
                <span className="font-bold">{node.label}</span>
                <Badge variant="outline">{node.type}</Badge>
              </div>
              
              {node.sourceEdges.length > 0 && (
                <div className="mt-3 text-sm">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Outbound Links</span>
                  <div className="space-y-1 mt-1">
                    {node.sourceEdges.map((edge: any) => (
                      <div key={edge.id} className="flex items-center space-x-2 text-muted-foreground">
                        <LinkIcon className="w-3 h-3" />
                        <span>--[{edge.relation}]--&gt;</span>
                        <span className="font-medium text-foreground">{edge.target.label}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {node.targetEdges.length > 0 && (
                <div className="mt-3 text-sm">
                  <span className="text-muted-foreground text-xs font-semibold uppercase tracking-wider">Inbound Links</span>
                  <div className="space-y-1 mt-1">
                    {node.targetEdges.map((edge: any) => (
                      <div key={edge.id} className="flex items-center space-x-2 text-muted-foreground">
                        <span className="font-medium text-foreground">{edge.source.label}</span>
                        <span>--[{edge.relation}]--&gt;</span>
                        <LinkIcon className="w-3 h-3" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ))}
          {results.length === 0 && <p className="text-sm text-muted-foreground">No matching nodes found in the graph.</p>}
        </div>
      )}
    </div>
  );
}
