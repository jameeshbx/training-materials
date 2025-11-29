"use client";

import { useState, useEffect } from "react";
import socket from "@/lib/socket";
import toast from "react-hot-toast";
import { 
  Send, 
  Copy, 
  CheckCircle, 
  Clock, 
  Mail, 
  Users,
  RefreshCw,
  Link2
} from "lucide-react";

interface Invite {
  id: string;
  email: string;
  token: string;
  status: string;
  createdAt: string;
}

export default function InviteForm() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);
  const [refreshing, setRefreshing] = useState(false);
  const [invites, setInvites] = useState<Invite[]>([]);
  const [copiedEmail, setCopiedEmail] = useState<string | null>(null);

  // Fetch existing invites
  const fetchInvites = async () => {
    setRefreshing(true);
    try {
      const res = await fetch("/api/invite/list");
      const data = await res.json();
      if (res.ok) {
        setInvites(data.invites || []);
      }
    } catch (error) {
      console.error("Error fetching invites:", error);
      toast.error("Failed to load invites");
    } finally {
      setRefreshing(false);
    }
  };

  useEffect(() => {
    fetchInvites();
  }, []);

  const sendInvite = async () => {
    if (!email) {
      toast.error("Please enter an email address");
      return;
    }

    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
      toast.error("Please enter a valid email address");
      return;
    }

    setLoading(true);

    try {
      const res = await fetch("/api/invite/send", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ email }),
      });

      const data = await res.json();
      
      if (res.ok) {
        toast.success(`Invitation sent to ${email}!`);
        setEmail("");
        fetchInvites(); // Refresh the list
      } else {
        toast.error(data.message || "Failed to send invitation");
      }
    } catch (error) {
      toast.error("Failed to send invitation");
    } finally {
      setLoading(false);
    }
  };

  const copyInviteLink = async (token: string, email: string) => {
    const inviteURL = `${window.location.origin}/dashboard/${token}`;
    try {
      await navigator.clipboard.writeText(inviteURL);
      setCopiedEmail(email);
      toast.success("Invite link copied to clipboard!");
      
      // Reset copied state after 2 seconds
      setTimeout(() => setCopiedEmail(null), 2000);
    } catch (error) {
      toast.error("Failed to copy link");
    }
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "bg-green-100 text-green-800 border-green-200";
      case "EXPIRED":
        return "bg-red-100 text-red-800 border-red-200";
      default:
        return "bg-yellow-100 text-yellow-800 border-yellow-200";
    }
  };

  const getStatusIcon = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return <CheckCircle className="w-4 h-4" />;
      case "EXPIRED":
        return <Clock className="w-4 h-4" />;
      default:
        return <Clock className="w-4 h-4" />;
    }
  };

  const getStatusText = (status: string) => {
    switch (status) {
      case "ACCEPTED":
        return "Accepted";
      case "EXPIRED":
        return "Expired";
      default:
        return "Pending";
    }
  };

  // Socket connection for real-time updates
  useEffect(() => {
    if (!socket.connected) socket.connect();

    const onInviteAccepted = (data: any) => {
      toast.success(`🎉 ${data.name} accepted the invitation!`);
      
      // Update UI live
      setInvites(prev =>
        prev.map(inv =>
          inv.email === data.email ? { ...inv, status: "ACCEPTED" } : inv
        )
      );
    };

    socket.on("invite_accepted", onInviteAccepted);

    return () => {
      socket.off("invite_accepted", onInviteAccepted);
    };
  }, []);

  const pendingInvites = invites.filter(inv => inv.status !== "ACCEPTED").length;
  const acceptedInvites = invites.filter(inv => inv.status === "ACCEPTED").length;

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 to-blue-50 p-6">
      <div className="max-w-4xl mx-auto">
        {/* Header */}
        <div className="text-center mb-8">
          <div className="flex items-center justify-center gap-3 mb-4">
            <div className="p-3 bg-gradient-to-r from-blue-500 to-purple-600 rounded-2xl shadow-lg">
              <Users className="w-8 h-8 text-white" />
            </div>
            <h1 className="text-4xl font-bold bg-gradient-to-r from-slate-800 to-blue-600 bg-clip-text text-transparent">
              Team Invitations
            </h1>
          </div>
          <p className="text-slate-600 text-lg max-w-2xl mx-auto">
            Invite team members to join your workspace and collaborate seamlessly
          </p>
        </div>

        {/* Stats Cards */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Total Invites</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{invites.length}</p>
              </div>
              <div className="p-3 bg-blue-50 rounded-xl">
                <Mail className="w-6 h-6 text-blue-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Pending</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{pendingInvites}</p>
              </div>
              <div className="p-3 bg-yellow-50 rounded-xl">
                <Clock className="w-6 h-6 text-yellow-600" />
              </div>
            </div>
          </div>

          <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
            <div className="flex items-center justify-between">
              <div>
                <p className="text-slate-600 text-sm font-medium">Accepted</p>
                <p className="text-3xl font-bold text-slate-900 mt-2">{acceptedInvites}</p>
              </div>
              <div className="p-3 bg-green-50 rounded-xl">
                <CheckCircle className="w-6 h-6 text-green-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Send Invite Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200 mb-8">
          <div className="flex items-center gap-3 mb-6">
            <div className="p-2 bg-blue-100 rounded-lg">
              <Send className="w-6 h-6 text-blue-600" />
            </div>
            <h2 className="text-2xl font-bold text-slate-900">Send New Invitation</h2>
          </div>

          <div className="flex flex-col sm:flex-row gap-4 items-start sm:items-end">
            <div className="flex-1">
              <label htmlFor="email" className="block text-sm font-medium text-slate-700 mb-2">
                Email Address
              </label>
              <div className="relative">
                <Mail className="absolute left-3 top-1/2 transform -translate-y-1/2 text-slate-400 w-5 h-5" />
                <input
                  id="email"
                  type="email"
                  placeholder="team.member@company.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  onKeyPress={(e) => e.key === 'Enter' && sendInvite()}
                  className="w-full pl-10 pr-4 py-3 border border-slate-300 rounded-xl focus:ring-2 focus:ring-blue-500 focus:border-blue-500 transition-all duration-200"
                />
              </div>
            </div>
            
            <button
              onClick={sendInvite}
              disabled={loading || !email}
              className="flex items-center gap-2 px-6 py-3 bg-gradient-to-r from-blue-600 to-purple-600 text-white rounded-xl hover:from-blue-700 hover:to-purple-700 disabled:from-slate-400 disabled:to-slate-500 disabled:cursor-not-allowed transition-all duration-300 shadow-lg hover:shadow-xl font-medium"
            >
              {loading ? (
                <RefreshCw className="w-5 h-5 animate-spin" />
              ) : (
                <Send className="w-5 h-5" />
              )}
              {loading ? "Sending..." : "Send Invite"}
            </button>
          </div>
        </div>

        {/* Invites List Card */}
        <div className="bg-white rounded-2xl p-6 shadow-sm border border-slate-200">
          <div className="flex items-center justify-between mb-6">
            <div className="flex items-center gap-3">
              <div className="p-2 bg-slate-100 rounded-lg">
                <Users className="w-6 h-6 text-slate-700" />
              </div>
              <h2 className="text-2xl font-bold text-slate-900">Sent Invitations</h2>
            </div>
            
            <button
              onClick={fetchInvites}
              disabled={refreshing}
              className="flex items-center gap-2 px-4 py-2 bg-slate-100 text-slate-700 rounded-xl hover:bg-slate-200 disabled:opacity-50 transition-all duration-200 font-medium"
            >
              <RefreshCw className={`w-4 h-4 ${refreshing ? 'animate-spin' : ''}`} />
              Refresh
            </button>
          </div>

          {invites.length === 0 ? (
            <div className="text-center py-12">
              <Users className="w-16 h-16 text-slate-300 mx-auto mb-4" />
              <h3 className="text-lg font-semibold text-slate-600 mb-2">No invitations sent yet</h3>
              <p className="text-slate-500">Send your first invitation to get started</p>
            </div>
          ) : (
            <div className="space-y-4">
              {invites.map((invite) => (
                <div
                  key={invite.id}
                  className="flex flex-col sm:flex-row sm:items-center justify-between p-5 bg-slate-50 rounded-xl border border-slate-200 hover:bg-white hover:shadow-md transition-all duration-200 group"
                >
                  <div className="flex-1 mb-3 sm:mb-0">
                    <div className="flex items-center gap-3 mb-2">
                      <Mail className="w-4 h-4 text-slate-400" />
                      <p className="font-semibold text-slate-900 text-lg">{invite.email}</p>
                    </div>
                    <p className="text-sm text-slate-500 ml-7">
                      Sent on {new Date(invite.createdAt).toLocaleDateString('en-US', { 
                        weekday: 'long',
                        year: 'numeric',
                        month: 'long',
                        day: 'numeric'
                      })}
                    </p>
                  </div>
                  
                  <div className="flex items-center gap-3">
                    {invite.status !== "ACCEPTED" && (
                      <button
                        onClick={() => copyInviteLink(invite.token, invite.email)}
                        className="flex items-center gap-2 px-4 py-2 bg-white text-slate-700 border border-slate-300 rounded-xl hover:bg-blue-50 hover:text-blue-600 hover:border-blue-300 transition-all duration-200 font-medium"
                      >
                        {copiedEmail === invite.email ? (
                          <CheckCircle className="w-4 h-4" />
                        ) : (
                          <Copy className="w-4 h-4" />
                        )}
                        {copiedEmail === invite.email ? "Copied!" : "Copy Link"}
                      </button>
                    )}
                    
                    <div className={`flex items-center gap-2 px-3 py-2 rounded-lg border ${getStatusColor(invite.status)}`}>
                      {getStatusIcon(invite.status)}
                      <span className="text-sm font-medium">{getStatusText(invite.status)}</span>
                    </div>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Quick Tips */}
        <div className="mt-6 bg-blue-50 border border-blue-200 rounded-2xl p-6">
          <h3 className="font-semibold text-blue-900 mb-3 flex items-center gap-2">
            <Link2 className="w-5 h-5" />
            Quick Tips
          </h3>
          <ul className="text-blue-800 text-sm space-y-2">
            <li>• Invited users will receive a unique link to join your workspace</li>
            <li>• You can copy and share the invite link directly with team members</li>
            <li>• You'll get notified when someone accepts your invitation</li>
            <li>• Pending invitations can be resent if needed</li>
          </ul>
        </div>
      </div>
    </div>
  );
}