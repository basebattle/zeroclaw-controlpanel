import { useState } from 'react';
import {
    SlidersHorizontal,
    Plus,
    Trash2,
    CheckCircle2,
    Power,
    Activity,
    ShieldCheck,
    MessageSquare,
    Smartphone,
    Save,
    AlertCircle
} from 'lucide-react';
import { useConfigForm } from '@/components/config/useConfigForm';

// JSON Context ID-Mapping Table
const ID_MAPPING = {
    card_model_registry: 'models',
    card_tg_01: 'channels_config.telegram',
    card_wa_01: 'channels_config.whatsapp',
    card_security_01: 'autonomy',
    card_routing_01: 'model_routes'
} as const;

type MappingKey = keyof typeof ID_MAPPING;

export default function ControlPanel() {
    const { getFieldValue, setFieldValue, save, loading, saving, success, error } = useConfigForm();
    const [testingService, setTestingService] = useState<string | null>(null);

    // --- 1. Multi-Model Support ---
    const models = (getFieldValue('', ID_MAPPING.card_model_registry) as any[]) || [];

    const handleAddModel = () => {
        const newModel = {
            provider_name: 'ollama',
            model_id: 'llama3.2',
            api_key: '',
            alias: `model-${models.length + 1}`,
            is_default: models.length === 0,
        };
        setFieldValue('', ID_MAPPING.card_model_registry, [...models, newModel]);
    };

    const handleUpdateModel = (index: number, key: string, value: any) => {
        const updatedModels = [...models];
        updatedModels[index] = { ...updatedModels[index], [key]: value };
        setFieldValue('', ID_MAPPING.card_model_registry as string, updatedModels);
    };

    const handleDeleteModel = (index: number) => {
        const updatedModels = models.filter((_, i) => i !== index);
        setFieldValue('', ID_MAPPING.card_model_registry as string, updatedModels);
    };

    const handleSetDefault = (index: number) => {
        const updatedModels = models.map((m, i) => ({
            ...m,
            is_default: i === index
        }));
        setFieldValue('', ID_MAPPING.card_model_registry as string, updatedModels);
    };

    // --- 2. Modular Connectors ---
    const handleToggleConnection = async (id: string, currentStatus: string) => {
        const newStatus = currentStatus === 'active' ? 'disabled' : 'active';
        const path = ID_MAPPING[id as MappingKey];
        if (path) {
            setFieldValue('', `${path}.status`, newStatus);
        }

        // Save and trigger restart if breaking
        await save();
        if (newStatus === 'disabled') {
            await fetch('/api/restart', { method: 'POST' });
        }
    };

    const handleTestConnection = async (service: string) => {
        setTestingService(service);
        try {
            const resp = await fetch(`/api/integrations/health/${service}`);
            const data = await resp.json();
            alert(`${service} health: ${data.status}`);
        } catch (e) {
            alert(`Failed to test ${service}`);
        } finally {
            setTestingService(null);
        }
    };

    if (loading) return <div className="p-8 text-gray-400">Loading Configuration...</div>;

    const tgConfig = getFieldValue('', ID_MAPPING.card_tg_01) as any || {};
    const waConfig = getFieldValue('', ID_MAPPING.card_wa_01) as any || {};
    const securityConfig = getFieldValue('', ID_MAPPING.card_security_01) as any || {};

    return (
        <div className="p-4 lg:p-8 max-w-7xl mx-auto space-y-8 animate-in fade-in duration-500">
            {/* Header */}
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 bg-gray-900/40 border border-gray-800 p-6 rounded-3xl backdrop-blur-md">
                <div>
                    <h1 className="text-3xl font-bold text-white tracking-tight flex items-center gap-3">
                        <SlidersHorizontal className="text-blue-500" /> Control Panel
                    </h1>
                    <p className="text-gray-400 mt-1">Configure your ZeroClaw personality and connectivity</p>
                </div>
                <div className="flex items-center gap-3">
                    {success && <span className="text-green-400 text-sm flex items-center gap-1"><CheckCircle2 className="h-4 w-4" /> Changes Saved</span>}
                    <button
                        onClick={() => save()}
                        disabled={saving}
                        className="flex items-center gap-2 px-6 py-3 bg-blue-600 hover:bg-blue-500 disabled:bg-gray-700 text-white rounded-xl font-semibold transition-all shadow-lg shadow-blue-900/20 active:scale-95"
                    >
                        <Save className="h-5 w-5" /> {saving ? 'Saving...' : 'Deploy Changes'}
                    </button>
                </div>
            </div>

            {error && (
                <div className="bg-red-500/10 border border-red-500/50 rounded-2xl p-4 flex items-center gap-3 text-red-400">
                    <AlertCircle className="h-5 w-5" /> {error}
                </div>
            )}

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">

                {/* Card 1: Model Registry */}
                <div className="lg:col-span-2 bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-blue-500/10 rounded-lg">
                                <Activity className="h-5 w-5 text-blue-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Model Registry</h2>
                        </div>
                        <button
                            onClick={handleAddModel}
                            className="flex items-center gap-1.5 px-3 py-1.5 bg-gray-800 hover:bg-gray-700 text-sm text-white rounded-lg transition-colors border border-gray-700"
                        >
                            <Plus className="h-4 w-4" /> Add Model
                        </button>
                    </div>

                    <div className="space-y-4">
                        {models.map((model: any, idx: number) => (
                            <div key={idx} className={`p-4 rounded-2xl border transition-all ${model.is_default ? 'bg-blue-600/5 border-blue-500/30' : 'bg-gray-800/20 border-gray-700'}`}>
                                <div className="grid grid-cols-1 md:grid-cols-4 gap-4">
                                    <div className="space-y-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Provider</label>
                                        <select
                                            value={model.provider_name}
                                            onChange={(e) => handleUpdateModel(idx, 'provider_name', e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="ollama">Ollama</option>
                                            <option value="openai">OpenAI</option>
                                            <option value="anthropic">Anthropic</option>
                                            <option value="openrouter">OpenRouter</option>
                                        </select>
                                    </div>
                                    <div className="space-y-1 md:col-span-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">Model ID</label>
                                        <input
                                            value={model.model_id}
                                            onChange={(e) => handleUpdateModel(idx, 'model_id', e.target.value)}
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                                        />
                                    </div>
                                    <div className="space-y-1 md:col-span-1">
                                        <label className="text-[10px] font-bold text-gray-500 uppercase tracking-wider">API Key</label>
                                        <input
                                            type="password"
                                            value={model.api_key}
                                            onChange={(e) => handleUpdateModel(idx, 'api_key', e.target.value)}
                                            placeholder="••••••••••••"
                                            className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2 text-sm text-white"
                                        />
                                    </div>
                                    <div className="flex items-center justify-end gap-2 pt-2 md:pt-4">
                                        <button
                                            onClick={() => handleSetDefault(idx)}
                                            className={`p-2 rounded-lg transition-colors ${model.is_default ? 'text-blue-400' : 'text-gray-500 hover:text-white'}`}
                                            title="Set as Default"
                                        >
                                            <CheckCircle2 className="h-5 w-5" />
                                        </button>
                                        <button
                                            onClick={() => handleDeleteModel(idx)}
                                            className="p-2 text-gray-500 hover:text-red-400 transition-colors"
                                        >
                                            <Trash2 className="h-5 w-5" />
                                        </button>
                                    </div>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

                {/* Card 2: Telegram Connector */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm lg:col-span-1">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-sky-500/10 rounded-lg">
                                <MessageSquare className="h-5 w-5 text-sky-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">Telegram</h2>
                        </div>
                        <button
                            onClick={() => handleToggleConnection('card_tg_01', tgConfig.status)}
                            className={`p-2 rounded-full transition-colors ${tgConfig.status === 'active' ? 'text-green-400' : 'text-gray-500 hover:text-white'}`}
                        >
                            <Power className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Bot Token</label>
                            <input
                                type="password"
                                value={tgConfig.bot_token || ''}
                                onChange={(e) => setFieldValue('', `${ID_MAPPING.card_tg_01}.bot_token`, e.target.value)}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                                placeholder="Enter Telegram Bot Token"
                            />
                        </div>
                        <div className="flex gap-3">
                            <button
                                onClick={() => handleTestConnection('telegram')}
                                disabled={testingService === 'telegram'}
                                className="flex-1 py-2 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white rounded-lg transition-colors border border-gray-700"
                            >
                                {testingService === 'telegram' ? 'Testing...' : 'Test Health'}
                            </button>
                            <button
                                onClick={() => handleToggleConnection('card_tg_01', 'active')}
                                className="flex-1 py-2 bg-red-900/20 hover:bg-red-900/40 text-xs font-semibold text-red-400 rounded-lg transition-colors border border-red-500/20"
                            >
                                Break Connection
                            </button>
                        </div>
                    </div>
                </div>

                {/* Card 3: WhatsApp Connector */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm lg:col-span-1">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-emerald-500/10 rounded-lg">
                                <Smartphone className="h-5 w-5 text-emerald-400" />
                            </div>
                            <h2 className="text-xl font-semibold text-white">WhatsApp</h2>
                        </div>
                        <button
                            onClick={() => handleToggleConnection('card_wa_01', waConfig.status)}
                            className={`p-2 rounded-full transition-colors ${waConfig.status === 'active' ? 'text-green-400' : 'text-gray-500 hover:text-white'}`}
                        >
                            <Power className="h-6 w-6" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Display Mode</label>
                            <div className="grid grid-cols-2 gap-2">
                                <button className={`py-2 text-xs rounded-lg border ${waConfig.display_mode === 'cloud' ? 'bg-blue-600 border-blue-500 text-white' : 'bg-gray-800 border-gray-700 text-gray-400'}`}>Cloud API</button>
                                <button className="py-2 text-xs bg-gray-800 border border-gray-700 rounded-lg text-gray-400 grayscale cursor-not-allowed">Web (QR)</button>
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Access Token</label>
                            <input
                                type="password"
                                value={waConfig.access_token || ''}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white opacity-50"
                                readOnly
                            />
                            <p className="text-[10px] text-gray-500 italic">Managed via Integrations page</p>
                        </div>
                        <button
                            onClick={() => handleTestConnection('whatsapp')}
                            className="w-full py-2 bg-gray-800 hover:bg-gray-700 text-xs font-semibold text-white rounded-lg transition-colors border border-gray-700"
                        >
                            Test Connection
                        </button>
                    </div>
                </div>

                {/* Card 4: Security & Autonomy */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm lg:col-span-1">
                    <div className="flex items-center gap-3 mb-6">
                        <div className="p-2 bg-purple-500/10 rounded-lg">
                            <ShieldCheck className="h-5 w-5 text-purple-400" />
                        </div>
                        <h2 className="text-xl font-semibold text-white">Security</h2>
                    </div>

                    <div className="space-y-6">
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Autonomy Level</label>
                            <div className="space-y-2">
                                {['read_only', 'supervised', 'full'].map((level) => (
                                    <button
                                        key={level}
                                        onClick={() => setFieldValue('', `${ID_MAPPING.card_security_01 as string}.level`, level)}
                                        className={`w-full flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${securityConfig.level === level ? 'bg-purple-600/10 border-purple-500 text-white' : 'bg-gray-800/10 border-gray-800 text-gray-500 hover:border-gray-700'}`}
                                    >
                                        <span className="capitalize">{level.replace('_', ' ')}</span>
                                        {securityConfig.level === level && <CheckCircle2 className="h-4 w-4" />}
                                    </button>
                                ))}
                            </div>
                        </div>
                        <div className="space-y-2">
                            <label className="text-sm font-medium text-gray-300">Max Actions / Hour</label>
                            <input
                                type="number"
                                value={securityConfig.max_actions_per_hour || 10}
                                onChange={(e) => setFieldValue('', `${ID_MAPPING.card_security_01 as string}.max_actions_per_hour`, parseInt(e.target.value))}
                                className="w-full bg-gray-800 border border-gray-700 rounded-lg px-3 py-2.5 text-sm text-white focus:outline-none focus:border-blue-500 transition-colors"
                            />
                        </div>
                    </div>
                </div>

                {/* Card 5: Model Routing */}
                <div className="bg-gray-900/50 border border-gray-800 rounded-2xl p-6 backdrop-blur-sm lg:col-span-1">
                    <div className="flex items-center justify-between mb-6">
                        <div className="flex items-center gap-3">
                            <div className="p-2 bg-pink-500/10 rounded-lg">
                                <SlidersHorizontal className="h-5 w-5 text-pink-400" />
                            </div>
                            <h2 className="text-lg font-semibold text-white">Model Routing</h2>
                        </div>
                        <button
                            onClick={() => {
                                const routes = (getFieldValue('', ID_MAPPING.card_routing_01 as string) as any[]) || [];
                                setFieldValue('', ID_MAPPING.card_routing_01 as string, [...routes, { hint: '', provider: 'ollama', model: '' }]);
                            }}
                            className="p-1.5 bg-gray-800 hover:bg-gray-700 rounded-lg text-gray-400 hover:text-white transition-colors"
                        >
                            <Plus className="h-5 w-5" />
                        </button>
                    </div>

                    <div className="space-y-4">
                        {((getFieldValue('', ID_MAPPING.card_routing_01 as string) as any[]) || []).map((route, idx) => (
                            <div key={idx} className="p-3 bg-gray-800/30 border border-gray-700/50 rounded-xl space-y-3">
                                <div className="grid grid-cols-2 gap-2">
                                    <input
                                        type="text"
                                        value={route.hint}
                                        onChange={(e) => {
                                            const routes = [...(getFieldValue('', ID_MAPPING.card_routing_01 as string) as any[])];
                                            routes[idx] = { ...routes[idx], hint: e.target.value };
                                            setFieldValue('', ID_MAPPING.card_routing_01 as string, routes);
                                        }}
                                        placeholder="Hint (e.g. code)"
                                        className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white"
                                    />
                                    <select
                                        value={route.provider}
                                        onChange={(e) => {
                                            const routes = [...(getFieldValue('', ID_MAPPING.card_routing_01 as string) as any[])];
                                            routes[idx] = { ...routes[idx], provider: e.target.value };
                                            setFieldValue('', ID_MAPPING.card_routing_01 as string, routes);
                                        }}
                                        className="bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white"
                                    >
                                        <option value="ollama">Ollama</option>
                                        <option value="openai">OpenAI</option>
                                        <option value="anthropic">Anthropic</option>
                                        <option value="openrouter">OpenRouter</option>
                                    </select>
                                </div>
                                <div className="flex items-center gap-2">
                                    <input
                                        type="text"
                                        value={route.model}
                                        onChange={(e) => {
                                            const routes = [...(getFieldValue('', ID_MAPPING.card_routing_01 as string) as any[])];
                                            routes[idx] = { ...routes[idx], model: e.target.value };
                                            setFieldValue('', ID_MAPPING.card_routing_01 as string, routes);
                                        }}
                                        placeholder="Model ID or Alias"
                                        className="flex-1 bg-gray-800 border border-gray-700 rounded-lg px-2 py-1.5 text-xs text-white"
                                    />
                                    <button
                                        onClick={() => {
                                            const routes = (getFieldValue('', ID_MAPPING.card_routing_01 as string) as any[]).filter((_, i) => i !== idx);
                                            setFieldValue('', ID_MAPPING.card_routing_01 as string, routes);
                                        }}
                                        className="text-gray-500 hover:text-red-400"
                                    >
                                        <Trash2 className="h-4 w-4" />
                                    </button>
                                </div>
                            </div>
                        ))}
                    </div>
                </div>

            </div>
        </div>
    );
}
