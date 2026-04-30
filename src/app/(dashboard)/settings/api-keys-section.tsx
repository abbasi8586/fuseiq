"use client";

import { useState, useEffect, useCallback } from "react";
import { Key, Plus, Trash2, Eye, EyeOff, Copy, Check, AlertTriangle, Loader2 } from "lucide-react";
import { GlassCard } from "@/components/glass/glass-card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Badge } from "@/components/ui/badge";
import { toast } from "sonner";
import { createClient } from "@/lib/supabase/client";

interface ApiKey {
  id: string;
  name: string;
  key_prefix: string;
  scopes: string[];
  is_active: boolean;
  last_used_at: string | null;
  expires_at: string | null;
  created_at: string;
}

export function APIKeysSection() {
  const [keys, setKeys] = useState<ApiKey[]>([]);
  const [loading, setLoading] = useState(true);
  const [generating, setGenerating] = useState(false);
  const [newKeyName, setNewKeyName] = useState("External Agent Key");
  const [showGenerateForm, setShowGenerateForm] = useState(false);
  const [newKeyValue, setNewKeyValue] = useState<string | null>(null);
  const [copied, setCopied] = useState(false);
  const [revealedKeys, setRevealedKeys] = useState<Record<string, boolean>>({});
  const supabase = createClient();

  const fetchKeys = useCallback(async () => {
    try {
      const { data, error } = await supabase
        .from("api_keys")
        .select("id, name, key_prefix, scopes, is_active, last_used_at, expires_at, created_at")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setKeys(data || []);
    } catch (err: any) {
      toast.error("Failed to load API keys: " + err.message);
    } finally {
      setLoading(false);
    }
  }, [supabase]);

  useEffect(() => {
    fetchKeys();
  }, [fetchKeys]);

  const generateKey = async () => {
    setGenerating(true);
    try {
      const response = await fetch("/api/settings/api-keys", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          workspace_id: "00000000-0000-0000-0000-000000000001",
          name: newKeyName,
          scopes: ["heartbeat", "execute"],
          expires_days: 365,
        }),
      });

      const result = await response.json();
      if (!response.ok) throw new Error(result.error || "Failed to generate key");

      setNewKeyValue(result.key);
      toast.success("API key generated! Copy it now — it won't be shown again.");
      fetchKeys();
    } catch (err: any) {
      toast.error(err.message);
    } finally {
      setGenerating(false);
    }
  };

  const revokeKey = async (id: string) => {
    try {
      const { error } = await supabase.from("api_keys").delete().eq("id", id);
      if (error) throw error;
      toast.success("API key revoked");
      setKeys((prev) => prev.filter((k) => k.id !== id));
    } catch (err: any) {
      toast.error("Failed to revoke key: " + err.message);
    }
  };

  const copyToClipboard = (text: string) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
    toast.success("Copied to clipboard");
  };

  const toggleReveal = (id: string) => {
    setRevealedKeys((prev) => ({ ...prev, [id]: !prev[id] }));
  };

  if (loading) {
    return (
      <GlassCard className="flex items-center justify-center py-12">
        <Loader2 className="w-6 h-6 text-[#00D4FF] animate-spin" />
      </GlassCard>
    );
  }

  return (
    <div className="space-y-4">
      <GlassCard>
        <div className="flex items-center justify-between mb-4">
          <div>
            <h3 className="text-lg font-semibold text-white flex items-center gap-2">
              <Key className="w-5 h-5 text-[#00D4FF]" />
              External Agent API Keys
            </h3>
            <p className="text-xs text-[#6B7290] mt-0.5">
              Generate keys to connect external agents (CrewAI, LangChain, custom) to FuseIQ
            </p>
          </div>
          <Button
            size="sm"
            onClick={() => {
              setShowGenerateForm(!showGenerateForm);
              setNewKeyValue(null);
            }}
            className="bg-[#00D4FF]/10 text-[#00D4FF] hover:bg-[#00D4FF]/20 border border-[#00D4FF]/30"
          >
            <Plus className="w-3 h-3 mr-1" />
            Generate Key
          </Button>
        </div>

        {/* Generate Form */}
        {showGenerateForm && (
          <div className="p-4 rounded-lg bg-white/[0.02] border border-white/[0.04] mb-4 space-y-3">
            <div>
              <label className="text-xs text-[#6B7290] mb-1.5 block">Key Name</label>
              <Input
                value={newKeyName}
                onChange={(e) => setNewKeyName(e.target.value)}
                placeholder="e.g., Production CrewAI Key"
                className="bg-white/[0.03] border-white/[0.06] text-white placeholder:text-[#4A5068]"
              />
            </div>

            {newKeyValue ? (
              <div className="p-3 rounded-lg bg-[#00E5A0]/10 border border-[#00E5A0]/20">
                <div className="flex items-center justify-between mb-2">
                  <span className="text-xs text-[#00E5A0] font-medium">✅ Key Generated — Copy Now</span>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() => copyToClipboard(newKeyValue)}
                    className="h-7 border-white/[0.08] text-[#6B7290] hover:text-white text-xs"
                  >
                    {copied ? <Check className="w-3 h-3 mr-1" /> : <Copy className="w-3 h-3 mr-1" />}
                    {copied ? "Copied" : "Copy"}
                  </Button>
                </div>
                <code className="block p-2 rounded bg-[#06070A] text-xs text-[#00D4FF] break-all font-mono">
                  {newKeyValue}
                </code>
                <p className="text-xs text-[#FFC857] mt-2 flex items-center gap-1">
                  <AlertTriangle className="w-3 h-3" />
                  This key will never be shown again. Save it securely.
                </p>
              </div>
            ) : (
              <div className="flex justify-end gap-2">
                <Button
                  size="sm"
                  variant="outline"
                  onClick={() => setShowGenerateForm(false)}
                  className="h-8 border-white/[0.08] text-[#6B7290] hover:text-white text-xs"
                >
                  Cancel
                </Button>
                <Button
                  size="sm"
                  onClick={generateKey}
                  disabled={generating}
                  className="h-8 bg-[#00D4FF] hover:bg-[#00D4FF]/90 text-[#06070A] text-xs"
                >
                  {generating ? (
                    <Loader2 className="w-3 h-3 animate-spin mr-1" />
                  ) : (
                    <Key className="w-3 h-3 mr-1" />
                  )}
                  Generate
                </Button>
              </div>
            )}
          </div>
        )}

        {/* Keys List */}
        {keys.length === 0 ? (
          <div className="text-center py-8 text-[#6B7290]">
            <Key className="w-8 h-8 mx-auto mb-3 opacity-30" />
            <p className="text-sm">No API keys yet</p>
            <p className="text-xs mt-1">Generate a key to connect external agents</p>
          </div>
        ) : (
          <div className="space-y-2">
            {keys.map((key) => (
              <div
                key={key.id}
                className="flex items-center gap-4 p-3 rounded-lg bg-white/[0.02] border border-white/[0.04]"
              >
                <div className="w-10 h-10 rounded-full bg-gradient-to-br from-[#00D4FF] to-[#B829DD] flex items-center justify-center text-white font-bold text-sm shrink-0">
                  <Key className="w-4 h-4" />
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <span className="text-sm font-medium text-white">{key.name}</span>
                    <Badge
                      variant="outline"
                      className="text-[10px] h-5"
                      style={{
                        borderColor: key.is_active ? "#00E5A040" : "#FF475740",
                        color: key.is_active ? "#00E5A0" : "#FF4757",
                        backgroundColor: key.is_active ? "#00E5A010" : "#FF475710",
                      }}
                    >
                      {key.is_active ? "Active" : "Revoked"}
                    </Badge>
                  </div>
                  <div className="flex items-center gap-2 mt-0.5 text-xs text-[#6B7290]">
                    <code className="text-[#00D4FF] font-mono">{key.key_prefix}••••••</code>
                    <span>·</span>
                    <span>{key.scopes?.join(", ") || "heartbeat"}</span>
                    {key.last_used_at && (
                      <>
                        <span>·</span>
                        <span>Last used {new Date(key.last_used_at).toLocaleDateString()}</span>
                      </>
                    )}
                  </div>
                </div>
                <button
                  onClick={() => revokeKey(key.id)}
                  className="p-1.5 rounded-lg hover:bg-white/5 text-[#6B7290] hover:text-[#FF4757] transition-colors"
                  title="Revoke key"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            ))}
          </div>
        )}
      </GlassCard>

      <GlassCard>
        <h3 className="text-lg font-semibold text-white flex items-center gap-2 mb-3">
          <Key className="w-5 h-5 text-[#00E5A0]" />
          Quick Integration
        </h3>
        <div className="space-y-3">
          <div className="p-3 rounded-lg bg-[#06070A] border border-white/[0.04]">
            <p className="text-xs text-[#6B7290] mb-1.5">Python (CrewAI)</p>
            <code className="text-xs text-[#B8BED8] font-mono block whitespace-pre">
              {`from fuseiq import FuseIQClient

client = FuseIQClient("fk_live_your_key_here")
client.heartbeat(agent_name="MyAgent", status="online")`}
            </code>
          </div>
          <div className="p-3 rounded-lg bg-[#06070A] border border-white/[0.04]">
            <p className="text-xs text-[#6B7290] mb-1.5">cURL</p>
            <code className="text-xs text-[#B8BED8] font-mono block whitespace-pre">
              {`curl -X POST https://fuseiq.vercel.app/api/external/heartbeat \\
  -H "Authorization: Bearer fk_live_..." \\
  -d '{"agent_name":"MyAgent","status":"online"}'`}
            </code>
          </div>
        </div>
      </GlassCard>
    </div>
  );
}
