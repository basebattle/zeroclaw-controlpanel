import { Trash2, CheckCircle2 } from 'lucide-react';

interface Model {
    provider_name: string;
    model_id: string;
    api_key?: string;
    alias?: string;
    is_default?: boolean;
}

interface ModelCardProps {
    index: number;
    model: Model;
    onUpdate: (index: number, key: string, value: any) => void;
    onDelete: (index: number) => void;
    onSetDefault: (index: number) => void;
    isDefault: boolean;
}

const PROVIDERS = [
    { value: 'ollama', label: 'Ollama' },
    { value: 'openai', label: 'OpenAI' },
    { value: 'anthropic', label: 'Anthropic' },
    { value: 'openrouter', label: 'OpenRouter' },
];

export default function ModelCard({
    index,
    model,
    onUpdate,
    onDelete,
    onSetDefault,
    isDefault,
}: ModelCardProps) {
    return (
        <div
            className={`p-4 rounded-xl border transition-all ${
                isDefault
                    ? 'bg-blue-600/5 border-blue-500/30'
                    : 'bg-gray-800/20 border-gray-700'
            }`}
        >
            <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                {/* Provider */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Provider
                    </label>
                    <select
                        value={model.provider_name || 'ollama'}
                        onChange={(e) => onUpdate(index, 'provider_name', e.target.value)}
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    >
                        {PROVIDERS.map((p) => (
                            <option key={p.value} value={p.value}>
                                {p.label}
                            </option>
                        ))}
                    </select>
                </div>

                {/* Model ID */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        Model ID
                    </label>
                    <input
                        type="text"
                        value={model.model_id || ''}
                        onChange={(e) => onUpdate(index, 'model_id', e.target.value)}
                        placeholder="e.g. llama3.2"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* API Key */}
                <div className="space-y-1">
                    <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">
                        API Key
                    </label>
                    <input
                        type="password"
                        value={model.api_key || ''}
                        onChange={(e) => onUpdate(index, 'api_key', e.target.value)}
                        placeholder="••••••••••••"
                        className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                    />
                </div>

                {/* Actions */}
                <div className="flex items-end gap-2 pb-2">
                    <button
                        onClick={() => onSetDefault(index)}
                        className={`flex-1 p-2 rounded-lg transition-colors ${
                            isDefault
                                ? 'text-blue-400 hover:bg-blue-500/10'
                                : 'text-gray-500 hover:text-white hover:bg-gray-700/30'
                        }`}
                        title={isDefault ? 'Default model' : 'Set as default'}
                    >
                        <CheckCircle2 className="h-5 w-5" />
                    </button>
                    <button
                        onClick={() => onDelete(index)}
                        className="flex-1 p-2 text-gray-500 hover:text-red-400 hover:bg-red-500/10 rounded-lg transition-colors"
                        title="Remove model"
                    >
                        <Trash2 className="h-5 w-5" />
                    </button>
                </div>
            </div>
        </div>
    );
}
