import { useEffect, useState } from 'react';
import { RefreshCw, Activity } from 'lucide-react';
import { getHealth } from '@/lib/api';
import { useLocale } from '@/lib/i18n';
import StatusCard from './shared/StatusCard';

export default function OverviewTab() {
    const { t } = useLocale();
    const [health, setHealth] = useState<any>(null);
    const [loading, setLoading] = useState(false);

    const refetchHealth = async () => {
        setLoading(true);
        try {
            const data = await getHealth();
            setHealth(data);
        } catch (error) {
            console.error('Failed to fetch health:', error);
        } finally {
            setLoading(false);
        }
    };
    const [autoRefresh, setAutoRefresh] = useState(true);

    // Auto-refresh on page focus
    useEffect(() => {
        const handleVisibilityChange = () => {
            if (!document.hidden && autoRefresh) {
                refetchHealth();
            }
        };

        document.addEventListener('visibilitychange', handleVisibilityChange);
        return () => document.removeEventListener('visibilitychange', handleVisibilityChange);
    }, [autoRefresh, refetchHealth]);

    const components = health?.runtime?.components || {};

    return (
        <div className="space-y-8">
            {/* Quick Actions */}
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <button
                    onClick={() => refetchHealth()}
                    disabled={loading}
                    className="p-4 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white rounded-xl font-semibold transition-all flex items-center justify-center gap-2"
                >
                    <RefreshCw className={`h-5 w-5 ${loading ? 'animate-spin' : ''}`} />
                    {t('common.refresh_status')}
                </button>

                <label className="p-4 bg-gray-800/30 border border-gray-700 rounded-xl flex items-center gap-3 cursor-pointer hover:bg-gray-800/50 transition-colors">
                    <input
                        type="checkbox"
                        checked={autoRefresh}
                        onChange={(e) => setAutoRefresh(e.target.checked)}
                        className="rounded accent-blue-600"
                    />
                    <span className="text-white font-medium">{t('controlPanel.overview.auto_refresh')}</span>
                </label>
            </div>

            {/* System Health */}
            <div>
                <h2 className="text-xl font-semibold text-white mb-4">
                    {t('controlPanel.overview.health')}
                </h2>
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                    {Object.entries(components).map(([key, component]: [string, any]) => (
                        <StatusCard
                            key={key}
                            title={
                                key.replace(/_/g, ' ').charAt(0).toUpperCase() +
                                key.replace(/_/g, ' ').slice(1)
                            }
                            icon={<Activity className="h-5 w-5" />}
                            status={component?.status === 'ok' ? 'ok' : 'error'}
                            details={
                                component?.status === 'ok'
                                    ? 'System operational'
                                    : component?.last_error || 'Unknown error'
                            }
                            lastUpdated={
                                component?.updated_at
                                    ? `Updated: ${new Date(component.updated_at).toLocaleTimeString()}`
                                    : undefined
                            }
                        />
                    ))}
                </div>
            </div>

            {/* System Info */}
            {health && (
                <div className="bg-gray-800/20 border border-gray-700 rounded-xl p-6 space-y-4">
                    <h2 className="text-xl font-semibold text-white">
                        {t('controlPanel.overview.system_info')}
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Daemon PID</p>
                            <p className="text-lg font-mono font-bold text-white">{health.pid}</p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Uptime</p>
                            <p className="text-lg font-mono font-bold text-white">
                                {Math.floor(health.uptime_seconds / 60)} minutes
                            </p>
                        </div>
                        <div>
                            <p className="text-xs text-gray-400 uppercase tracking-wider">Paired</p>
                            <p className="text-lg font-mono font-bold text-green-400">
                                {health.paired ? 'Yes' : 'No'}
                            </p>
                        </div>
                    </div>
                </div>
            )}
        </div>
    );
}
