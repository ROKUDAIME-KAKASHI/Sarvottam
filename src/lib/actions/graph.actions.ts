"use server";

import { prisma } from "@/lib/prisma";

export async function seedKnowledgeGraph() {
  const count = await prisma.knowledgeNode.count();
  if (count > 0) return;

  // Create sample nodes
  const prob1 = await prisma.knowledgeNode.create({
    data: { type: "PROBLEM", entityId: "p1", label: "Rural Water Purification" },
  });
  const prob2 = await prisma.knowledgeNode.create({
    data: { type: "PROBLEM", entityId: "p2", label: "Urban Traffic Congestion" },
  });

  const proj1 = await prisma.knowledgeNode.create({
    data: { type: "PROJECT", entityId: "pr1", label: "Solar RO Purifier v1" },
  });
  const proj2 = await prisma.knowledgeNode.create({
    data: { type: "PROJECT", entityId: "pr2", label: "AI Traffic Light Control" },
  });

  const paper1 = await prisma.knowledgeNode.create({
    data: { type: "PAPER", entityId: "pa1", label: "Efficiency of Solar RO in Arid Regions" },
  });

  const patent1 = await prisma.knowledgeNode.create({
    data: { type: "PATENT", entityId: "pat1", label: "Low-cost RO Membrane Design" },
  });
  const startup1 = await prisma.knowledgeNode.create({
    data: { type: "STARTUP", entityId: "st1", label: "AquaSolar Tech" },
  });

  // Link them
  await prisma.knowledgeEdge.createMany({
    data: [
      { sourceId: prob1.id, targetId: proj1.id, relation: "RESOLVED_BY", weight: 0.9 },
      { sourceId: prob2.id, targetId: proj2.id, relation: "RESOLVED_BY", weight: 0.8 },
      { sourceId: proj1.id, targetId: paper1.id, relation: "PUBLISHED_FROM", weight: 0.95 },
      { sourceId: proj1.id, targetId: patent1.id, relation: "RESULTED_IN", weight: 1.0 },
      { sourceId: patent1.id, targetId: startup1.id, relation: "LICENSED_TO", weight: 1.0 },
      { sourceId: prob1.id, targetId: startup1.id, relation: "ADDRESSES", weight: 0.85 },
    ],
  });
}

export async function getKnowledgeGraph() {
  await seedKnowledgeGraph();

  const nodes = await prisma.knowledgeNode.findMany();
  const edges = await prisma.knowledgeEdge.findMany();

  return { nodes, edges };
}

export async function searchGraph(query: string) {
  const nodes = await prisma.knowledgeNode.findMany({
    where: {
      label: { contains: query },
    },
    include: {
      sourceEdges: { include: { target: true } },
      targetEdges: { include: { source: true } },
    },
  });

  return nodes;
}
