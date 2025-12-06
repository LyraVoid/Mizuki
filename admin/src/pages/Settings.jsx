import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import GeneralSettings from './Settings/General';
import AppearanceSettings from './Settings/Appearance';
import LayoutSettings from './Settings/Layout';
import ComponentSettings from './Settings/Components';
import FeatureSettings from './Settings/Features';
import IntegrationSettings from './Settings/Integrations';

// Tab Button Helper
const TabButton = ({ active, onClick, children }) => (
    <button 
        onClick={onClick}
        className={`px-4 py-2 font-medium text-sm rounded-t-lg transition-colors whitespace-nowrap ${
            active 
            ? 'bg-white text-blue-600 border-t border-l border-r border-gray-200' 
            : 'bg-gray-100 text-gray-600 hover:bg-gray-200'
        }`}
    >
        {children}
    </button>
);

export default function Settings() {
    const { t } = useLanguage();
    const [config, setConfig] = useState(null);
    const [loading, setLoading] = useState(true);
    const [activeTab, setActiveTab] = useState('general');

    useEffect(() => {
        fetch('/api/config')
            .then(res => res.json())
            .then(data => {
                setConfig(data);
                setLoading(false);
            });
    }, []);

    const saveConfig = (newConfig) => {
        setConfig(newConfig);
        fetch('/api/config', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(newConfig, null, 2)
        })
        .then(() => {
            console.log('Saved');
        });
    };

    const updateDeep = (path, value) => {
        const newConfig = JSON.parse(JSON.stringify(config));
        const parts = path.split('.');
        let current = newConfig;
        for (let i = 0; i < parts.length - 1; i++) {
            if (!current[parts[i]]) current[parts[i]] = {};
            current = current[parts[i]];
        }
        current[parts[parts.length - 1]] = value;
        saveConfig(newConfig);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">{t('common.loading')}</div>;

    const renderJson = () => (
        <div className="h-full flex flex-col">
            <div className="mb-2 text-sm text-gray-500 bg-yellow-50 p-3 rounded border border-yellow-200">
                {t('settings.jsonTip')}
            </div>
            <textarea
                className="flex-1 w-full font-mono text-sm p-4 border rounded bg-gray-50 focus:bg-white transition-colors resize-none min-h-[600px]"
                value={JSON.stringify(config, null, 2)}
                onChange={e => {
                    try {
                        const newConfig = JSON.parse(e.target.value);
                        setConfig(newConfig);
                    } catch (err) {
                        // ignore parse errors while typing
                    }
                }}
                onBlur={e => {
                     try {
                        const newConfig = JSON.parse(e.target.value);
                        saveConfig(newConfig);
                    } catch (err) {
                        alert("Invalid JSON");
                    }
                }}
            />
        </div>
    );

    return (
        <div className="flex flex-col h-full bg-white rounded-lg shadow-sm border overflow-hidden">
            <div className="border-b bg-gray-50 px-6 pt-6">
                <h2 className="text-2xl font-bold mb-6 text-gray-800">{t('settings.title')}</h2>
                <div className="flex overflow-x-auto gap-2 scrollbar-hide">
                    <TabButton active={activeTab === 'general'} onClick={() => setActiveTab('general')}>{t('settings.tabs.general')}</TabButton>
                    <TabButton active={activeTab === 'appearance'} onClick={() => setActiveTab('appearance')}>{t('settings.tabs.appearance')}</TabButton>
                    <TabButton active={activeTab === 'layout'} onClick={() => setActiveTab('layout')}>{t('settings.tabs.layout')}</TabButton>
                    <TabButton active={activeTab === 'components'} onClick={() => setActiveTab('components')}>{t('settings.tabs.components')}</TabButton>
                    <TabButton active={activeTab === 'features'} onClick={() => setActiveTab('features')}>{t('settings.tabs.features')}</TabButton>
                    <TabButton active={activeTab === 'json'} onClick={() => setActiveTab('json')}>{t('settings.tabs.advanced')}</TabButton>
                </div>
            </div>

            <div className="flex-1 overflow-y-auto p-6 bg-gray-50/50">
                <div className="max-w-4xl mx-auto">
                    {activeTab === 'general' && <GeneralSettings config={config} updateDeep={updateDeep} />}
                    {activeTab === 'appearance' && <AppearanceSettings config={config} updateDeep={updateDeep} />}
                    {activeTab === 'layout' && <LayoutSettings config={config} updateDeep={updateDeep} />}
                    {activeTab === 'components' && <ComponentSettings config={config} updateDeep={updateDeep} />}
                    {activeTab === 'features' && <FeatureSettings config={config} updateDeep={updateDeep} />}
                    {activeTab === 'json' && renderJson()}
                </div>
            </div>
        </div>
    );
}
