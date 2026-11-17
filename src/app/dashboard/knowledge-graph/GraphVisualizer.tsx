"use client";

import { useState, useMemo } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Badge } from "@/components/ui/badge";
import {
  Lightbulb,
  Briefcase,
  FileText,
  Network,
  GraduationCap,
  Sparkles,
  Link as LinkIcon,
  X,
  Maximize2,
} from "lucide-react";

interface GraphNode {
  id: string;
  label: string;
  type: string;
  metadata?: any;
}

interface GraphEdge {
  id: string;
  sourceId: string;
  targetId: string;
  relation: string;
}

interface GraphVisualizerProps {
  nodes: GraphNode[];
  edges: GraphEdge[];
}

export function GraphVisualizer({ nodes, edges }: GraphVisualizerProps) {
  const [selectedNodeId, setSelectedNodeId] = useState<string | null>(null);
  const [typeFilter, setTypeFilter] = useState<string>("ALL");

  const types = useMemo(() => {
    const set = new Set<string>();
    nodes.forEach((n) => set.add(n.type));
    return Array.from(set);
  }, [nodes]);

  const filteredNodes = useMemo(() => {
    if (typeFilter === "ALL") return nodes;
    return nodes.filter((n) => n.type === typeFilter);
  }, [nodes, typeFilter]);

  // Position nodes radially for stable, visually appealing layout
  const positionedNodes = useMemo(() => {
    const width = 700;
    const height = 400;
    const centerX = width / 2;
    const centerY = height / 2;
    const radius = Math.min(width, height) * 0.36;

    return filteredNodes.map((node, i) => {
      const angle = (2 * Math.PI * i) / (filteredNodes.length || 1);
      const x = centerX + radius * Math.cos(angle);
      const y = centerY + radius * Math.sin(angle);
      return { ...node, x, y };
    });
  }, [filteredNodes]);

  const selectedNode = useMemo(() => {
    return nodes.find((n) => n.id === selectedNodeId) || null;
  }, [nodes, selectedNodeId]);

  const connectedEdges = useMemo(() => {
    if (!selectedNodeId) return edges;
    return edges.filter((e) => e.sourceId === selectedNodeId || e.targetId === selectedNodeId);
  }, [edges, selectedNodeId]);

  const getNodeColor = (type: string) => {
    switch (type) {
      case "PROBLEM":
        return { bg: "#f97316", text: "#fff", ring: "#ffedd5" };
      case "PROJECT":
        return { bg: "#3b82f6", text: "#fff", ring: "#dbeafe" };
      case "PAPER":
        return { bg: "#a855f7", text: "#fff", ring: "#f3e8ff" };
      case "STARTUP":
        return { bg: "#10b981", text: "#fff", ring: "#d1fae5" };
      default:
        return { bg: "#6b7280", text: "#fff", ring: "#f3f4f6" };
    }
  };

  const getNodeIcon = (type: string) => {
    switch (type) {
      case "PROBLEM":
        return <Lightbulb className="w-3.5 h-3.5 text-orange-500" />;
      case "PROJECT":
        return <Briefcase className="w-3.5 h-3.5 text-blue-500" />;
      case "PAPER":
        return <FileText className="w-3.5 h-3.5 text-purple-500" />;
      case "STARTUP":
        return <Network className="w-3.5 h-3.5 text-emerald-500" />;
      default:
        return <GraduationCap className="w-3.5 h-3.5 text-gray-500" />;
    }
  };

  if (nodes.length === 0) {
    return (
      <div className="h-64 flex flex-col items-center justify-center text-center p-6 border-2 border-dashed border-border/60 rounded-2xl bg-muted/20">
        <Network className="h-10 w-10 text-muted-foreground mb-2" />
        <p className="text-sm font-semibold text-foreground">
          No knowledge graph nodes indexed yet
        </p>
        <p className="text-xs text-muted-foreground mt-1 max-w-sm">
          As problems and projects are approved, semantic relationship vectors will automatically
          populate this canvas.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-4">
      {/* Filter toolbar */}
      <div className="flex flex-wrap items-center justify-between gap-3 pb-2 border-b border-border/40 text-xs">
        <div className="flex items-center gap-1.5 flex-wrap">
          <span className="text-muted-foreground font-mono mr-1">Filter Nodes:</span>
          <button
            onClick={() => setTypeFilter("ALL")}
            className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
              typeFilter === "ALL"
                ? "bg-primary text-primary-foreground font-semibold"
                : "bg-muted text-muted-foreground hover:text-foreground"
            }`}
          >
            All Types ({nodes.length})
          </button>
          {types.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-2.5 py-1 rounded-lg transition-colors cursor-pointer ${
                typeFilter === t
                  ? "bg-primary text-primary-foreground font-semibold"
                  : "bg-muted text-muted-foreground hover:text-foreground"
              }`}
            >
              {t} ({nodes.filter((n) => n.type === t).length})
            </button>
          ))}
        </div>

        <span className="text-[11px] font-mono text-muted-foreground">
          INTERACTIVE SVG CANVAS // CLICK NODE TO INSPECT
        </span>
      </div>

      {/* SVG Canvas & Inspector Card */}
      <div className="relative rounded-2xl border border-border/60 bg-muted/10 overflow-hidden">
        <svg viewBox="0 0 700 400" className="w-full h-[360px] select-none">
          {/* Subtle background grid pattern */}
          <defs>
            <pattern id="graph-grid" width="24" height="24" patternUnits="userSpaceOnUse">
              <path
                d="M 24 0 L 0 0 0 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="0.5"
                className="text-border/40"
              />
            </pattern>
          </defs>
          <rect width="100%" height="100%" fill="url(#graph-grid)" />

          {/* Render connecting edges */}
          {edges.map((edge) => {
            const src = positionedNodes.find((n) => n.id === edge.sourceId);
            const tgt = positionedNodes.find((n) => n.id === edge.targetId);
            if (!src || !tgt) return null;

            const isHighlighted =
              selectedNodeId && (src.id === selectedNodeId || tgt.id === selectedNodeId);

            return (
              <g key={edge.id}>
                <line
                  x1={src.x}
                  y1={src.y}
                  x2={tgt.x}
                  y2={tgt.y}
                  stroke={isHighlighted ? "var(--primary)" : "currentColor"}
                  strokeWidth={isHighlighted ? 2.5 : 1.2}
                  strokeDasharray={isHighlighted ? "none" : "3 3"}
                  className={isHighlighted ? "" : "text-muted-foreground/40"}
                />
                {/* Edge midpoint relation pill */}
                <circle
                  cx={(src.x + tgt.x) / 2}
                  cy={(src.y + tgt.y) / 2}
                  r={3}
                  fill={isHighlighted ? "var(--primary)" : "currentColor"}
                  className={isHighlighted ? "" : "text-muted-foreground/60"}
                />
              </g>
            );
          })}

          {/* Render nodes */}
          {positionedNodes.map((node) => {
            const isSelected = selectedNodeId === node.id;
            const color = getNodeColor(node.type);

            return (
              <g
                key={node.id}
                onClick={() => setSelectedNodeId(isSelected ? null : node.id)}
                className="cursor-pointer transition-transform duration-200"
              >
                {/* Outer pulse ring for selected */}
                {isSelected && (
                  <circle
                    cx={node.x}
                    cy={node.y}
                    r={26}
                    fill="none"
                    stroke={color.bg}
                    strokeWidth={2}
                    opacity={0.4}
                  />
                )}
                {/* Main Node Circle */}
                <circle
                  cx={node.x}
                  cy={node.y}
                  r={18}
                  fill={color.bg}
                  stroke="#ffffff"
                  strokeWidth={2}
                  className="shadow-md"
                />
                {/* Node icon label initial */}
                <text
                  x={node.x}
                  y={node.y + 4}
                  textAnchor="middle"
                  fill="#ffffff"
                  fontSize="10"
                  fontWeight="bold"
                  fontFamily="monospace"
                >
                  {node.type.charAt(0)}
                </text>
                {/* Node text label below */}
                <text
                  x={node.x}
                  y={node.y + 32}
                  textAnchor="middle"
                  fill="currentColor"
                  fontSize="10"
                  fontWeight={isSelected ? "bold" : "normal"}
                  className="text-foreground pointer-events-none"
                >
                  {node.label.length > 18 ? node.label.slice(0, 16) + "…" : node.label}
                </text>
              </g>
            );
          })}
        </svg>

        {/* Selected Node Details Drawer */}
        {selectedNode && (
          <div className="absolute top-3 right-3 max-w-xs p-4 rounded-xl border border-border bg-card/95 backdrop-blur-md shadow-xl text-xs space-y-2 animate-in fade-in zoom-in-95 duration-150">
            <div className="flex items-start justify-between gap-2">
              <div className="flex items-center gap-1.5">
                {getNodeIcon(selectedNode.type)}
                <Badge variant="outline" className="text-[10px] font-mono">
                  {selectedNode.type}
                </Badge>
              </div>
              <button
                onClick={() => setSelectedNodeId(null)}
                className="text-muted-foreground hover:text-foreground"
              >
                <X className="h-3.5 w-3.5" />
              </button>
            </div>

            <div className="font-bold text-sm text-foreground leading-snug">
              {selectedNode.label}
            </div>

            <div className="pt-2 border-t border-border/40 text-[11px] text-muted-foreground space-y-1">
              <div>
                Connected Relationships:{" "}
                <strong className="text-foreground">{connectedEdges.length}</strong>
              </div>
              <div className="font-mono text-[10px]">NODE_ID: {selectedNode.id}</div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}
