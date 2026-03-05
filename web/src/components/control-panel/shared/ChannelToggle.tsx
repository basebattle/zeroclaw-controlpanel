import { Power, Zap, AlertCircle } from 'lucide-react';
import StatusBadge from './StatusBadge';

type ChannelStatus = 'active' | 'disabled' | 'error';

interface ChannelToggleProps {
    name: string;
    status: ChannelStatus;
    onToggle: () => void;
    onTest: () => void;
    isTesting?: boolean;
    testError?: string;
}

export default function ChannelToggle({
    name,
    status,
    onToggle,
    onTest,
    isTesting = false,
    testError,
}: ChannelToggleProps) {
    return (
        <div className="flex items-center justify-between p-4 bg-gray-800/20 border border-gray-700 rounded-lg hover:bg-gray-800/30 transition-colors">
            <div className="flex items-center gap-3 flex-1">
                <Zap className="h-5 w-5 text-gray-400" />
                <div className="flex-1">
                    <h4 className="font-medium text-white">{name}</h4>
                    {testError && (
                        <p className="text-red-400 text-xs mt-1 flex items-center gap-1">
                            <AlertCircle className="h-3 w-3" />
                            {testError}
                        </p>
                    )}
                </div>
                <StatusBadge
                    status={status === 'active' ? 'ok' : status === 'error' ? 'error' : 'disabled'}
                    size="sm"
                />
            </div>

            <div className="flex items-center gap-2 ml-4">
                <button
                    onClick={onTest}
                    disabled={isTesting || status === 'disabled'}
                    className="px-3 py-1.5 text-xs font-medium bg-gray-700 hover:bg-gray-600 disabled:bg-gray-800 disabled:text-gray-600 text-gray-300 rounded transition-colors"
                >
                    {isTesting ? 'Testing...' : 'Test'}
                </button>
                <button
                    onClick={onToggle}
                    className={`p-2 rounded transition-colors ${
                        status === 'active'
                            ? 'text-green-400 hover:bg-green-500/10'
                            : 'text-gray-500 hover:bg-gray-700/30'
                    }`}
                    title={status === 'active' ? 'Disable channel' : 'Enable channel'}
                >
                    <Power className="h-5 w-5" />
                </button>
            </div>
        </div>
    );
}
