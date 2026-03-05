interface SettingSliderProps {
    label: string;
    min: number;
    max: number;
    step?: number;
    value: number;
    onChange: (value: number) => void;
    description?: string;
    unit?: string;
}

export default function SettingSlider({
    label,
    min,
    max,
    step = 1,
    value,
    onChange,
    description,
    unit = '',
}: SettingSliderProps) {
    return (
        <div className="space-y-2">
            <div className="flex items-center justify-between">
                <label className="text-sm font-medium text-gray-300">{label}</label>
                <span className="text-sm font-semibold text-blue-400">
                    {value}
                    {unit && ` ${unit}`}
                </span>
            </div>
            <input
                type="range"
                min={min}
                max={max}
                step={step}
                value={value}
                onChange={(e) => onChange(Number(e.target.value))}
                className="w-full h-2 bg-gray-700 rounded-lg appearance-none cursor-pointer accent-blue-600"
            />
            {description && <p className="text-xs text-gray-400">{description}</p>}
        </div>
    );
}
