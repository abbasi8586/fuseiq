"use client";

import { useCallback, useState, useEffect, useRef } from "react";
import {
  ReactFlow,
  Background,
  Controls,
  MiniMap,
  addEdge,
  useNodesState,
  useEdgesState,
  type OnConnect,
  type Node,
  type Edge,
  type Connection,
  Handle,
  Position,
  type EdgeProps,
  BaseEdge,
  getBezierPath,
  MarkerType,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import {
  Bot,
  Zap,
  GitBranch,
  Play,
  Save,
  Trash2,
  Clock,
  CheckCircle2,
  Loader2,
  History,
  Diamond,
  Workflow,
  MousePointer2,
  Plus,
  ChevronDown,
  Box,
  Sparkles,
  GitFork,
  X,
  Settings,
  Copy,
  Hexagon,
  Radio,
  CircleDot,
  Move,
} from "lucide-react";
import { toast } from "sonner";
import { createPortal } from "react-dom";

/* ════════════════════════════════════════════
   FUTURISTIC EDGE — Glowing Data Streams
   ════════════════════════════════════════════ */

function FuturisticEdge({
  id,
  sourceX,
  sourceY,
  targetX,
  targetY,
  sourcePosition,
  targetPosition,
  data,
  markerEnd,
  selected,
}: EdgeProps) {
  const [edgePath] = getBezierPath({
    sourceX,
    sourceY,
    sourcePosition,
    targetX,
    targetY,
    targetPosition,
    curvature: 0.35,
  });

  const color = (data?.color as string) || "#00D4FF";
  const isAnimated = data?.animated !== false;
  const strokeWidth = selected ? 2.5 : 2;

  return (
    <>
      {/* Deep ambient glow layer */}
      <path
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + 16}
        strokeOpacity={0.04}
        style={{ filter: `blur(14px)` }}
      />
      {/* Mid glow layer */}
      <path
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + 8}
        strokeOpacity={0.1}
        style={{ filter: `blur(6px)` }}
      />
      {/* Inner glow */}
      <path
        d={edgePath}
        fill="none"
        stroke={color}
        strokeWidth={strokeWidth + 3}
        strokeOpacity={0.2}
        style={{ filter: `blur(2px)` }}
      />
      <defs>
        <linearGradient id={`edge-grad-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
          <stop offset="0%" stopColor={color} stopOpacity={0.3} />
          <stop offset="50%" stopColor={color} stopOpacity={0.9} />
          <stop offset="100%" stopColor={color} stopOpacity={0.3} />
        </linearGradient>
        {isAnimated && (
          <>
            <linearGradient id={`edge-pulse-${id}`} x1="0%" y1="0%" x2="100%" y2="0%">
              <stop offset="0%" stopColor={color} stopOpacity={0} />
              <stop offset="30%" stopColor={color} stopOpacity={0.4} />
              <stop offset="50%" stopColor="#FFFFFF" stopOpacity={1} />
              <stop offset="70%" stopColor={color} stopOpacity={0.4} />
              <stop offset="100%" stopColor={color} stopOpacity={0} />
            </linearGradient>
            <mask id={`edge-mask-${id}`}>
              <path
                d={edgePath}
                fill="none"
                stroke="white"
                strokeWidth={strokeWidth + 2}
                strokeLinecap="round"
              />
            </mask>
          </>
        )}
      </defs>
      {/* Base stroke */}
      <path
        d={edgePath}
        fill="none"
        stroke={`url(#edge-grad-${id})`}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
      />
      {/* Animated data pulse */}
      {isAnimated && (
        <path
          d={edgePath}
          fill="none"
          stroke={`url(#edge-pulse-${id})`}
          strokeWidth={strokeWidth + 3}
          strokeLinecap="round"
          mask={`url(#edge-mask-${id})`}
          style={{
            animation: "dataFlow 2.5s ease-in-out infinite",
          }}
        />
      )}
      <BaseEdge
        id={id}
        path={edgePath}
        markerEnd={markerEnd}
        style={{ stroke: "transparent", strokeWidth: 20 }}
      />
    </>
  );
}

const edgeTypes = { futuristic: FuturisticEdge };

/* ════════════════════════════════════════════
   FUTURISTIC NODES — Holographic Cards
   ════════════════════════════════════════════ */

function AgentNode({ data, selected }: { data: any; selected?: boolean }) {
  return (
    <div className={`group relative w-[210px] ${selected ? "scale-[1.02]" : ""} transition-transform duration-500`}>
      {/* Animated rotating border glow */}
      <div
        className="absolute -inset-[2px] rounded-2xl z-0 overflow-hidden"
        style={{
          opacity: selected ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <div
          className="absolute inset-[-50%] w-[200%] h-[200%]"
          style={{
            background: "conic-gradient(from 0deg, transparent, #00D4FF, #00E5A0, transparent 30%)",
            animation: "spin 3s linear infinite",
          }}
        />
      </div>
      
      {/* Static subtle glow for hover */}
      <div
        className="absolute -inset-[1px] rounded-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0"
        style={{
          background: "linear-gradient(135deg, rgba(0,212,255,0.3), rgba(0,229,160,0.3))",
          filter: "blur(3px)",
        }}
      />
      
      {/* Main card */}
      <div
        className="relative w-full rounded-2xl overflow-hidden z-10"
        style={{
          background: "linear-gradient(165deg, rgba(12,16,28,0.98) 0%, rgba(6,8,16,0.99) 100%)",
          backdropFilter: "blur(40px)",
          border: selected
            ? "1px solid rgba(0,212,255,0.6)"
            : "1px solid rgba(255,255,255,0.06)",
          boxShadow: selected
            ? "0 0 60px rgba(0,212,255,0.25), 0 0 120px rgba(0,212,255,0.1), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        {/* Top neon line */}
        <div
          className="absolute top-0 left-4 right-4 h-[2px] rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, #00D4FF, #00E5A0, transparent)",
            opacity: selected ? 1 : 0.5,
            boxShadow: selected
              ? "0 0 20px rgba(0,212,255,0.8), 0 0 40px rgba(0,212,255,0.4)"
              : "0 0 10px rgba(0,212,255,0.3)",
          }}
        />

        {/* Cyber corners */}
        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#00D4FF]/40 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#00D4FF]/40 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#00D4FF]/40 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#00D4FF]/40 rounded-br-xl" />

        {/* Holographic sweep */}
        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 30%, rgba(0,212,255,0.04) 45%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "holoSweep 3s ease-in-out infinite",
          }}
        />

        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !border-2 !border-[#00D4FF] !bg-[#06070A] !-top-1.5 !rounded-full !shadow-[0_0_12px_rgba(0,212,255,0.6)] !transition-all !duration-200 hover:!scale-125"
        />

        <div className="px-4 pt-5 pb-3.5 relative z-10">
          {/* Header */}
          <div className="flex items-start gap-3 mb-3">
            <div
              className="relative w-11 h-11 rounded-xl flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(0,229,160,0.08) 100%)",
                border: "1.5px solid rgba(0,212,255,0.3)",
                boxShadow: "0 0 20px rgba(0,212,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
              }}
            >
              <Bot className="w-5 h-5 text-[#00D4FF]" />
              {/* Pulse ring */}
              <div className="absolute -inset-1 rounded-xl border border-[#00D4FF]/20 animate-ping opacity-20" />
              {/* Status dot */}
              <div className="absolute -bottom-1 -right-1 w-4 h-4 rounded-full bg-[#06070A] border-2 border-[#00E5A0]/60 flex items-center justify-center">
                <div className="w-1.5 h-1.5 rounded-full bg-[#00E5A0] animate-pulse" />
              </div>
            </div>
            <div className="flex-1 min-w-0 pt-0.5">
              <p className="text-[13px] font-bold text-white truncate leading-tight tracking-tight">
                {data.label}
              </p>
              <div className="flex items-center gap-1.5 mt-1.5">
                <span
                  className="px-1.5 py-[2px] rounded text-[9px] font-bold uppercase tracking-widest"
                  style={{
                    background: "rgba(0,212,255,0.1)",
                    border: "1px solid rgba(0,212,255,0.2)",
                    color: "#00D4FF",
                  }}
                >
                  {data.framework}
                </span>
              </div>
            </div>
          </div>

          {/* Role */}
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              background: "rgba(0,212,255,0.04)",
              border: "1px solid rgba(0,212,255,0.08)",
            }}
          >
            <CircleDot className="w-3 h-3 text-[#00E5A0] animate-pulse" />
            <p className="text-[11px] text-[#8B92B4] font-medium">{data.role}</p>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !border-2 !border-[#00D4FF] !bg-[#06070A] !-bottom-1.5 !rounded-full !shadow-[0_0_12px_rgba(0,212,255,0.6)] !transition-all !duration-200 hover:!scale-125"
        />
      </div>
    </div>
  );
}

function TaskNode({ data, selected }: { data: any; selected?: boolean }) {
  return (
    <div className={`group relative w-[200px] ${selected ? "scale-[1.02]" : ""} transition-transform duration-500`}>
      <div
        className="absolute -inset-[2px] rounded-2xl z-0 overflow-hidden"
        style={{
          opacity: selected ? 1 : 0,
          transition: "opacity 0.5s ease",
        }}
      >
        <div
          className="absolute inset-[-50%] w-[200%] h-[200%]"
          style={{
            background: "conic-gradient(from 0deg, transparent, #B829DD, #FF6B35, transparent 30%)",
            animation: "spin 3s linear infinite",
          }}
        />
      </div>
      
      <div
        className="absolute -inset-[1px] rounded-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0"
        style={{
          background: "linear-gradient(135deg, rgba(184,41,221,0.3), rgba(255,107,53,0.3))",
          filter: "blur(3px)",
        }}
      />

      <div
        className="relative w-full rounded-2xl overflow-hidden z-10"
        style={{
          background: "linear-gradient(165deg, rgba(18,14,32,0.98) 0%, rgba(8,6,16,0.99) 100%)",
          backdropFilter: "blur(40px)",
          border: selected
            ? "1px solid rgba(184,41,221,0.6)"
            : "1px solid rgba(255,255,255,0.06)",
          boxShadow: selected
            ? "0 0 60px rgba(184,41,221,0.25), 0 0 120px rgba(184,41,221,0.1), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="absolute top-0 left-4 right-4 h-[2px] rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, #B829DD, #FF6B35, transparent)",
            opacity: selected ? 1 : 0.5,
            boxShadow: selected
              ? "0 0 20px rgba(184,41,221,0.8), 0 0 40px rgba(184,41,221,0.4)"
              : "0 0 10px rgba(184,41,221,0.3)",
          }}
        />

        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#B829DD]/40 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#B829DD]/40 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#B829DD]/40 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#B829DD]/40 rounded-br-xl" />

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 30%, rgba(184,41,221,0.04) 45%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "holoSweep 3s ease-in-out infinite",
          }}
        />

        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !border-2 !border-[#B829DD] !bg-[#06070A] !-top-1.5 !rounded-full !shadow-[0_0_12px_rgba(184,41,221,0.6)] !transition-all !duration-200 hover:!scale-125"
        />

        <div className="px-4 pt-5 pb-3.5 relative z-10">
          <div className="flex items-start gap-3">
            <div
              className="w-9 h-9 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(184,41,221,0.15) 0%, rgba(255,107,53,0.08) 100%)",
                border: "1.5px solid rgba(184,41,221,0.3)",
                boxShadow: "0 0 16px rgba(184,41,221,0.15)",
              }}
            >
              <Zap className="w-4 h-4 text-[#B829DD]" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-[13px] font-bold text-white truncate leading-tight tracking-tight">
                {data.label}
              </p>
              <p className="text-[10px] text-[#5A6080] leading-relaxed mt-1 line-clamp-2">
                {data.description}
              </p>
            </div>
          </div>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          className="!w-3 !h-3 !border-2 !border-[#B829DD] !bg-[#06070A] !-bottom-1.5 !rounded-full !shadow-[0_0_12px_rgba(184,41,221,0.6)] !transition-all !duration-200 hover:!scale-125"
        />
      </div>
    </div>
  );
}

function ConditionNode({ data, selected }: { data: any; selected?: boolean }) {
  return (
    <div className={`group relative w-[170px] ${selected ? "scale-[1.02]" : ""} transition-transform duration-500`}>
      <div
        className="absolute -inset-[2px] rounded-2xl z-0 overflow-hidden"
        style={{
          opacity: selected ? 1 : 0,
          transition: "opacity 0.5 ease",
        }}
      >
        <div
          className="absolute inset-[-50%] w-[200%] h-[200%]"
          style={{
            background: "conic-gradient(from 0deg, transparent, #FFC857, #FF6B35, transparent 30%)",
            animation: "spin 3s linear infinite",
          }}
        />
      </div>
      
      <div
        className="absolute -inset-[1px] rounded-2xl transition-opacity duration-500 group-hover:opacity-100 opacity-0"
        style={{
          background: "linear-gradient(135deg, rgba(255,200,87,0.3), rgba(255,107,53,0.3))",
          filter: "blur(3px)",
        }}
      />

      <div
        className="relative w-full rounded-2xl overflow-hidden z-10"
        style={{
          background: "linear-gradient(165deg, rgba(28,22,14,0.98) 0%, rgba(14,10,6,0.99) 100%)",
          backdropFilter: "blur(40px)",
          border: selected
            ? "1px solid rgba(255,200,87,0.6)"
            : "1px solid rgba(255,255,255,0.06)",
          boxShadow: selected
            ? "0 0 60px rgba(255,200,87,0.25), 0 0 120px rgba(255,200,87,0.1), inset 0 1px 0 rgba(255,255,255,0.15)"
            : "0 16px 48px rgba(0,0,0,0.6), inset 0 1px 0 rgba(255,255,255,0.06)",
        }}
      >
        <div
          className="absolute top-0 left-4 right-4 h-[2px] rounded-full"
          style={{
            background: "linear-gradient(90deg, transparent, #FFC857, #FF6B35, transparent)",
            opacity: selected ? 1 : 0.5,
            boxShadow: selected
              ? "0 0 20px rgba(255,200,87,0.8), 0 0 40px rgba(255,200,87,0.4)"
              : "0 0 10px rgba(255,200,87,0.3)",
          }}
        />

        <div className="absolute top-0 left-0 w-3 h-3 border-l-2 border-t-2 border-[#FFC857]/40 rounded-tl-xl" />
        <div className="absolute top-0 right-0 w-3 h-3 border-r-2 border-t-2 border-[#FFC857]/40 rounded-tr-xl" />
        <div className="absolute bottom-0 left-0 w-3 h-3 border-l-2 border-b-2 border-[#FFC857]/40 rounded-bl-xl" />
        <div className="absolute bottom-0 right-0 w-3 h-3 border-r-2 border-b-2 border-[#FFC857]/40 rounded-br-xl" />

        <div
          className="absolute inset-0 opacity-0 group-hover:opacity-100 transition-opacity duration-1000 pointer-events-none"
          style={{
            background: "linear-gradient(105deg, transparent 30%, rgba(255,200,87,0.04) 45%, transparent 60%)",
            backgroundSize: "200% 100%",
            animation: "holoSweep 3s ease-in-out infinite",
          }}
        />

        <Handle
          type="target"
          position={Position.Top}
          className="!w-3 !h-3 !border-2 !border-[#FFC857] !bg-[#06070A] !-top-1.5 !rounded-full !shadow-[0_0_12px_rgba(255,200,87,0.6)] !transition-all !duration-200 hover:!scale-125"
        />

        <div className="px-4 py-4 relative z-10">
          <div className="flex items-center gap-2.5">
            <div
              className="w-8 h-8 rounded-lg flex items-center justify-center shrink-0"
              style={{
                background: "linear-gradient(135deg, rgba(255,200,87,0.15) 0%, rgba(255,107,53,0.08) 100%)",
                border: "1.5px solid rgba(255,200,87,0.3)",
                boxShadow: "0 0 16px rgba(255,200,87,0.15)",
              }}
            >
              <GitFork className="w-4 h-4 text-[#FFC857]" />
            </div>
            <p className="text-[13px] font-bold text-white tracking-tight">{data.label}</p>
          </div>
        </div>

        {/* Yes/No badges */}
        <div className="absolute -bottom-5 left-1/2 -translate-x-1/2 flex items-center gap-2">
          <span
            className="px-2 py-[2px] rounded-md text-[9px] font-bold uppercase tracking-widest"
            style={{
              background: "rgba(0,229,160,0.08)",
              border: "1.5px solid rgba(0,229,160,0.2)",
              color: "#00E5A0",
            }}
          >
            Yes
          </span>
          <span
            className="px-2 py-[2px] rounded-md text-[9px] font-bold uppercase tracking-widest"
            style={{
              background: "rgba(255,71,87,0.08)",
              border: "1.5px solid rgba(255,71,87,0.2)",
              color: "#FF4757",
            }}
          >
            No
          </span>
        </div>

        <Handle
          type="source"
          position={Position.Bottom}
          id="yes"
          className="!w-3 !h-3 !border-2 !border-[#00E5A0] !bg-[#06070A] !-bottom-1.5 !rounded-full !shadow-[0_0_12px_rgba(0,229,160,0.6)] !transition-all !duration-200 hover:!scale-125"
        />
        <Handle
          type="source"
          position={Position.Right}
          id="no"
          className="!w-3 !h-3 !border-2 !border-[#FF4757] !bg-[#06070A] !-right-1.5 !top-1/2 !-translate-y-1/2 !rounded-full !shadow-[0_0_12px_rgba(255,71,87,0.6)] !transition-all !duration-200 hover:!scale-125"
        />
      </div>
    </div>
  );
}

const nodeTypes = { agent: AgentNode, task: TaskNode, condition: ConditionNode };

const initialNodes: Node[] = [
  {
    id: "1",
    type: "agent",
    position: { x: 280, y: 40 },
    data: { label: "Rook", framework: "Custom", role: "CEO Operator" },
  },
  {
    id: "2",
    type: "task",
    position: { x: 280, y: 200 },
    data: { label: "Analyze Request", description: "Parse and understand user input" },
  },
  {
    id: "3",
    type: "condition",
    position: { x: 280, y: 360 },
    data: { label: "Complex?" },
  },
  {
    id: "4",
    type: "agent",
    position: { x: 80, y: 520 },
    data: { label: "Kimi", framework: "Kimi", role: "Code Assistant" },
  },
  {
    id: "5",
    type: "agent",
    position: { x: 480, y: 520 },
    data: { label: "Claude", framework: "Anthropic", role: "Analysis" },
  },
];

const initialEdges: Edge[] = [
  {
    id: "e1-2",
    source: "1",
    target: "2",
    type: "futuristic",
    data: { color: "#00D4FF", animated: true },
    markerEnd: { type: MarkerType.ArrowClosed, width: 5, height: 6, color: "#00D4FF" },
  },
  {
    id: "e2-3",
    source: "2",
    target: "3",
    type: "futuristic",
    data: { color: "#B829DD", animated: true },
    markerEnd: { type: MarkerType.ArrowClosed, width: 5, height: 6, color: "#B829DD" },
  },
  {
    id: "e3-4",
    source: "3",
    target: "4",
    sourceHandle: "yes",
    type: "futuristic",
    data: { color: "#00E5A0", animated: true },
    markerEnd: { type: MarkerType.ArrowClosed, width: 5, height: 6, color: "#00E5A0" },
    label: "Yes",
    labelStyle: { fill: "#00E5A0", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" },
    labelBgStyle: { fill: "rgba(6,7,10,0.95)", rx: 6, stroke: "rgba(0,229,160,0.25)", strokeWidth: 1 },
    labelBgPadding: [6, 4],
    labelBgBorderRadius: 6,
  },
  {
    id: "e3-5",
    source: "3",
    target: "5",
    sourceHandle: "no",
    type: "futuristic",
    data: { color: "#FF4757", animated: true },
    markerEnd: { type: MarkerType.ArrowClosed, width: 5, height: 6, color: "#FF4757" },
    label: "No",
    labelStyle: { fill: "#FF4757", fontSize: 10, fontWeight: 700, letterSpacing: "0.08em" },
    labelBgStyle: { fill: "rgba(6,7,10,0.95)", rx: 6, stroke: "rgba(255,71,87,0.25)", strokeWidth: 1 },
    labelBgPadding: [6, 4],
    labelBgBorderRadius: 6,
  },
];

/* ── Types ────────────────────────────────────────── */

interface RunRecord {
  id: string;
  timestamp: string;
  status: "success" | "error" | "running";
  steps: number;
  duration: number;
  nodesExecuted: string[];
}

/* ── Page ─────────────────────────────────────────── */

export default function SwarmCanvasPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);
  const [saving, setSaving] = useState(false);
  const [running, setRunning] = useState(false);
  const [runHistory, setRunHistory] = useState<RunRecord[]>([]);
  const [showHistory, setShowHistory] = useState(true);
  const [workflowName, setWorkflowName] = useState("Marketing Campaign");
  const [showNodePalette, setShowNodePalette] = useState(false);
  const addNodeBtnRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const stored = localStorage.getItem("swarm_run_history");
    if (stored) {
      try {
        setRunHistory(JSON.parse(stored));
      } catch { /* ignore */ }
    }
  }, []);

  const onConnect: OnConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            type: "futuristic",
            data: { color: "#00D4FF", animated: true },
            markerEnd: { type: MarkerType.ArrowClosed, width: 5, height: 6, color: "#00D4FF" },
          },
          eds
        )
      ),
    [setEdges]
  );

  const addNode = (type: "agent" | "task" | "condition") => {
    const id = `${nodes.length + 1}`;
    const newNode: Node = {
      id,
      type,
      position: { x: Math.random() * 300 + 100, y: Math.random() * 200 + 100 },
      data:
        type === "agent"
          ? { label: "New Agent", framework: "Custom", role: "Assistant" }
          : type === "task"
          ? { label: "New Task", description: "Task description" }
          : { label: "Condition" },
    };
    setNodes((nds) => [...nds, newNode]);
    setShowNodePalette(false);
    toast.success(`${type} node added`);
  };

  const deleteNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode && e.target !== selectedNode));
    setSelectedNode(null);
    toast.success("Node deleted");
  };

  const duplicateNode = () => {
    if (!selectedNode) return;
    const node = nodes.find((n) => n.id === selectedNode);
    if (!node) return;
    const newId = `${Math.max(...nodes.map((n) => parseInt(n.id))) + 1}`;
    const newNode: Node = {
      ...node,
      id: newId,
      position: { x: node.position.x + 60, y: node.position.y + 60 },
      data: { ...node.data, label: `${node.data.label} (copy)` },
    };
    setNodes((nds) => [...nds, newNode]);
    toast.success("Node duplicated");
  };

  const saveWorkflow = async () => {
    setSaving(true);
    try {
      const res = await fetch("/api/workflows", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: workflowName,
          description: "Created via Swarm Canvas",
          nodes: nodes.map((n) => ({ id: n.id, type: n.type, data: n.data, position: n.position })),
          edges: edges.map((e) => ({ id: e.id, source: e.source, target: e.target, label: e.label })),
          is_active: true,
        }),
      });

      if (!res.ok) {
        const workflow = { name: workflowName, nodes, edges, timestamp: new Date().toISOString() };
        localStorage.setItem("swarm_workflow", JSON.stringify(workflow));
        toast.success("Workflow saved locally (demo mode)");
        return;
      }

      await res.json();
      toast.success(`Workflow "${workflowName}" saved to database`);
    } catch {
      const workflow = { name: workflowName, nodes, edges, timestamp: new Date().toISOString() };
      localStorage.setItem("swarm_workflow", JSON.stringify(workflow));
      toast.success("Workflow saved locally (demo mode)");
    } finally {
      setSaving(false);
    }
  };

  const runWorkflow = async () => {
    setRunning(true);
    const startTime = Date.now();
    const runId = crypto.randomUUID();

    const newRun: RunRecord = {
      id: runId,
      timestamp: new Date().toISOString(),
      status: "running",
      steps: 0,
      duration: 0,
      nodesExecuted: [],
    };
    setRunHistory((prev) => [newRun, ...prev]);

    toast.info("Workflow execution started...");

    const visited = new Set<string>();
    const queue = ["1"];
    const executionOrder: string[] = [];

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);
      executionOrder.push(nodeId);

      const outgoing = edges.filter((e) => e.source === nodeId);
      for (const edge of outgoing) {
        if (!visited.has(edge.target)) {
          queue.push(edge.target);
        }
      }

      await new Promise((r) => setTimeout(r, 400 + Math.random() * 600));
    }

    const duration = Date.now() - startTime;
    const completedRun: RunRecord = {
      ...newRun,
      status: "success",
      steps: executionOrder.length,
      duration,
      nodesExecuted: executionOrder,
    };

    setRunHistory((prev) => prev.map((r) => (r.id === runId ? completedRun : r)));

    const updatedHistory = [completedRun, ...runHistory.filter((r) => r.id !== runId)];
    localStorage.setItem("swarm_run_history", JSON.stringify(updatedHistory.slice(0, 20)));

    try {
      await fetch("/api/activity-logs", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          action: "workflow.executed",
          target_name: workflowName,
          metadata: { steps: executionOrder.length, duration },
        }),
      });
    } catch { /* silent */ }

    toast.success(
      `Workflow completed: ${executionOrder.length} nodes executed in ${(duration / 1000).toFixed(1)}s`
    );
    setRunning(false);
  };

  return (
    <div className="h-full flex flex-col">
      {/* ── Futuristic Header ────────────────────────────── */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div className="flex items-center gap-4">
          <motion.div
            whileHover={{ scale: 1.05, rotate: 5 }}
            className="w-12 h-12 rounded-2xl flex items-center justify-center relative overflow-hidden"
            style={{
              background: "linear-gradient(135deg, rgba(0,212,255,0.15) 0%, rgba(184,41,221,0.15) 100%)",
              border: "1.5px solid rgba(0,212,255,0.25)",
              boxShadow: "0 0 30px rgba(0,212,255,0.15), inset 0 1px 0 rgba(255,255,255,0.1)",
            }}
          >
            <Hexagon className="w-6 h-6 text-[#00D4FF]" strokeWidth={1.5} />
            <div className="absolute inset-0 bg-gradient-to-br from-white/5 to-transparent pointer-events-none" />
          </motion.div>
          <div>
            <h1 className="text-2xl font-bold text-white tracking-tight">Swarm Canvas</h1>
            <p className="text-sm text-[#4A5068]">Visual workflow builder for multi-agent orchestration</p>
          </div>
        </div>

        {/* Futuristic Floating Toolbar */}
        <div
          className="flex items-center gap-1 p-1.5 rounded-2xl"
          style={{
            background: "linear-gradient(145deg, rgba(12,16,28,0.9) 0%, rgba(6,8,16,0.95) 100%)",
            backdropFilter: "blur(40px)",
            border: "1px solid rgba(0,212,255,0.12)",
            boxShadow: "0 8px 32px rgba(0,0,0,0.5), 0 0 30px rgba(0,212,255,0.05), inset 0 1px 0 rgba(255,255,255,0.05)",
          }}
        >
          {/* Workflow name */}
          <div className="relative">
            <input
              value={workflowName}
              onChange={(e) => setWorkflowName(e.target.value)}
              className="px-3 py-1.5 rounded-xl bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-[#4A5068] outline-none focus:border-[#00D4FF]/30 focus:ring-1 focus:ring-[#00D4FF]/10 w-44 transition-all"
              placeholder="Workflow name"
            />
            <Sparkles className="w-3 h-3 text-[#4A5068] absolute right-2.5 top-1/2 -translate-y-1/2" />
          </div>

          <div className="w-px h-6 bg-white/[0.06] mx-1" />

          {/* Node Palette Toggle — positioned in normal flow */}
          <div className="relative" ref={addNodeBtnRef}>
            <button
              onClick={() => setShowNodePalette(!showNodePalette)}
              className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium transition-all duration-200 ${
                showNodePalette
                  ? "text-white bg-white/[0.08] border border-[#00D4FF]/30 shadow-[0_0_16px_rgba(0,212,255,0.15)]"
                  : "text-white bg-white/[0.04] border border-white/[0.08] hover:bg-white/[0.08] hover:border-white/[0.15]"
              }`}
            >
              <Plus className="w-3.5 h-3.5 text-[#00D4FF]" />
              Add Node
              <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${showNodePalette ? "rotate-180" : ""}`} />
            </button>
          </div>

          {/* Portal-based Dropdown — renders outside canvas */}
          <NodePalettePortal
            isOpen={showNodePalette}
            onClose={() => setShowNodePalette(false)}
            onAddNode={addNode}
            anchorRef={addNodeBtnRef}
          />

          {selectedNode && (
            <>
              <div className="w-px h-6 bg-white/[0.06] mx-1" />
              <button
                onClick={duplicateNode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#8B92B4] bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-all duration-200"
                title="Duplicate node"
              >
                <Copy className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={deleteNode}
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#FF4757] bg-[#FF4757]/5 border border-[#FF4757]/15 hover:bg-[#FF4757]/10 hover:border-[#FF4757]/30 transition-all duration-200"
              >
                <Trash2 className="w-3.5 h-3.5" />
                Delete
              </button>
            </>
          )}

          <div className="w-px h-6 bg-white/[0.06] mx-1" />

          <button
            onClick={saveWorkflow}
            disabled={saving}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-medium text-[#8B92B4] bg-white/[0.03] border border-white/[0.06] hover:bg-white/[0.06] hover:text-white transition-all duration-200 disabled:opacity-50"
          >
            {saving ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Save className="w-3.5 h-3.5" />}
            Save
          </button>

          <button
            onClick={runWorkflow}
            disabled={running}
            className="flex items-center gap-1.5 px-4 py-1.5 rounded-xl text-xs font-bold text-[#06070A] transition-all duration-200 hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50 disabled:hover:scale-100"
            style={{
              background: "linear-gradient(135deg, #00D4FF 0%, #00E5A0 100%)",
              boxShadow: "0 0 25px rgba(0,212,255,0.35), inset 0 1px 0 rgba(255,255,255,0.2)",
            }}
          >
            {running ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Play className="w-3.5 h-3.5" />}
            Run
          </button>
        </div>
      </motion.div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Futuristic Canvas */}
        <div
          className="flex-1 overflow-hidden rounded-2xl relative"
          style={{
            background: "#06070A",
            border: "1px solid rgba(0,212,255,0.1)",
            boxShadow: "inset 0 0 80px rgba(0,0,0,0.6), 0 0 40px rgba(0,212,255,0.03)",
          }}
        >
          {/* Animated dot grid */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              backgroundImage: `radial-gradient(circle, rgba(0, 212, 255, 0.15) 1px, transparent 1px)`,
              backgroundSize: "32px 32px",
            }}
          />
          {/* Subtle vignette */}
          <div
            className="absolute inset-0 pointer-events-none z-0"
            style={{
              background: "radial-gradient(ellipse at center, transparent 50%, rgba(6,7,10,0.7) 100%)",
            }}
          />
          {/* Edge glow field */}
          <div
            className="absolute inset-0 pointer-events-none z-0 opacity-30"
            style={{
              background: "radial-gradient(ellipse 80% 50% at 50% 50%, rgba(0,212,255,0.04), transparent)",
            }}
          />

          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNode(node.id)}
            onPaneClick={() => setSelectedNode(null)}
            nodeTypes={nodeTypes}
            edgeTypes={edgeTypes}
            fitView
            attributionPosition="bottom-left"
            style={{ background: "transparent" }}
            defaultEdgeOptions={{
              type: "futuristic",
              data: { color: "#00D4FF", animated: true },
              markerEnd: { type: MarkerType.ArrowClosed, width: 5, height: 6, color: "#00D4FF" },
            }}
          >
            <Background
              color="#1A2035"
              gap={32}
              size={1}
              style={{ background: "transparent" }}
            />
            <Controls
              className="!bg-[#0C101A] !border-[#1A2035] !text-[#5A6080] !rounded-xl !shadow-lg !backdrop-blur-md"
              showInteractive={false}
            />
            <MiniMap
              className="!bg-[#0C101A] !border-[#1A2035] !rounded-xl !shadow-lg !backdrop-blur-md"
              nodeColor={(node) => {
                if (node.type === "agent") return "#00D4FF";
                if (node.type === "task") return "#B829DD";
                return "#FFC857";
              }}
              maskColor="rgba(6, 7, 10, 0.9)"
              maskStrokeColor="rgba(0, 212, 255, 0.25)"
              maskStrokeWidth={2}
            />
          </ReactFlow>
        </div>

        {/* Run History Sidebar */}
        <AnimatePresence>
          {showHistory && (
            <motion.div
              initial={{ opacity: 0, x: 20 }}
              animate={{ opacity: 1, x: 0 }}
              exit={{ opacity: 0, x: 20 }}
              className="w-72 shrink-0 rounded-2xl p-5 overflow-y-auto"
              style={{
                background: "linear-gradient(145deg, rgba(12,16,28,0.95) 0%, rgba(6,8,16,0.98) 100%)",
                backdropFilter: "blur(40px)",
                border: "1px solid rgba(0,212,255,0.08)",
                boxShadow: "0 12px 40px rgba(0,0,0,0.5), inset 0 1px 0 rgba(255,255,255,0.03)",
              }}
            >
              <div className="flex items-center justify-between mb-5">
                <h3 className="text-sm font-bold text-white flex items-center gap-2.5">
                  <div
                    className="w-8 h-8 rounded-xl flex items-center justify-center"
                    style={{
                      background: "rgba(0,212,255,0.06)",
                      border: "1px solid rgba(0,212,255,0.12)",
                    }}
                  >
                    <History className="w-3.5 h-3.5 text-[#00D4FF]" />
                  </div>
                  Run History
                </h3>
                <span
                  className="text-[10px] px-2.5 py-1 rounded-full font-bold"
                  style={{
                    background: "rgba(255,255,255,0.03)",
                    border: "1px solid rgba(255,255,255,0.06)",
                    color: "#4A5068",
                  }}
                >
                  {runHistory.length} runs
                </span>
              </div>

              <div className="space-y-2.5">
                {runHistory.length === 0 ? (
                  <div className="flex flex-col items-center justify-center py-10 px-4">
                    <div
                      className="w-14 h-14 rounded-2xl flex items-center justify-center mb-4"
                      style={{
                        background: "rgba(255,255,255,0.02)",
                        border: "1px solid rgba(255,255,255,0.05)",
                      }}
                    >
                      <Radio className="w-6 h-6 text-[#3A4058]" />
                    </div>
                    <p className="text-xs text-[#4A5068] text-center font-medium">No runs yet</p>
                    <p className="text-[10px] text-[#3A4058] text-center mt-1">Click Run to execute workflow</p>
                  </div>
                ) : (
                  runHistory.map((run) => (
                    <div
                      key={run.id}
                      className="p-3 rounded-xl transition-all duration-200 hover:border-[#00D4FF]/10"
                      style={{
                        background: "rgba(255,255,255,0.015)",
                        border: "1px solid rgba(255,255,255,0.03)",
                      }}
                    >
                      <div className="flex items-center gap-2.5 mb-2.5">
                        {run.status === "success" ? (
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: "rgba(0,229,160,0.06)",
                              border: "1px solid rgba(0,229,160,0.12)",
                            }}
                          >
                            <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5A0]" />
                          </div>
                        ) : run.status === "running" ? (
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: "rgba(0,212,255,0.06)",
                              border: "1px solid rgba(0,212,255,0.12)",
                            }}
                          >
                            <Loader2 className="w-3.5 h-3.5 text-[#00D4FF] animate-spin" />
                          </div>
                        ) : (
                          <div
                            className="w-7 h-7 rounded-lg flex items-center justify-center shrink-0"
                            style={{
                              background: "rgba(255,71,87,0.06)",
                              border: "1px solid rgba(255,71,87,0.12)",
                            }}
                          >
                            <X className="w-3.5 h-3.5 text-[#FF4757]" />
                          </div>
                        )}
                        <div className="flex-1 min-w-0">
                          <p className="text-[11px] text-white font-bold">
                            {run.status === "success" ? "Completed" : run.status === "running" ? "Running..." : "Failed"}
                          </p>
                          <p className="text-[10px] text-[#3A4058]">
                            {new Date(run.timestamp).toLocaleTimeString([], { hour: "2-digit", minute: "2-digit", second: "2-digit" })}
                          </p>
                        </div>
                      </div>
                      <div className="flex items-center gap-4 text-[11px] text-[#5A6080]">
                        <span className="flex items-center gap-1">
                          <MousePointer2 className="w-3 h-3" />
                          {run.steps} steps
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3" />
                          {(run.duration / 1000).toFixed(1)}s
                        </span>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Futuristic Status Bar */}
      <div className="flex items-center justify-between mt-3 px-1">
        <div className="flex items-center gap-5">
          <div className="flex items-center gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: "#00D4FF",
                boxShadow: "0 0 10px rgba(0,212,255,0.5), 0 0 20px rgba(0,212,255,0.2)",
              }}
            />
            <span className="text-[#5A6080]">{nodes.length} nodes</span>
          </div>
          <div className="flex items-center gap-2 text-xs">
            <div
              className="w-2.5 h-2.5 rounded-full"
              style={{
                background: "#B829DD",
                boxShadow: "0 0 10px rgba(184,41,221,0.5), 0 0 20px rgba(184,41,221,0.2)",
              }}
            />
            <span className="text-[#5A6080]">{edges.length} connections</span>
          </div>
          {selectedNode && (
            <div className="flex items-center gap-2 text-xs">
              <div
                className="w-2.5 h-2.5 rounded-full animate-pulse"
                style={{
                  background: "#FFC857",
                  boxShadow: "0 0 10px rgba(255,200,87,0.5), 0 0 20px rgba(255,200,87,0.2)",
                }}
              />
              <span className="text-[#00D4FF] font-bold">Selected: Node {selectedNode}</span>
            </div>
          )}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-[11px] text-[#5A6080] hover:text-white transition-colors flex items-center gap-1.5 px-3 py-1.5 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <History className="w-3 h-3" />
            {showHistory ? "Hide" : "Show"} History
          </button>
          <div
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg"
            style={{
              background: "rgba(255,255,255,0.02)",
              border: "1px solid rgba(255,255,255,0.04)",
            }}
          >
            <div
              className={`w-2 h-2 rounded-full ${running ? "animate-pulse" : ""}`}
              style={{
                background: running ? "#00D4FF" : "#00E5A0",
                boxShadow: running
                  ? "0 0 12px rgba(0,212,255,0.6)"
                  : "0 0 12px rgba(0,229,160,0.4)",
              }}
            />
            <span className="text-[11px] text-[#5A6080] font-bold">{running ? "Running..." : "Ready"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ════════════════════════════════════════════
   NODE PALETTE PORTAL — Renders outside canvas
   ════════════════════════════════════════════ */

function NodePalettePortal({
  isOpen,
  onClose,
  onAddNode,
  anchorRef,
}: {
  isOpen: boolean;
  onClose: () => void;
  onAddNode: (type: "agent" | "task" | "condition") => void;
  anchorRef: React.RefObject<HTMLDivElement | null>;
}) {
  const [position, setPosition] = useState({ top: 0, left: 0 });

  useEffect(() => {
    if (isOpen && anchorRef.current) {
      const rect = anchorRef.current.getBoundingClientRect();
      setPosition({
        top: rect.bottom + 12,
        left: rect.left + rect.width / 2 - 112, // Center the 224px wide dropdown
      });
    }
  }, [isOpen, anchorRef]);

  useEffect(() => {
    if (!isOpen) return;
    const handleClickOutside = (e: MouseEvent) => {
      if (anchorRef.current && !anchorRef.current.contains(e.target as globalThis.Node)) {
        onClose();
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, [isOpen, onClose, anchorRef]);

  if (!isOpen) return null;

  return createPortal(
    <AnimatePresence>
      <motion.div
        initial={{ opacity: 0, y: -8, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        exit={{ opacity: 0, y: -8, scale: 0.95 }}
        transition={{ duration: 0.15, ease: [0.4, 0, 0.2, 1] }}
        className="fixed z-[9999] w-56 rounded-xl overflow-hidden"
        style={{
          top: position.top,
          left: position.left,
          background: "linear-gradient(145deg, rgba(12,16,28,0.98) 0%, rgba(6,8,16,0.99) 100%)",
          backdropFilter: "blur(40px)",
          border: "1.5px solid rgba(0,212,255,0.15)",
          boxShadow: "0 24px 64px rgba(0,0,0,0.8), 0 0 40px rgba(0,212,255,0.1)",
        }}
      >
        <div className="p-2 space-y-0.5">
          <button
            onClick={() => onAddNode("agent")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-white hover:bg-[#00D4FF]/10 transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:shadow-[0_0_16px_rgba(0,212,255,0.3)]"
              style={{ background: "rgba(0,212,255,0.08)", border: "1.5px solid rgba(0,212,255,0.2)" }}
            >
              <Bot className="w-4 h-4 text-[#00D4FF]" />
            </div>
            <div className="text-left">
              <p className="font-bold text-[12px]">Agent Node</p>
              <p className="text-[10px] text-[#5A6080]">AI agent with role & framework</p>
            </div>
          </button>
          <button
            onClick={() => onAddNode("task")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-white hover:bg-[#B829DD]/10 transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:shadow-[0_0_16px_rgba(184,41,221,0.3)]"
              style={{ background: "rgba(184,41,221,0.08)", border: "1.5px solid rgba(184,41,221,0.2)" }}
            >
              <Zap className="w-4 h-4 text-[#B829DD]" />
            </div>
            <div className="text-left">
              <p className="font-bold text-[12px]">Task Node</p>
              <p className="text-[10px] text-[#5A6080]">Action or transformation step</p>
            </div>
          </button>
          <button
            onClick={() => onAddNode("condition")}
            className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-xs text-white hover:bg-[#FFC857]/10 transition-all duration-200 group"
          >
            <div className="w-9 h-9 rounded-xl flex items-center justify-center shrink-0 transition-all group-hover:shadow-[0_0_16px_rgba(255,200,87,0.3)]"
              style={{ background: "rgba(255,200,87,0.08)", border: "1.5px solid rgba(255,200,87,0.2)" }}
            >
              <GitFork className="w-4 h-4 text-[#FFC857]" />
            </div>
            <div className="text-left">
              <p className="font-bold text-[12px]">Condition Node</p>
              <p className="text-[10px] text-[#5A6080]">Branching logic control</p>
            </div>
          </button>
        </div>
      </motion.div>
    </AnimatePresence>,
    document.body
  );
}
