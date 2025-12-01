"use client";

import React, { useEffect, useState } from "react";
import { 
  Search, 
  Download, 
  RefreshCw, 
  User,
  Calendar,
  Database,
  ChevronDown,
  ChevronRight,
  AlertCircle,
  CheckCircle,
  XCircle,
  Clock,
  Globe,
  Activity,
  FileText,
  Tag,
  MapPin
} from "lucide-react";

interface Log {
  id: number;
  action: string;
  entity: string;
  entityId?: number;
  details: Record<string, any>;
  userId?: number;
  user?: {
    id: number;
    name: string;
    email: string;
    role: string;
  };
  ipAddress?: string;
  userAgent?: string;
  createdAt: string;
}

interface DetailField {
  label: string;
  value: string;
  icon?: React.ReactNode;
}

export default function AuditLogsPage() {
  const [logs, setLogs] = useState<Log[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState("");
  const [expandedLogs, setExpandedLogs] = useState<number[]>([]);
  const [selectedDate, setSelectedDate] = useState<string>('');
  const [page, setPage] = useState(1);
  const logsPerPage = 10;

  useEffect(() => {
    fetchLogs();
  }, []);

  const fetchLogs = async () => {
    setLoading(true);
    try {
      const res = await fetch("/api/audit-logs");
      const data = await res.json();
      if (data.success) {
        setLogs(data.data || []);
      }
    } catch (error) {
      console.error("Error fetching audit logs:", error);
    } finally {
      setLoading(false);
    }
  };

  const toggleLogExpansion = (logId: number) => {
    setExpandedLogs(prev =>
      prev.includes(logId)
        ? prev.filter(id => id !== logId)
        : [...prev, logId]
    );
  };

  const getActionColor = (action: string) => {
    const actionColors: Record<string, string> = {
      'CREATE': 'bg-green-100 text-green-800',
      'UPDATE': 'bg-blue-100 text-blue-800',
      'DELETE': 'bg-red-100 text-red-800',
      'LOGIN': 'bg-purple-100 text-purple-800',
      'LOGOUT': 'bg-gray-100 text-gray-800',
      'ERROR': 'bg-yellow-100 text-yellow-800',
    };
    return actionColors[action] || 'bg-gray-100 text-gray-800';
  };

  const getStatusIcon = (action: string) => {
    if (action.includes('ERROR')) 
      return <AlertCircle className="w-4 h-4 text-red-500" />;
    if (action === 'CREATE') 
      return <CheckCircle className="w-4 h-4 text-green-500" />;
    if (action === 'DELETE') 
      return <XCircle className="w-4 h-4 text-red-500" />;
    if (action === 'UPDATE') 
      return <Activity className="w-4 h-4 text-blue-500" />;
    return <Activity className="w-4 h-4 text-gray-500" />;
  };

  const formatDateTime = (dateString: string) => {
    const date = new Date(dateString);
    return {
      date: date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      }),
      time: date.toLocaleTimeString('en-US', {
        hour: '2-digit',
        minute: '2-digit'
      })
    };
  };

  const getIconForDetail = (label: string) => {
    const iconMap: Record<string, React.ReactNode> = {
      'Changes': <Activity className="w-4 h-4" />,
      'Reason': <FileText className="w-4 h-4" />,
      'Resource': <Database className="w-4 h-4" />,
      'Path': <MapPin className="w-4 h-4" />,
      'Status': <Activity className="w-4 h-4" />,
      'Size': <Database className="w-4 h-4" />,
      'User': <User className="w-4 h-4" />,
      'IP Address': <Globe className="w-4 h-4" />,
      'Duration': <Clock className="w-4 h-4" />,
    };
    
    return iconMap[label] || <FileText className="w-4 h-4" />;
  };

  const formatDetails = (details: Record<string, any>, log: Log) => {
    const fields: DetailField[] = [];

    // Add entity info
    fields.push({
      label: "Entity",
      value: log.entity,
      icon: <Database className="w-4 h-4" />
    });

    if (log.entityId) {
      fields.push({
        label: "Entity ID",
        value: log.entityId.toString(),
        icon: <Tag className="w-4 h-4" />
      });
    }

    // Add user info
    if (log.user) {
      fields.push({
        label: "User",
        value: `${log.user.name} (${log.user.email})`,
        icon: <User className="w-4 h-4" />
      });

      fields.push({
        label: "Role",
        value: log.user.role,
        icon: <User className="w-4 h-4" />
      });
    }

    // Add IP address
    if (log.ipAddress) {
      fields.push({
        label: "IP Address",
        value: log.ipAddress,
        icon: <Globe className="w-4 h-4" />
      });
    }

    // Parse details object
    Object.entries(details).forEach(([key, value]) => {
      fields.push({
        label: key.charAt(0).toUpperCase() + key.slice(1).replace(/_/g, ' '),
        value: typeof value === 'object' ? JSON.stringify(value, null, 2) : String(value),
        icon: getIconForDetail(key)
      });
    });

    return fields;
  };

  const filteredLogs = logs.filter(log => {
    const searchLower = search.toLowerCase();
    const matchesSearch = 
      log.action.toLowerCase().includes(searchLower) ||
      log.entity.toLowerCase().includes(searchLower) ||
      log.user?.name?.toLowerCase().includes(searchLower) ||
      log.user?.email?.toLowerCase().includes(searchLower) ||
      JSON.stringify(log.details).toLowerCase().includes(searchLower);

    const logDate = new Date(log.createdAt).toISOString().split('T')[0];
    const matchesDate = !selectedDate || logDate === selectedDate;

    return matchesSearch && matchesDate;
  });

  const paginatedLogs = filteredLogs.slice(
    (page - 1) * logsPerPage,
    page * logsPerPage
  );

  const totalPages = Math.ceil(filteredLogs.length / logsPerPage);

  const exportLogs = () => {
    const csvContent = [
      ['ID', 'Action', 'Entity', 'User', 'Email', 'Details', 'IP Address', 'Timestamp'].join(','),
      ...filteredLogs.map(log => [
        log.id,
        log.action,
        log.entity,
        log.user?.name || 'System',
        log.user?.email || 'N/A',
        JSON.stringify(log.details).replace(/,/g, ';'),
        log.ipAddress || 'N/A',
        new Date(log.createdAt).toISOString()
      ].join(','))
    ].join('\n');

    const blob = new Blob([csvContent], { type: 'text/csv' });
    const url = window.URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`;
    a.click();
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50 p-6">
        <div className="max-w-7xl mx-auto">
          <div className="flex items-center justify-center h-64">
            <div className="text-center">
              <div className="animate-spin rounded-full h-12 w-12 border-4 border-blue-600 border-t-transparent mx-auto mb-4"></div>
              <p className="text-gray-600 text-lg">Loading audit logs...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-gray-50 p-4 md:p-6">
      <div className="max-w-7xl mx-auto">
        {/* Header */}
        <div className="mb-8">
          <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4 mb-6">
            <div>
              <h1 className="text-2xl font-bold text-gray-900">Audit Logs</h1>
              <p className="text-gray-600 mt-1">Track system activities and user actions</p>
            </div>
            <div className="flex gap-3">
              <button
                onClick={exportLogs}
                className="flex items-center gap-2 px-4 py-2 bg-white text-gray-700 rounded-lg border border-gray-300 hover:bg-gray-50"
              >
                <Download className="w-4 h-4" />
                Export CSV
              </button>
              <button
                onClick={fetchLogs}
                className="flex items-center gap-2 px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700"
              >
                <RefreshCw className="w-4 h-4" />
                Refresh
              </button>
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Total Logs</p>
                  <p className="text-xl font-bold text-gray-900">{logs.length}</p>
                </div>
                <Database className="w-5 h-5 text-blue-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">User Actions</p>
                  <p className="text-xl font-bold text-gray-900">
                    {logs.filter(l => l.entity === 'USER').length}
                  </p>
                </div>
                <User className="w-5 h-5 text-green-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Today</p>
                  <p className="text-xl font-bold text-gray-900">
                    {logs.filter(l => {
                      const today = new Date().toISOString().split('T')[0];
                      const logDate = new Date(l.createdAt).toISOString().split('T')[0];
                      return logDate === today;
                    }).length}
                  </p>
                </div>
                <Calendar className="w-5 h-5 text-purple-600" />
              </div>
            </div>
            <div className="bg-white rounded-lg p-4 border border-gray-200">
              <div className="flex items-center justify-between">
                <div>
                  <p className="text-gray-600 text-sm">Errors</p>
                  <p className="text-xl font-bold text-gray-900">
                    {logs.filter(l => l.action.includes('ERROR')).length}
                  </p>
                </div>
                <AlertCircle className="w-5 h-5 text-red-600" />
              </div>
            </div>
          </div>
        </div>

        {/* Filters */}
        <div className="mb-6">
          <div className="bg-white rounded-lg p-4 border border-gray-200">
            <div className="flex flex-col md:flex-row gap-4">
              <div className="flex-1">
                <div className="relative">
                  <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-5 h-5" />
                  <input
                    type="text"
                    placeholder="Search logs..."
                    value={search}
                    onChange={(e) => setSearch(e.target.value)}
                    className="w-full pl-10 pr-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
                  />
                </div>
              </div>
              <input
                type="date"
                value={selectedDate}
                onChange={(e) => setSelectedDate(e.target.value)}
                className="px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500 outline-none"
              />
            </div>
          </div>
        </div>

        {/* Logs Table */}
        <div className="bg-white rounded-lg shadow-sm border border-gray-200 overflow-hidden">
          {paginatedLogs.length === 0 ? (
            <div className="text-center py-12">
              <FileText className="w-12 h-12 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">No audit logs found</p>
              <p className="text-gray-400 text-sm mt-2">
                {search ? 'Try changing your search terms' : 'No logs have been recorded yet'}
              </p>
            </div>
          ) : (
            <div className="overflow-x-auto">
              <table className="w-full">
                <thead>
                  <tr className="bg-gray-50 border-b border-gray-200">
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Action</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Entity</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">User</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Time</th>
                    <th className="p-4 text-left text-sm font-semibold text-gray-700">Details</th>
                  </tr>
                </thead>
                <tbody>
                  {paginatedLogs.map((log) => {
                    const timeInfo = formatDateTime(log.createdAt);
                    const detailFields = formatDetails(log.details, log);
                    
                    return (
                      <React.Fragment key={`log-${log.id}`}>
                        <tr 
                          className="border-b border-gray-100 hover:bg-gray-50 cursor-pointer"
                          onClick={() => toggleLogExpansion(log.id)}
                        >
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              {getStatusIcon(log.action)}
                              <span className={`px-3 py-1 rounded-full text-sm font-medium ${getActionColor(log.action)}`}>
                                {log.action}
                              </span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center gap-2">
                              <Database className="w-4 h-4 text-gray-500" />
                              <span className="font-medium">{log.entity}</span>
                              {log.entityId && (
                                <span className="text-sm text-gray-500">#{log.entityId}</span>
                              )}
                            </div>
                          </td>
                          <td className="p-4">
                            {log.user ? (
                              <div>
                                <p className="font-medium">{log.user.name}</p>
                                <p className="text-sm text-gray-500">{log.user.email}</p>
                              </div>
                            ) : (
                              <span className="text-gray-500">System</span>
                            )}
                          </td>
                          <td className="p-4">
                            <div className="flex flex-col">
                              <span className="text-sm font-medium">{timeInfo.date}</span>
                              <span className="text-xs text-gray-500">{timeInfo.time}</span>
                            </div>
                          </td>
                          <td className="p-4">
                            <div className="flex items-center justify-between">
                              <span className="text-sm text-gray-600">
                                {Object.keys(log.details).length > 0 
                                  ? `${Object.keys(log.details).length} details`
                                  : 'No details'}
                              </span>
                              {expandedLogs.includes(log.id) ? (
                                <ChevronDown className="w-5 h-5 text-gray-400" />
                              ) : (
                                <ChevronRight className="w-5 h-5 text-gray-400" />
                              )}
                            </div>
                          </td>
                        </tr>
                        
                        {/* Expanded Details */}
                        {expandedLogs.includes(log.id) && (
                          <tr key={`detail-${log.id}`} className="bg-blue-50 border-b border-blue-100">
                            <td colSpan={5} className="p-4">
                              <div className="space-y-4">
                                <h4 className="text-sm font-semibold text-gray-700 mb-3">Log Details</h4>
                                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-3">
                                  {detailFields.map((field, index) => (
                                    <div 
                                      key={`${log.id}-field-${index}`} 
                                      className="bg-white rounded-lg p-3 border border-gray-200"
                                    >
                                      <div className="flex items-center gap-2 mb-2">
                                        {field.icon}
                                        <span className="text-xs font-medium text-gray-600">
                                          {field.label}
                                        </span>
                                      </div>
                                      <p className="text-sm text-gray-800 break-words">
                                        {field.value}
                                      </p>
                                    </div>
                                  ))}
                                </div>
                              </div>
                            </td>
                          </tr>
                        )}
                      </React.Fragment>
                    );
                  })}
                </tbody>
              </table>
            </div>
          )}

          {/* Pagination */}
          {filteredLogs.length > logsPerPage && (
            <div className="flex flex-col sm:flex-row items-center justify-between p-4 border-t border-gray-200">
              <div className="text-sm text-gray-600 mb-3 sm:mb-0">
                Showing {((page - 1) * logsPerPage) + 1} to {Math.min(page * logsPerPage, filteredLogs.length)} of {filteredLogs.length} logs
              </div>
              <div className="flex items-center gap-2">
                <button
                  onClick={() => setPage(p => Math.max(1, p - 1))}
                  disabled={page === 1}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                >
                  Previous
                </button>
                <span className="px-3 py-1 bg-blue-600 text-white rounded">
                  {page}
                </span>
                <span className="text-gray-400">of {totalPages}</span>
                <button
                  onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                  disabled={page === totalPages}
                  className="px-3 py-1 rounded border border-gray-300 disabled:opacity-50 hover:bg-gray-50"
                >
                  Next
                </button>
              </div>
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="mt-6 text-center text-sm text-gray-500">
          <p>Audit logs are automatically recorded for security purposes.</p>
        </div>
      </div>
    </div>
  );
}