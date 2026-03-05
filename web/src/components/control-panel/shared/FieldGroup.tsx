import { ReactNode } from 'react';
import { ChevronDown } from 'lucide-react';
import { useState } from 'react';

interface FieldGroupProps {
    title: string;
    icon?: ReactNode;
    children: ReactNode;
    collapsible?: boolean;
    defaultOpen?: boolean;
}

export default function FieldGroup({
    title,
    icon,
    children,
    collapsible = false,
    defaultOpen = true,
}: FieldGroupProps) {
    const [isOpen, setIsOpen] = useState(defaultOpen);

    return (
        <div className="bg-gray-800/20 border border-gray-700 rounded-xl overflow-hidden">
            {collapsible ? (
                <>
                    <button
                        onClick={() => setIsOpen(!isOpen)}
                        className="w-full px-6 py-4 flex items-center justify-between hover:bg-gray-800/10 transition-colors"
                    >
                        <div className="flex items-center gap-3">
                            {icon && <div className="text-gray-400">{icon}</div>}
                            <h3 className="font-semibold text-white">{title}</h3>
                        </div>
                        <ChevronDown
                            className={`h-5 w-5 text-gray-400 transition-transform ${
                                isOpen ? 'rotate-180' : ''
                            }`}
                        />
                    </button>
                    {isOpen && <div className="px-6 py-4 border-t border-gray-700 space-y-4">{children}</div>}
                </>
            ) : (
                <>
                    <div className="px-6 py-4 border-b border-gray-700 flex items-center gap-3">
                        {icon && <div className="text-gray-400">{icon}</div>}
                        <h3 className="font-semibold text-white">{title}</h3>
                    </div>
                    <div className="px-6 py-4 space-y-4">{children}</div>
                </>
            )}
        </div>
    );
}
