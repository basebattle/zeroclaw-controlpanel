import { CheckCircle2, XCircle, AlertCircle } from 'lucide-react';

type Status = 'ok' | 'error' | 'warning' | 'disabled';

interface StatusBadgeProps {
    status: Status;
    size?: 'sm' | 'md' | 'lg';
}

export default function StatusBadge({ status, size = 'md' }: StatusBadgeProps) {
    const sizeClasses = {
        sm: 'h-4 w-4',
        md: 'h-5 w-5',
        lg: 'h-6 w-6',
    };

    const baseClass = sizeClasses[size];

    switch (status) {
        case 'ok':
            return <CheckCircle2 className={`${baseClass} text-green-500`} />;
        case 'error':
            return <XCircle className={`${baseClass} text-red-500`} />;
        case 'warning':
            return <AlertCircle className={`${baseClass} text-yellow-500`} />;
        case 'disabled':
            return <XCircle className={`${baseClass} text-gray-500`} />;
    }
}
