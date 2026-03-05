import { Plus } from 'lucide-react';
import { useConfigForm } from '@/components/config/useConfigForm';
import { useLocale } from '@/lib/i18n';
import FieldGroup from './shared/FieldGroup';
import ModelCard from './shared/ModelCard';
import SettingSlider from './shared/SettingSlider';

const ID_MAPPING = {
    model_registry: 'model_registry',
    default_temperature: 'default_temperature',
    model_routes: 'model_routes',
};

export default function AIModelsTab() {
    const { t } = useLocale();
    const { getFieldValue, setFieldValue } = useConfigForm();

    // Get model registry
    const modelRegistry = (getFieldValue('', ID_MAPPING.model_registry) as any[]) || [];
    const temperature = (getFieldValue('', ID_MAPPING.default_temperature) as number) || 0.7;
    const routes = (getFieldValue('', ID_MAPPING.model_routes) as any[]) || [];

    const handleAddModel = () => {
        const newModel = {
            provider_name: 'ollama',
            model_id: 'llama3.2',
            api_key: '',
            alias: `model-${modelRegistry.length + 1}`,
            is_default: modelRegistry.length === 0,
        };
        setFieldValue('', ID_MAPPING.model_registry, [...modelRegistry, newModel]);
    };

    const handleUpdateModel = (index: number, key: string, value: any) => {
        const updated = [...modelRegistry];
        updated[index] = { ...updated[index], [key]: value };
        setFieldValue('', ID_MAPPING.model_registry, updated);
    };

    const handleDeleteModel = (index: number) => {
        const updated = modelRegistry.filter((_: any, i: number) => i !== index);
        setFieldValue('', ID_MAPPING.model_registry, updated);
    };

    const handleSetDefault = (index: number) => {
        const updated = modelRegistry.map((m: any, i: number) => ({
            ...m,
            is_default: i === index,
        }));
        setFieldValue('', ID_MAPPING.model_registry, updated);
    };

    const handleAddRoute = () => {
        const newRoute = {
            hint: '',
            provider: 'ollama',
            model: '',
            max_tokens: 4096,
        };
        setFieldValue('', ID_MAPPING.model_routes, [...routes, newRoute]);
    };

    const handleUpdateRoute = (index: number, key: string, value: any) => {
        const updated = [...routes];
        updated[index] = { ...updated[index], [key]: value };
        setFieldValue('', ID_MAPPING.model_routes, updated);
    };

    const handleDeleteRoute = (index: number) => {
        const updated = routes.filter((_: any, i: number) => i !== index);
        setFieldValue('', ID_MAPPING.model_routes, updated);
    };

    return (
        <div className="space-y-8">
            {/* Temperature Setting */}
            <FieldGroup title={t('controlPanel.aiModels.temperature')} collapsible={false}>
                <SettingSlider
                    label={t('controlPanel.aiModels.temperature_label')}
                    min={0}
                    max={2}
                    step={0.1}
                    value={temperature}
                    onChange={(value) => setFieldValue('', ID_MAPPING.default_temperature, value)}
                    description={t('controlPanel.aiModels.temperature_desc')}
                />
            </FieldGroup>

            {/* Model Registry */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            {t('controlPanel.aiModels.registry')}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {t('controlPanel.aiModels.registry_desc')}
                        </p>
                    </div>
                    <button
                        onClick={handleAddModel}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        {t('common.add')}
                    </button>
                </div>

                {modelRegistry.length === 0 ? (
                    <div className="bg-gray-800/20 border border-gray-700 rounded-xl p-8 text-center">
                        <p className="text-gray-400">{t('controlPanel.aiModels.no_models')}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {modelRegistry.map((model: any, idx: number) => (
                            <ModelCard
                                key={idx}
                                index={idx}
                                model={model}
                                onUpdate={handleUpdateModel}
                                onDelete={handleDeleteModel}
                                onSetDefault={handleSetDefault}
                                isDefault={model.is_default === true}
                            />
                        ))}
                    </div>
                )}
            </div>

            {/* Model Routing */}
            <div className="space-y-4">
                <div className="flex items-center justify-between">
                    <div>
                        <h2 className="text-xl font-semibold text-white">
                            {t('controlPanel.aiModels.routing')}
                        </h2>
                        <p className="text-gray-400 text-sm mt-1">
                            {t('controlPanel.aiModels.routing_desc')}
                        </p>
                    </div>
                    <button
                        onClick={handleAddRoute}
                        className="flex items-center gap-2 px-4 py-2 bg-blue-600 hover:bg-blue-500 text-white rounded-lg font-medium transition-colors"
                    >
                        <Plus className="h-5 w-5" />
                        {t('common.add')}
                    </button>
                </div>

                {routes.length === 0 ? (
                    <div className="bg-gray-800/20 border border-gray-700 rounded-xl p-8 text-center">
                        <p className="text-gray-400">{t('controlPanel.aiModels.no_routes')}</p>
                    </div>
                ) : (
                    <div className="space-y-3">
                        {routes.map((route: any, idx: number) => (
                            <div key={idx} className="p-4 bg-gray-800/20 border border-gray-700 rounded-lg space-y-3">
                                <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">
                                            {t('controlPanel.aiModels.route_hint')}
                                        </label>
                                        <input
                                            type="text"
                                            value={route.hint || ''}
                                            onChange={(e) => handleUpdateRoute(idx, 'hint', e.target.value)}
                                            placeholder={t('controlPanel.aiModels.route_hint_placeholder')}
                                            className="w-full mt-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">
                                            {t('common.provider')}
                                        </label>
                                        <select
                                            value={route.provider || 'ollama'}
                                            onChange={(e) => handleUpdateRoute(idx, 'provider', e.target.value)}
                                            className="w-full mt-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        >
                                            <option value="ollama">Ollama</option>
                                            <option value="openai">OpenAI</option>
                                            <option value="anthropic">Anthropic</option>
                                            <option value="openrouter">OpenRouter</option>
                                        </select>
                                    </div>
                                    <div>
                                        <label className="text-xs font-bold text-gray-500 uppercase">
                                            {t('common.model')}
                                        </label>
                                        <input
                                            type="text"
                                            value={route.model || ''}
                                            onChange={(e) => handleUpdateRoute(idx, 'model', e.target.value)}
                                            placeholder={t('controlPanel.aiModels.model_placeholder')}
                                            className="w-full mt-1 bg-gray-800 border border-gray-700 rounded px-3 py-2 text-sm text-white focus:outline-none focus:border-blue-500"
                                        />
                                    </div>
                                </div>
                                <button
                                    onClick={() => handleDeleteRoute(idx)}
                                    className="text-xs px-3 py-1.5 bg-red-900/20 hover:bg-red-900/40 text-red-400 rounded transition-colors"
                                >
                                    {t('common.delete')}
                                </button>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
