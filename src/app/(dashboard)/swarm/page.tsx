"use client";

import { useCallback, useState, useEffect } from "react";
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
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";
import { motion, AnimatePresence } from "framer-motion";
import { Button } from "@/components/ui/button";
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
} from "lucide-react";
import { toast } from "sonner";

/* ── Custom Node Components ─────────────────────────── */

function AgentNode({ data }: { data: any }) {
  return (
    <div className="glass-card p-3 min-w-[160px] border-l-2 border-[#00D4FF]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-[#00D4FF]" />
      <div className="flex items-center gap-2 mb-2">
        <div className="w-7 h-7 rounded-lg bg-[#00D4FF]/20 flex items-center justify-center">
          <Bot className="w-3.5 h-3.5 text-[#00D4FF]" />
        </div>
        <div>
          <p className="text-sm font-medium text-white">{data.label}</p>
          <p className="text-[10px] text-[#6B7290]">{data.framework}</p>
        </div>
      </div>
      <p className="text-xs text-[#B8BED8]">{data.role}</p>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-[#00D4FF]" />
    </div>
  );
}

function TaskNode({ data }: { data: any }) {
  return (
    <div className="glass-card p-3 min-w-[140px] border-l-2 border-[#B829DD]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-[#B829DD]" />
      <div className="flex items-center gap-2 mb-1">
        <div className="w-6 h-6 rounded bg-[#B829DD]/20 flex items-center justify-center">
          <Zap className="w-3 h-3 text-[#B829DD]" />
        </div>
        <p className="text-sm font-medium text-white">{data.label}</p>
      </div>
      <p className="text-xs text-[#6B7290]">{data.description}</p>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-[#B829DD]" />
    </div>
  );
}

function ConditionNode({ data }: { data: any }) {
  return (
    <div className="glass-card p-3 min-w-[120px] border-l-2 border-[#FFC857]">
      <Handle type="target" position={Position.Top} className="w-2 h-2 bg-[#FFC857]" />
      <div className="flex items-center gap-2">
        <GitBranch className="w-4 h-4 text-[#FFC857]" />
        <p className="text-sm font-medium text-white">{data.label}</p>
      </div>
      <Handle type="source" position={Position.Bottom} className="w-2 h-2 bg-[#FFC857]" />
      <Handle type="source" position={Position.Right} className="w-2 h-2 bg-[#FF4757]" />
    </div>
  );
}

const nodeTypes = { agent: AgentNode, task: TaskNode, condition: ConditionNode };

const initialNodes: Node[] = [
  { id: "1", type: "agent", position: { x: 250, y: 50 }, data: { label: "Rook", framework: "Custom", role: "CEO Operator" } },
  { id: "2", type: "task", position: { x: 250, y: 200 }, data: { label: "Analyze Request", description: "Parse and understand user input" } },
  { id: "3", type: "condition", position: { x: 250, y: 350 }, data: { label: "Complex?" } },
  { id: "4", type: "agent", position: { x: 100, y: 500 }, data: { label: "Kimi", framework: "Kimi", role: "Code Assistant" } },
  { id: "5", type: "agent", position: { x: 400, y: 500 }, data: { label: "Claude", framework: "Anthropic", role: "Analysis" } },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#00D4FF" } },
  { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: "#B829DD" } },
  { id: "e3-4", source: "3", target: "4", label: "Yes", style: { stroke: "#00E5A0" } },
  { id: "e3-5", source: "3", target: "5", label: "No", style: { stroke: "#FF4757" } },
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

  // Load run history on mount
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
        addEdge({ ...connection, animated: true, style: { stroke: "#00D4FF", strokeWidth: 2 } }, eds)
      ),
    [setEdges]
  );

  const addNode = (type: "agent" | "task" | "condition") => {
    const id = `${nodes.length + 1}`;
    const newNode: Node = {
      id,
      type,
      position: { x: Math.random() * 400 + 50, y: Math.random() * 300 + 50 },
      data:
        type === "agent"
          ? { label: "New Agent", framework: "Custom", role: "Assistant" }
          : type === "task"
          ? { label: "New Task", description: "Task description" }
          : { label: "Condition" },
    };
    setNodes((nds) => [...nds, newNode]);
    toast.success(`${type} node added`);
  };

  const deleteNode = () => {
    if (!selectedNode) return;
    setNodes((nds) => nds.filter((n) => n.id !== selectedNode));
    setEdges((eds) => eds.filter((e) => e.source !== selectedNode && e.target !== selectedNode));
    setSelectedNode(null);
    toast.success("Node deleted");
  };

  /* ── Save Workflow ──────────────────────────────── */
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
        // Fallback to localStorage
        const workflow = { name: workflowName, nodes, edges, timestamp: new Date().toISOString() };
        localStorage.setItem("swarm_workflow", JSON.stringify(workflow));
        toast.success("Workflow saved locally (demo mode)");
        return;
      }

      const data = await res.json();
      toast.success(`Workflow "${workflowName}" saved to database`);
    } catch {
      // Fallback
      const workflow = { name: workflowName, nodes, edges, timestamp: new Date().toISOString() };
      localStorage.setItem("swarm_workflow", JSON.stringify(workflow));
      toast.success("Workflow saved locally (demo mode)");
    } finally {
      setSaving(false);
    }
  };

  /* ── Run Workflow ───────────────────────────────── */
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

    // Simulate DAG traversal
    const visited = new Set<string>();
    const queue = ["1"]; // Start from node 1
    const executionOrder: string[] = [];

    while (queue.length > 0) {
      const nodeId = queue.shift()!;
      if (visited.has(nodeId)) continue;
      visited.add(nodeId);
      executionOrder.push(nodeId);

      // Find outgoing edges
      const outgoing = edges.filter((e) => e.source === nodeId);
      for (const edge of outgoing) {
        if (!visited.has(edge.target)) {
          queue.push(edge.target);
        }
      }

      // Simulate step delay
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

    // Persist history
    const updatedHistory = [completedRun, ...runHistory.filter((r) => r.id !== runId)];
    localStorage.setItem("swarm_run_history", JSON.stringify(updatedHistory.slice(0, 20)));

    // Log to activity
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
      {/* Header */}
      <motion.div
        initial={{ opacity: 0, y: -20 }}
        animate={{ opacity: 1, y: 0 }}
        className="flex items-center justify-between mb-4"
      >
        <div>
          <h1 className="text-2xl font-bold text-white flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center shadow-lg shadow-[#00D4FF]/20">
              <GitBranch className="w-5 h-5 text-white" />
            </div>
            <span className="text-gradient">Swarm Canvas</span>
          </h1>
          <p className="text-sm text-[#6B7290] mt-1">
            Visual workflow builder for multi-agent orchestration
          </p>
        </div>
        <div className="flex items-center gap-2">
          <input
            value={workflowName}
            onChange={(e) => setWorkflowName(e.target.value)}
            className="px-3 py-1.5 rounded-lg bg-white/[0.03] border border-white/[0.06] text-sm text-white placeholder:text-[#4A5068] outline-none focus:ring-1 focus:ring-[#00D4FF]/30 w-40"
            placeholder="Workflow name"
          />
          <Button
            onClick={() => addNode("agent")}
            variant="outline"
            className="glass-button text-[#00D4FF] border-[#00D4FF]/20"
          >
            <Bot className="w-4 h-4 mr-1" />
            Agent
          </Button>
          <Button
            onClick={() => addNode("task")}
            variant="outline"
            className="glass-button text-[#B829DD] border-[#B829DD]/20"
          >
            <Zap className="w-4 h-4 mr-1" />
            Task
          </Button>
          <Button
            onClick={() => addNode("condition")}
            variant="outline"
            className="glass-button text-[#FFC857] border-[#FFC857]/20"
          >
            <GitBranch className="w-4 h-4 mr-1" />
            Condition
          </Button>
          {selectedNode && (
            <Button
              onClick={deleteNode}
              variant="outline"
              className="glass-button text-[#FF4757] border-[#FF4757]/20"
            >
              <Trash2 className="w-4 h-4 mr-1" />
              Delete
            </Button>
          )}
          <Button
            onClick={saveWorkflow}
            disabled={saving}
            variant="outline"
            className="glass-button"
          >
            {saving ? <Loader2 className="w-4 h-4 animate-spin" /> : <Save className="w-4 h-4 mr-1" />}
            Save
          </Button>
          <Button onClick={runWorkflow} disabled={running} className="neon-button-cyan">
            {running ? <Loader2 className="w-4 h-4 animate-spin mr-1" /> : <Play className="w-4 h-4 mr-1" />}
            Run
          </Button>
        </div>
      </motion.div>

      <div className="flex-1 flex gap-4 min-h-0">
        {/* Canvas */}
        <div className="flex-1 glass-card overflow-hidden rounded-2xl">
          <ReactFlow
            nodes={nodes}
            edges={edges}
            onNodesChange={onNodesChange}
            onEdgesChange={onEdgesChange}
            onConnect={onConnect}
            onNodeClick={(_, node) => setSelectedNode(node.id)}
            onPaneClick={() => setSelectedNode(null)}
            nodeTypes={nodeTypes}
            fitView
            attributionPosition="bottom-left"
            style={{ background: "#0A0B10" }}
          >
            <Background color="#1E2233" gap={20} size={1} />
            <Controls className="!bg-[#161925] !border-[#1E2233] !text-white" />
            <MiniMap
              className="!bg-[#161925] !border-[#1E2233]"
              nodeColor={(node) => {
                if (node.type === "agent") return "#00D4FF";
                if (node.type === "task") return "#B829DD";
                return "#FFC857";
              }}
              maskColor="rgba(6, 7, 10, 0.8)"
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
              className="w-64 shrink-0 glass-card rounded-2xl p-4 overflow-y-auto"
            >
              <div className="flex items-center justify-between mb-3">
                <h3 className="text-sm font-semibold text-white flex items-center gap-2">
                  <History className="w-4 h-4 text-[#00D4FF]" />
                  Run History
                </h3>
                <span className="text-[10px] text-[#4A5068]">{runHistory.length} runs</span>
              </div>

              <div className="space-y-2">
                {runHistory.length === 0 ? (
                  <p className="text-xs text-[#4A5068] text-center py-4">No runs yet. Click Run to execute.</p>
                ) : (
                  runHistory.map((run) => (
                    <div
                      key={run.id}
                      className="p-2.5 rounded-lg bg-white/[0.02] border border-white/[0.04]"
                    >
                      <div className="flex items-center gap-2 mb-1">
                        {run.status === "success" ? (
                          <CheckCircle2 className="w-3.5 h-3.5 text-[#00E5A0]" />
                        ) : run.status === "running" ? (
                          <Loader2 className="w-3.5 h-3.5 text-[#00D4FF] animate-spin" />
                        ) : (
                          <Trash2 className="w-3.5 h-3.5 text-[#FF4757]" />
                        )}
                        <span className="text-[10px] text-[#6B7290]">
                          {new Date(run.timestamp).toLocaleTimeString()}
                        </span>
                      </div>
                      <p className="text-xs text-white">
                        {run.steps} steps · {(run.duration / 1000).toFixed(1)}s
                      </p>
                      <div className="flex flex-wrap gap-1 mt-1">
                        {run.nodesExecuted.slice(0, 3).map((n) => (
                          <span key={n} className="text-[9px] px-1 py-0.5 rounded bg-white/[0.04] text-[#4A5068]">
                            Node {n}
                          </span>
                        ))}
                        {run.nodesExecuted.length > 3 && (
                          <span className="text-[9px] text-[#4A5068]">+{run.nodesExecuted.length - 3} more</span>
                        )}
                      </div>
                    </div>
                  ))
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>

      {/* Status Bar */}
      <div className="flex items-center justify-between mt-3 px-2 text-xs text-[#6B7290]">
        <div className="flex items-center gap-4">
          <span>{nodes.length} nodes</span>
          <span>{edges.length} connections</span>
          {selectedNode && <span className="text-[#00D4FF]">Selected: {selectedNode}</span>}
        </div>
        <div className="flex items-center gap-3">
          <button
            onClick={() => setShowHistory(!showHistory)}
            className="text-[#6B7290] hover:text-white transition-colors flex items-center gap-1"
          >
            <History className="w-3 h-3" />
            {showHistory ? "Hide" : "Show"} History
          </button>
          <div className="flex items-center gap-1">
            <div className={`w-2 h-2 rounded-full ${running ? "bg-[#00D4FF] animate-pulse" : "bg-[#00E5A0]"}`} />
            <span>{running ? "Running..." : "Ready"}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
