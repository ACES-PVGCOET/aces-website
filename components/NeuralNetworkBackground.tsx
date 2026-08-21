"use client";

import React, { useEffect, useRef } from "react";

export interface NeuralNetworkBackgroundProps {
  /** Multiplier for default node density */
  nodeCountMultiplier?: number;
  /** Maximum pixel distance to form connections between nodes */
  maxConnectionDistance?: number;
  /** Base opacity of nodes (0 to 1) */
  baseNodeOpacity?: number;
  /** Base opacity of connection edges (0 to 1) */
  baseEdgeOpacity?: number;
  /** Interaction radius for click activation (pixels) */
  interactionRadius?: number;
  /** Speed of pulse propagation along edges (progress units / second) */
  pulseSpeed?: number;
  /** Maximum propagation hops outward from click origin */
  maxHops?: number;
  /** Primary RGB color channels for network (e.g. "168, 85, 247" for purple) */
  accentRgb?: string;
  /** Class name for canvas wrapper */
  className?: string;
}

interface Node {
  id: number;
  x: number;
  y: number;
  baseX: number;
  baseY: number;
  radius: number;
  baseOpacity: number;
  activeIntensity: number;
  hoverIntensity: number;
  driftPhase: number;
  driftSpeed: number;
  neighbors: number[];
}

interface Edge {
  id: string;
  from: number;
  to: number;
  length: number;
  baseOpacity: number;
  activeIntensity: number;
  hoverIntensity: number;
}

interface ActivePulse {
  fromNode: number;
  toNode: number;
  progress: number;
  speed: number;
  hop: number;
  maxHops: number;
  intensity: number;
  visitedNodes: Set<number>;
}

export default function NeuralNetworkBackground({
  nodeCountMultiplier = 1.0,
  maxConnectionDistance = 170,
  baseNodeOpacity = 0.03,
  baseEdgeOpacity = 0.02,
  interactionRadius = 240,
  pulseSpeed = 2.2,
  maxHops = 4,
  accentRgb = "168, 85, 247",
  className = "",
}: NeuralNetworkBackgroundProps) {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d");
    if (!ctx) return;

    let animationFrameId: number;
    let width = 0;
    let height = 0;
    let dpr = 1;

    // Check reduced motion preference
    const reducedMotionQuery = window.matchMedia("(prefers-reduced-motion: reduce)");
    let isReducedMotion = reducedMotionQuery.matches;

    const handleMotionPreference = (e: MediaQueryListEvent) => {
      isReducedMotion = e.matches;
    };
    reducedMotionQuery.addEventListener("change", handleMotionPreference);

    // Mouse tracking for subtle hover illumination
    let mouseX = -1000;
    let mouseY = -1000;
    let isMouseOver = false;

    const handleMouseMove = (e: MouseEvent) => {
      mouseX = e.clientX;
      mouseY = e.clientY;
      isMouseOver = true;
    };

    const handleMouseLeave = () => {
      isMouseOver = false;
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    window.addEventListener("mouseleave", handleMouseLeave, { passive: true });

    // Graph Data Structures
    let nodes: Node[] = [];
    let edges: Edge[] = [];
    let edgeLookupMap: Map<string, Edge> = new Map();
    let activePulses: ActivePulse[] = [];

    // Organic non-grid node generator using spatial cell jittering
    const generateGraph = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2);
      width = window.innerWidth;
      height = window.innerHeight;

      canvas.width = width * dpr;
      canvas.height = height * dpr;
      ctx.scale(dpr, dpr);

      nodes = [];
      edges = [];
      edgeLookupMap.clear();
      activePulses = [];

      // Determine target node count based on screen width & breakpoint
      let baseCount = 120;
      if (width < 640) {
        baseCount = 35; // Mobile
      } else if (width < 1024) {
        baseCount = 70; // Tablet
      }
      const targetNodeCount = Math.round(baseCount * nodeCountMultiplier);

      // Grid dimensions for organic distribution
      const cols = Math.ceil(Math.sqrt((targetNodeCount * width) / height));
      const rows = Math.ceil(targetNodeCount / cols);
      const cellW = width / cols;
      const cellH = height / rows;

      let nodeId = 0;
      for (let r = 0; r < rows; r++) {
        for (let c = 0; c < cols; c++) {
          if (nodes.length >= targetNodeCount) break;

          // Jittered position within grid cell with padding
          const jitterX = (Math.random() * 0.75 + 0.125) * cellW;
          const jitterY = (Math.random() * 0.75 + 0.125) * cellH;

          const px = c * cellW + jitterX;
          const py = r * cellH + jitterY;

          // Hub nodes (~12% chance to be slightly larger) - thinner radii
          const isHub = Math.random() < 0.12;
          const radius = isHub ? Math.random() * 0.4 + 1.4 : Math.random() * 0.3 + 0.7;

          // Depth variation: subtle opacity differences per node (toned down)
          const nodeBaseOpacity = Math.max(
            0.015,
            Math.min(0.05, baseNodeOpacity + (Math.random() - 0.5) * 0.03)
          );

          nodes.push({
            id: nodeId++,
            x: px,
            y: py,
            baseX: px,
            baseY: py,
            radius,
            baseOpacity: nodeBaseOpacity,
            activeIntensity: 0,
            hoverIntensity: 0,
            driftPhase: Math.random() * Math.PI * 2,
            driftSpeed: Math.random() * 0.5 + 0.2,
            neighbors: [],
          });
        }
      }

      // Connect nodes based on distance & max degree limit
      const actualMaxDist = Math.max(100, maxConnectionDistance * (width < 640 ? 0.85 : 1.0));
      const maxDegree = 4; // Max connections per node to prevent crowded graphs

      for (let i = 0; i < nodes.length; i++) {
        const nodeA = nodes[i];
        const candidates: { index: number; dist: number }[] = [];

        for (let j = 0; j < nodes.length; j++) {
          if (i === j) continue;
          const nodeB = nodes[j];
          const dist = Math.hypot(nodeA.x - nodeB.x, nodeA.y - nodeB.y);

          if (dist < actualMaxDist) {
            candidates.push({ index: j, dist });
          }
        }

        // Sort candidates by distance
        candidates.sort((a, b) => a.dist - b.dist);

        // Connect to closest available neighbors up to maxDegree
        let connectionsMade = 0;
        for (const cand of candidates) {
          if (connectionsMade >= maxDegree) break;
          if (nodeA.neighbors.length >= maxDegree) break;

          const neighborNode = nodes[cand.index];
          if (neighborNode.neighbors.length >= maxDegree) continue;

          // Check if connection already exists
          if (!nodeA.neighbors.includes(cand.index)) {
            nodeA.neighbors.push(cand.index);
            neighborNode.neighbors.push(i);

            const edgeKey = i < cand.index ? `${i}-${cand.index}` : `${cand.index}-${i}`;
            if (!edgeLookupMap.has(edgeKey)) {
              // Edge opacity decreases slightly with distance for visual depth (toned down)
              const distanceFactor = 1 - cand.dist / actualMaxDist;
              const edgeBaseOpacity = Math.max(
                0.008,
                Math.min(0.035, baseEdgeOpacity * (0.5 + distanceFactor * 0.7))
              );

              const edgeObj: Edge = {
                id: edgeKey,
                from: i,
                to: cand.index,
                length: cand.dist,
                baseOpacity: edgeBaseOpacity,
                activeIntensity: 0,
                hoverIntensity: 0,
              };

              edges.push(edgeObj);
              edgeLookupMap.set(edgeKey, edgeObj);
            }

            connectionsMade++;
          }
        }
      }
    };

    generateGraph();

    // Debounced resize listener
    let resizeTimeout: NodeJS.Timeout;
    const handleResize = () => {
      clearTimeout(resizeTimeout);
      resizeTimeout = setTimeout(() => {
        generateGraph();
      }, 150);
    };
    window.addEventListener("resize", handleResize);

    // CLICK INTERACTION: Propagate graph pulse outward from click coordinate
    const triggerPulseAt = (clickX: number, clickY: number) => {
      if (nodes.length === 0) return;

      // Find all nodes within interactionRadius
      let closestNodeIdx = -1;
      let minDistance = Infinity;

      for (let i = 0; i < nodes.length; i++) {
        const d = Math.hypot(nodes[i].x - clickX, nodes[i].y - clickY);
        if (d < minDistance) {
          minDistance = d;
          closestNodeIdx = i;
        }
      }

      // If user clicked too far from any node, still use nearest node
      if (closestNodeIdx === -1) return;

      const startNode = nodes[closestNodeIdx];
      startNode.activeIntensity = 0.7;

      // Spawn pulses along all edges originating from startNode
      for (const neighborIdx of startNode.neighbors) {
        activePulses.push({
          fromNode: closestNodeIdx,
          toNode: neighborIdx,
          progress: 0,
          speed: pulseSpeed * (0.9 + Math.random() * 0.25),
          hop: 1,
          maxHops,
          intensity: 0.6,
          visitedNodes: new Set([closestNodeIdx]),
        });
      }
    };

    // Global click/pointer listener to trigger network activation
    const handlePointerDown = (e: MouseEvent) => {
      triggerPulseAt(e.clientX, e.clientY);
    };
    window.addEventListener("pointerdown", handlePointerDown);

    // Occasional faint idle micro-pulse
    let lastIdlePulseTime = performance.now();
    const idlePulseInterval = 5500; // milliseconds

    // Main Animation Loop
    let lastTime = performance.now();

    const render = (time: number) => {
      const deltaTime = Math.min((time - lastTime) / 1000, 0.1);
      lastTime = time;

      ctx.clearRect(0, 0, width, height);

      // 1. UPDATE IDLE ANIMATION & DRIFT (unless reduced motion is active)
      if (!isReducedMotion) {
        // Slow sub-pixel node floating
        const tSec = time * 0.001;
        for (let i = 0; i < nodes.length; i++) {
          const n = nodes[i];
          const offsetX = Math.sin(tSec * n.driftSpeed + n.driftPhase) * 2.0;
          const offsetY = Math.cos(tSec * n.driftSpeed * 0.8 + n.driftPhase) * 2.0;
          n.x = n.baseX + offsetX;
          n.y = n.baseY + offsetY;
        }

        // Trigger occasional faint idle micro-pulse
        if (time - lastIdlePulseTime > idlePulseInterval) {
          lastIdlePulseTime = time;
          if (nodes.length > 0 && Math.random() < 0.6) {
            const randomNodeIdx = Math.floor(Math.random() * nodes.length);
            const randomNode = nodes[randomNodeIdx];
            if (randomNode.neighbors.length > 0) {
              const targetNeighbor =
                randomNode.neighbors[
                  Math.floor(Math.random() * randomNode.neighbors.length)
                ];
              activePulses.push({
                fromNode: randomNodeIdx,
                toNode: targetNeighbor,
                progress: 0,
                speed: pulseSpeed * 0.7,
                hop: 1,
                maxHops: 2,
                intensity: 0.18,
                visitedNodes: new Set([randomNodeIdx]),
              });
            }
          }
        }
      }

      // 2. UPDATE ACTIVE GRAPH PULSES
      const remainingPulses: ActivePulse[] = [];

      for (let i = 0; i < activePulses.length; i++) {
        const p = activePulses[i];
        p.progress += p.speed * deltaTime;

        const fromN = nodes[p.fromNode];
        const toN = nodes[p.toNode];

        if (!fromN || !toN) continue;

        // Light up source node & edge during travel
        fromN.activeIntensity = Math.max(
          fromN.activeIntensity,
          p.intensity * (1 - p.progress * 0.5)
        );

        const edgeKey =
          p.fromNode < p.toNode
            ? `${p.fromNode}-${p.toNode}`
            : `${p.toNode}-${p.fromNode}`;
        const edgeObj = edgeLookupMap.get(edgeKey);

        if (edgeObj) {
          const pulseIntensityFactor = Math.sin(p.progress * Math.PI);
          edgeObj.activeIntensity = Math.max(
            edgeObj.activeIntensity,
            p.intensity * pulseIntensityFactor
          );
        }

        // Pulse arrived at destination node
        if (p.progress >= 1.0) {
          toN.activeIntensity = Math.max(toN.activeIntensity, p.intensity);

          // Propagate to next hop if within maxHops limit
          if (p.hop < p.maxHops && !isReducedMotion) {
            const nextVisited = new Set(p.visitedNodes);
            nextVisited.add(p.toNode);

            for (const neighborIdx of toN.neighbors) {
              if (!nextVisited.has(neighborIdx)) {
                remainingPulses.push({
                  fromNode: p.toNode,
                  toNode: neighborIdx,
                  progress: 0,
                  speed: p.speed * (0.88 + Math.random() * 0.2),
                  hop: p.hop + 1,
                  maxHops: p.maxHops,
                  intensity: p.intensity * 0.6, // Decay intensity per hop
                  visitedNodes: nextVisited,
                });
              }
            }
          }
        } else {
          remainingPulses.push(p);
        }
      }
      activePulses = remainingPulses;

      // 3. DECAY ACTIVE & HOVER INTENSITIES
      const decayRate = deltaTime * 1.6; // Fades out smoothly

      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        n.activeIntensity = Math.max(0, n.activeIntensity - decayRate);

        // Hover intensity calculation
        if (isMouseOver) {
          const dist = Math.hypot(n.x - mouseX, n.y - mouseY);
          const hoverRadius = 140;
          if (dist < hoverRadius) {
            const targetHover = (1 - dist / hoverRadius) * 0.15;
            n.hoverIntensity += (targetHover - n.hoverIntensity) * 0.15;
          } else {
            n.hoverIntensity *= 0.88;
          }
        } else {
          n.hoverIntensity *= 0.88;
        }
      }

      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        e.activeIntensity = Math.max(0, e.activeIntensity - decayRate);

        const n1 = nodes[e.from];
        const n2 = nodes[e.to];
        if (n1 && n2) {
          e.hoverIntensity = (n1.hoverIntensity + n2.hoverIntensity) * 0.5;
        }
      }

      // 4. DRAW GRAPH EDGES (CONNECTIONS) - Thin lines & low opacity
      for (let i = 0; i < edges.length; i++) {
        const e = edges[i];
        const nA = nodes[e.from];
        const nB = nodes[e.to];
        if (!nA || !nB) continue;

        const combinedAlpha = Math.min(
          0.45,
          e.baseOpacity + e.hoverIntensity * 0.15 + e.activeIntensity * 0.4
        );

        ctx.beginPath();
        ctx.moveTo(nA.x, nA.y);
        ctx.lineTo(nB.x, nB.y);

        if (e.activeIntensity > 0.08) {
          // Illuminated active pulse edge (thin & subtle)
          ctx.strokeStyle = `rgba(216, 180, 254, ${combinedAlpha})`;
          ctx.lineWidth = 0.4 + e.activeIntensity * 0.4;
          ctx.shadowColor = `rgba(${accentRgb}, 0.4)`;
          ctx.shadowBlur = e.activeIntensity * 4;
        } else {
          // Normal barely visible background trace (thin line)
          ctx.strokeStyle = `rgba(${accentRgb}, ${combinedAlpha})`;
          ctx.lineWidth = 0.25 + e.hoverIntensity * 0.15;
          ctx.shadowBlur = 0;
        }

        ctx.stroke();
        ctx.shadowBlur = 0;
      }

      // 5. DRAW ACTIVE TRAVELING PULSE HEADS
      for (let i = 0; i < activePulses.length; i++) {
        const p = activePulses[i];
        const nA = nodes[p.fromNode];
        const nB = nodes[p.toNode];
        if (!nA || !nB) continue;

        const pulseX = nA.x + (nB.x - nA.x) * p.progress;
        const pulseY = nA.y + (nB.y - nA.y) * p.progress;

        const headAlpha = Math.min(
          0.6,
          p.intensity * Math.sin(p.progress * Math.PI) * 0.8
        );

        ctx.beginPath();
        ctx.arc(pulseX, pulseY, 1.2 + p.intensity * 0.4, 0, Math.PI * 2);
        ctx.fillStyle = `rgba(245, 235, 255, ${headAlpha})`;
        ctx.shadowColor = `rgba(${accentRgb}, 0.5)`;
        ctx.shadowBlur = 4 * p.intensity;
        ctx.fill();
        ctx.shadowBlur = 0;
      }

      // 6. DRAW NODES (Thin / small & subtle opacity)
      for (let i = 0; i < nodes.length; i++) {
        const n = nodes[i];
        const nodeAlpha = Math.min(
          0.5,
          n.baseOpacity + n.hoverIntensity * 0.18 + n.activeIntensity * 0.45
        );

        const currentRadius = n.radius + n.activeIntensity * 0.6 + n.hoverIntensity * 0.3;

        ctx.beginPath();
        ctx.arc(n.x, n.y, currentRadius, 0, Math.PI * 2);

        if (n.activeIntensity > 0.1) {
          // Active node core
          ctx.fillStyle = `rgba(240, 230, 255, ${nodeAlpha})`;
          ctx.shadowColor = `rgba(${accentRgb}, 0.5)`;
          ctx.shadowBlur = n.activeIntensity * 4;
        } else {
          // Normal background node
          ctx.fillStyle = `rgba(${accentRgb}, ${nodeAlpha})`;
          ctx.shadowBlur = 0;
        }

        ctx.fill();
        ctx.shadowBlur = 0;
      }

      animationFrameId = requestAnimationFrame(render);
    };

    animationFrameId = requestAnimationFrame(render);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("pointerdown", handlePointerDown);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("mouseleave", handleMouseLeave);
      reducedMotionQuery.removeEventListener("change", handleMotionPreference);
      cancelAnimationFrame(animationFrameId);
    };
  }, [
    nodeCountMultiplier,
    maxConnectionDistance,
    baseNodeOpacity,
    baseEdgeOpacity,
    interactionRadius,
    pulseSpeed,
    maxHops,
    accentRgb,
  ]);

  return (
    <canvas
      ref={canvasRef}
      className={`fixed inset-0 pointer-events-none z-0 w-full h-full ${className}`}
      style={{ opacity: 0.85 }}
    />
  );
}
