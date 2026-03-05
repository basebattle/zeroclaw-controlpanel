import { ReactNode } from 'react';
import StatusBadge from './StatusBadge';

type Status = 'ok' | 'error' | 'warning' | 'disabled';

interface StatusCardProps {
    title: string;
    icon: ReactNode;
    status: Status;
    details?: string;
    lastUpdated?: string;
}

export default function StatusCard({ title, icon, status, details, lastUpdated }: StatusCardProps) {
    return (
        <div className="bg-gray-800/30 border border-gray-700 rounded-xl p-4">
            <div className="flex items-start justify-between">
                <div className="flex items-start gap-3">
                    <div className="p-2 bg-gray-700/30 rounded-lg text-gray-400">
                        {icon}
                    </div>
                    <div>
                        <h3 className="font-semibold text-white text-sm">{title}</h3>
                        {details && <p className="text-gray-400 text-xs mt-1">{details}</p>}
                        {lastUpdated && <p className="text-gray-500 text-xs mt-2">{lastUpdated}</p>}
                    </div>
                </div>
                <StatusBadge status={status} size="md" />
            </div>
        </div>
    );
}
