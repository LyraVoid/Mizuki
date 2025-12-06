import React from 'react';

export const Section = ({ title, children }) => (
    <div className="mb-6 bg-white p-6 rounded-lg shadow-sm border border-gray-100">
        <h3 className="text-lg font-semibold text-gray-800 mb-4 pb-2 border-b">{title}</h3>
        <div className="space-y-4">
            {children}
        </div>
    </div>
);

export const InputGroup = ({ label, children, description }) => (
    <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">{label}</label>
        {children}
        {description && <p className="mt-1 text-xs text-gray-500">{description}</p>}
    </div>
);

export const Input = ({ value, onChange, placeholder, type = "text", disabled = false }) => (
    <input 
        type={type}
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 bg-white transition-colors"
        value={value === undefined || value === null ? '' : value}
        onChange={e => onChange(e.target.type === 'number' ? Number(e.target.value) : e.target.value)}
        placeholder={placeholder}
        disabled={disabled}
    />
);

export const Select = ({ value, onChange, options, disabled = false }) => (
    <select
        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2 bg-white transition-colors"
        value={value}
        onChange={e => onChange(e.target.value)}
        disabled={disabled}
    >
        {options.map(opt => (
            <option key={opt.value} value={opt.value}>
                {opt.label}
            </option>
        ))}
    </select>
);

export const Toggle = ({ checked, onChange, label, description }) => (
    <div className="flex items-center justify-between py-2">
        <div>
            <span className="text-sm font-medium text-gray-700 block">{label}</span>
            {description && <span className="text-xs text-gray-500">{description}</span>}
        </div>
        <button 
            onClick={() => onChange(!checked)}
            className={`relative inline-flex h-6 w-11 items-center rounded-full transition-colors focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 ${
                checked ? 'bg-blue-600' : 'bg-gray-200'
            }`}
        >
            <span
                className={`inline-block h-4 w-4 transform rounded-full bg-white transition-transform ${
                    checked ? 'translate-x-6' : 'translate-x-1'
                }`}
            />
        </button>
    </div>
);

export const ArrayInput = ({ values, onChange, placeholder }) => {
    const addFn = () => onChange([...(values || []), '']);
    const updateFn = (idx, val) => {
        const newVals = [...(values || [])];
        newVals[idx] = val;
        onChange(newVals);
    };
    const removeFn = (idx) => {
        onChange(values.filter((_, i) => i !== idx));
    };

    return (
        <div className="space-y-2">
            {(values || []).map((val, idx) => (
                <div key={idx} className="flex gap-2">
                    <input 
                        className="block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500 sm:text-sm border p-2"
                        value={val}
                        onChange={e => updateFn(idx, e.target.value)}
                        placeholder={placeholder}
                    />
                    <button 
                        onClick={() => removeFn(idx)}
                        className="text-red-500 hover:text-red-700 font-bold px-2"
                    >
                        &times;
                    </button>
                </div>
            ))}
            <button onClick={addFn} className="text-sm text-blue-600 hover:text-blue-800 font-medium">+ Add Item</button>
        </div>
    );
};

// Advanced Object List Editor
// Used for Navbar, Social Links, etc.
export const ObjectListEditor = ({ values, onChange, renderItem, createNewItem, label }) => {
    const list = values || [];

    const addFn = () => {
        onChange([...list, createNewItem()]);
    };

    const updateFn = (idx, newUserVal) => {
        const newList = [...list];
        newList[idx] = newUserVal;
        onChange(newList);
    };

    const removeFn = (idx) => {
        onChange(list.filter((_, i) => i !== idx));
    };

    const moveFn = (idx, direction) => {
        if (direction === 'up' && idx === 0) return;
        if (direction === 'down' && idx === list.length - 1) return;
        const newList = [...list];
        const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
        [newList[idx], newList[swapIdx]] = [newList[swapIdx], newList[idx]];
        onChange(newList);
    };

    return (
        <div className="space-y-3 border-l-2 border-gray-100 pl-4">
            {label && <label className="block text-sm font-medium text-gray-700">{label}</label>}
            
            {list.map((item, idx) => (
                <div key={idx} className="bg-gray-50 rounded-lg border border-gray-200 p-3 relative group">
                     {/* Actions Toolbar */}
                    <div className="absolute right-2 top-2 flex gap-1 opacity-50 group-hover:opacity-100 transition-opacity">
                        <button onClick={() => moveFn(idx, 'up')} className="p-1 hover:bg-gray-200 rounded" title="Move Up">↑</button>
                        <button onClick={() => moveFn(idx, 'down')} className="p-1 hover:bg-gray-200 rounded" title="Move Down">↓</button>
                        <button onClick={() => removeFn(idx)} className="p-1 hover:bg-red-100 text-red-500 rounded" title="Delete">×</button>
                    </div>
                    
                    {/* Item Content */}
                    <div className="pr-16">
                         {renderItem(item, (val) => updateFn(idx, val), idx)}
                    </div>
                </div>
            ))}

            <button 
                onClick={addFn} 
                className="w-full py-2 border-2 border-dashed border-gray-200 rounded-lg text-gray-500 hover:border-blue-300 hover:text-blue-500 transition-colors text-sm font-medium"
            >
                + Add Item
            </button>
        </div>
    );
};
