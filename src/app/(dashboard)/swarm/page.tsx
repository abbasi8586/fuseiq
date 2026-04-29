"use client";

import { useCallback, useState } from "react";
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
import { motion } from "framer-motion";
import { Button } from "@/components/ui/button";
import {
  Bot,
  Zap,
  GitBranch,
  Play,
  Save,
  Trash2,
  Plus,
} from "lucide-react";
import { toast } from "sonner";

// Custom Node Components
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
    <div className="glass-card p-3 min-w-[120px] border-l-2 border-[#FFC857] rotate-0">
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

const nodeTypes = {
  agent: AgentNode,
  task: TaskNode,
  condition: ConditionNode,
};

const initialNodes: Node[] = [
  {
    id: "1",
    type: "agent",
    position: { x: 250, y: 50 },
    data: { label: "Rook", framework: "Custom", role: "CEO Operator" },
  },
  {
    id: "2",
    type: "task",
    position: { x: 250, y: 200 },
    data: { label: "Analyze Request", description: "Parse and understand user input" },
  },
  {
    id: "3",
    type: "condition",
    position: { x: 250, y: 350 },
    data: { label: "Complex?" },
  },
  {
    id: "4",
    type: "agent",
    position: { x: 100, y: 500 },
    data: { label: "Kimi", framework: "Kimi", role: "Code Assistant" },
  },
  {
    id: "5",
    type: "agent",
    position: { x: 400, y: 500 },
    data: { label: "Claude", framework: "Anthropic", role: "Analysis" },
  },
];

const initialEdges: Edge[] = [
  { id: "e1-2", source: "1", target: "2", animated: true, style: { stroke: "#00D4FF" } },
  { id: "e2-3", source: "2", target: "3", animated: true, style: { stroke: "#B829DD" } },
  { id: "e3-4", source: "3", target: "4", label: "Yes", style: { stroke: "#00E5A0" } },
  { id: "e3-5", source: "3", target: "5", label: "No", style: { stroke: "#FF4757" } },
];

export default function SwarmCanvasPage() {
  const [nodes, setNodes, onNodesChange] = useNodesState(initialNodes);
  const [edges, setEdges, onEdgesChange] = useEdgesState(initialEdges);
  const [selectedNode, setSelectedNode] = useState<string | null>(null);

  const onConnect: OnConnect = useCallback(
    (connection: Connection) =>
      setEdges((eds) =>
        addEdge(
          {
            ...connection,
            animated: true,
            style: { stroke: "#00D4FF", strokeWidth: 2 },
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

  const saveWorkflow = () => {
    const workflow = { nodes, edges, timestamp: new Date().toISOString() };
    localStorage.setItem("swarm_workflow", JSON.stringify(workflow));
    toast.success("Workflow saved to local storage");
  };

  const runWorkflow = () => {
    toast.success("Workflow execution started!", {
      description: `${nodes.length} nodes, ${edges.length} connections`,
    });
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
            variant="outline"
            className="glass-button"
          >
            <Save className="w-4 h-4 mr-1" />
            Save
          </Button>
          <Button onClick={runWorkflow} className="neon-button-cyan">
            <Play className="w-4 h-4 mr-1" />
            Run
          </Button>
        </div>
      </motion.div>

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

      {/* Status Bar */}
      <div className="flex items-center justify-between mt-3 px-2 text-xs text-[#6B7290]">
        <div className="flex items-center gap-4">
          <span>{nodes.length} nodes</span>
          <span>{edges.length} connections</span>
          {selectedNode && <span className="text-[#00D4FF]">Selected: {selectedNode}</span>}
        </div>
        <div className="flex items-center gap-1">
          <div className="w-2 h-2 rounded-full bg-[#00E5A0]" />
          <span>Ready to execute</span>
        </div>
      </div>
    </div>
  );
}
