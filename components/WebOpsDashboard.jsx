import React, { useState, useEffect } from 'react';
import { AlertCircle, CheckCircle2, AlertTriangle, RotateCw } from 'lucide-react';

export default function WebOpsDashboard() {
  const [postmarkData, setPostmarkData] = useState(null);
  const [wpEngineData, setWpEngineData] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);
  const [lastRefresh, setLastRefresh] = useState(null);

  const fetchData = async () => {
    setLoading(true);
    setError(null);

    try {
      const [postmarkRes, wpEngineRes] = await Promise.all([
        fetch('/api/postmark'),
        fetch('/api/wpengine'),
      ]);

      if (!postmarkRes.ok) {
        const err = await postmarkRes.json();
        throw new Error(err.error || 'Failed to fetch Postmark data');
      }
      if (!wpEngineRes.ok) {
        const err = await wpEngineRes.json();
        throw new Error(err.error || 'Failed to fetch WP Engine data');
      }

      const [postmark, wpEngine] = await Promise.all([
        postmarkRes.json(),
        wpEngineRes.json(),
      ]);

      setPostmarkData(postmark);
      setWpEngineData(wpEngine);
      setLastRefresh(new Date());
    } catch (err) {
      setError(err.message || 'Failed to fetch data');
      console.error('Dashboard fetch error:', err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchData();
  }, []);

  const getStatusColor = (value, thresholds) => {
    if (value === null || value === undefined) return 'bg-slate-50 border-slate-200';
    if (value >= thresholds.good) return 'bg-green-50 border-green-200';
    if (value >= thresholds.warning) return 'bg-amber-50 border-amber-200';
    return 'bg-red-50 border-red-200';
  };

  const getStatusIcon = (value, thresholds) => {
    if (value === null || value === undefined)
      return <AlertCircle className="w-5 h-5 text-slate-400" />;
    if (value >= thresholds.good) return <CheckCircle2 className="w-5 h-5 text-green-600" />;
    if (value >= thresholds.warning) return <AlertTriangle className="w-5 h-5 text-amber-600" />;
    return <AlertCircle className="w-5 h-5 text-red-600" />;
  };

  const formatNumber = (num) =>
    typeof num === 'number' ? num.toLocaleString() : '—';

  const formatTime = (date) => {
    if (!date) return 'Never';
    return date.toLocaleTimeString('en-US', { hour: '2-digit', minute: '2-digit' });
  };

  return (
    <div className="min-h-screen bg-slate-50 p-6">
      <div className="max-w-6xl mx-auto">

        {/* Header */}
        <div className="mb-8">
          <div className="flex items-start justify-between">
            <div>
              <h1 className="text-3xl font-light tracking-tight text-slate-900 mb-1">
                actuary.org Operations
              </h1>
              <p className="text-sm text-slate-600">
                Real-time infrastructure and email delivery status
              </p>
            </div>
            <div className="flex gap-3 items-center">
              <button
                onClick={fetchData}
                disabled={loading}
                className="flex items-center gap-2 px-3 py-2 rounded border border-slate-300 bg-white hover:bg-slate-50 disabled:opacity-50 transition text-slate-700 text-sm font-medium"
              >
                <RotateCw className={`w-4 h-4 ${loading ? 'animate-spin' : ''}`} />
                Refresh
              </button>
              <div className="text-right">
                <p className="text-xs text-slate-500">Last update</p>
                <p className="text-sm font-medium text-slate-900">{formatTime(lastRefresh)}</p>
              </div>
            </div>
          </div>
        </div>

        {/* Status Strip */}
        {postmarkData && wpEngineData && (
          <div className="grid grid-cols-2 gap-3 mb-8">
            <div className="p-4 rounded border border-slate-200 bg-white">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">WordPress</p>
              <div className="flex items-center gap-2">
                {wpEngineData.status === 'operational' ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
                <span className="font-medium text-slate-900 capitalize">{wpEngineData.status}</span>
              </div>
            </div>
            <div className="p-4 rounded border border-slate-200 bg-white">
              <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">Email</p>
              <div className="flex items-center gap-2">
                {postmarkData.bounces === 0 && postmarkData.complaints === 0 ? (
                  <CheckCircle2 className="w-5 h-5 text-green-600" />
                ) : (
                  <AlertTriangle className="w-5 h-5 text-amber-600" />
                )}
                <span className="font-medium text-slate-900">
                  {formatNumber(postmarkData.sent)} sent
                </span>
              </div>
            </div>
          </div>
        )}

        {/* Error State */}
        {error && (
          <div className="mb-6 p-4 rounded border border-red-200 bg-red-50">
            <div className="flex gap-3">
              <AlertCircle className="w-5 h-5 text-red-600 flex-shrink-0 mt-0.5" />
              <div>
                <p className="font-medium text-red-900">Failed to load data</p>
                <p className="text-sm text-red-800 mt-1">{error}</p>
                <p className="text-xs text-red-700 mt-2">
                  Ensure POSTMARK_SERVER_TOKEN, WPENGINE_USER_ID, and WPENGINE_PASSWORD are set in
                  your Vercel environment variables.
                </p>
              </div>
            </div>
          </div>
        )}

        {/* Loading State */}
        {loading && (
          <div className="text-center py-12">
            <div className="animate-spin w-8 h-8 border-2 border-slate-300 border-t-slate-900 rounded-full mx-auto mb-3"></div>
            <p className="text-slate-600">Fetching real-time data...</p>
          </div>
        )}

        {/* Postmark Metrics */}
        {!loading && postmarkData && (
          <div className="mb-8">
            <h2 className="text-lg font-light text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-slate-300 rounded-full"></span>
              Email Delivery (Postmark)
            </h2>
            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div className="p-4 rounded border border-slate-200 bg-white">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">Sent</p>
                <p className="text-2xl font-light text-slate-900">{formatNumber(postmarkData.sent)}</p>
                <p className="text-xs text-slate-600 mt-2">Last 7 days</p>
              </div>

              <div className={`p-4 rounded border ${getStatusColor(postmarkData.bounces === 0 ? 100 : 0, { good: 50, warning: 1 })}`}>
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">Bounces</p>
                <div className="flex items-baseline gap-2">
                  {getStatusIcon(postmarkData.bounces === 0 ? 100 : 0, { good: 50, warning: 1 })}
                  <p className="text-2xl font-light text-slate-900">{formatNumber(postmarkData.bounces)}</p>
                </div>
                <p className="text-xs text-slate-600 mt-2">7-day total</p>
              </div>

              <div className={`p-4 rounded border ${getStatusColor(postmarkData.complaints === 0 ? 100 : 0, { good: 50, warning: 1 })}`}>
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">Complaints</p>
                <div className="flex items-baseline gap-2">
                  {getStatusIcon(postmarkData.complaints === 0 ? 100 : 0, { good: 50, warning: 1 })}
                  <p className="text-2xl font-light text-slate-900">{formatNumber(postmarkData.complaints)}</p>
                </div>
                <p className="text-xs text-slate-600 mt-2">7-day total</p>
              </div>

              <div className="p-4 rounded border border-slate-200 bg-white">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">Opens</p>
                <p className="text-2xl font-light text-slate-900">{formatNumber(postmarkData.opens)}</p>
                <p className="text-xs text-slate-600 mt-2">7-day total</p>
              </div>

              <div className="p-4 rounded border border-slate-200 bg-white">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">Clicks</p>
                <p className="text-2xl font-light text-slate-900">{formatNumber(postmarkData.clicks)}</p>
                <p className="text-xs text-slate-600 mt-2">7-day total</p>
              </div>
            </div>
          </div>
        )}

        {/* WP Engine Metrics */}
        {!loading && wpEngineData && (
          <div>
            <h2 className="text-lg font-light text-slate-900 mb-4 flex items-center gap-2">
              <span className="w-1 h-6 bg-slate-300 rounded-full"></span>
              WordPress Infrastructure (WP Engine)
            </h2>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mb-4">
              <div className={`p-4 rounded border ${wpEngineData.status === 'operational' ? 'bg-green-50 border-green-200' : 'bg-amber-50 border-amber-200'}`}>
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">Status</p>
                <div className="flex items-center gap-2">
                  {wpEngineData.status === 'operational' ? (
                    <CheckCircle2 className="w-5 h-5 text-green-600" />
                  ) : (
                    <AlertTriangle className="w-5 h-5 text-amber-600" />
                  )}
                  <p className="text-lg font-medium text-slate-900 capitalize">{wpEngineData.status}</p>
                </div>
                <p className="text-xs text-slate-600 mt-2">System status</p>
              </div>

              <div className="p-4 rounded border border-slate-200 bg-white">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-2">Installs</p>
                <p className="text-2xl font-light text-slate-900">{wpEngineData.installCount}</p>
                <p className="text-xs text-slate-600 mt-2">Active environments</p>
              </div>
            </div>

            {wpEngineData.installs && wpEngineData.installs.length > 0 && (
              <div className="p-4 rounded border border-slate-200 bg-white">
                <p className="text-xs font-medium text-slate-600 uppercase tracking-wide mb-3">Installs</p>
                <div className="divide-y divide-slate-100">
                  {wpEngineData.installs.map((install) => (
                    <div key={install.name} className="py-2 flex items-center justify-between">
                      <div>
                        <p className="text-sm font-medium text-slate-900">{install.name}</p>
                        <p className="text-xs text-slate-500">{install.primaryDomain || '—'}</p>
                      </div>
                      <div className="flex items-center gap-2">
                        <span className="text-xs text-slate-500 capitalize">{install.environment}</span>
                        {install.status === 'running' ? (
                          <CheckCircle2 className="w-4 h-4 text-green-600" />
                        ) : (
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
