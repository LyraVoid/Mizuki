import React from 'react';
import { Section, InputGroup, Input, Toggle, Select } from '../../components/Form';
import { useLanguage } from '../../context/LanguageContext';

export default function IntegrationSettings({ config, updateDeep }) {
     const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <Section title={t('settings.sections.analytics')}>
                 <Toggle 
                    label={t('settings.fields.enableUmami')}
                    checked={config.umamiConfig?.enabled}
                    onChange={v => updateDeep('umamiConfig.enabled', v)}
                />
                 <InputGroup label={t('settings.fields.apiKey')}>
                    <Input value={config.umamiConfig?.apiKey} onChange={v => updateDeep('umamiConfig.apiKey', v)} />
                </InputGroup>
                 <InputGroup label={t('settings.fields.baseUrl')}>
                    <Input value={config.umamiConfig?.baseUrl} onChange={v => updateDeep('umamiConfig.baseUrl', v)} />
                </InputGroup>
                 <InputGroup label={t('settings.fields.scriptUrl')}>
                     <p className="text-xs text-gray-400 mb-1">{t('settings.fields.scriptTagTip')}</p>
                    <Input value={config.umamiConfig?.scripts} onChange={v => updateDeep('umamiConfig.scripts', v)} />
                </InputGroup>
            </Section>
        </div>
    );
}
