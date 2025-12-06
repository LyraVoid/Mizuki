import React from 'react';
import { Section, InputGroup, Input, Toggle } from '../../components/Form';
import { useLanguage } from '../../context/LanguageContext';

export default function GeneralSettings({ config, updateDeep }) {
    const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <Section title={t('settings.sections.basicInfo')}>
                <InputGroup label={t('settings.fields.siteTitle')}>
                    <Input value={config.siteConfig?.title} onChange={v => updateDeep('siteConfig.title', v)} />
                </InputGroup>
                <InputGroup label={t('settings.fields.subtitle')}>
                    <Input value={config.siteConfig?.subtitle} onChange={v => updateDeep('siteConfig.subtitle', v)} />
                </InputGroup>
                <InputGroup label={t('settings.fields.siteUrl')}>
                    <Input value={config.siteConfig?.siteURL} onChange={v => updateDeep('siteConfig.siteURL', v)} />
                </InputGroup>
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label={t('settings.fields.startDate')}>
                        <Input value={config.siteConfig?.siteStartDate} onChange={v => updateDeep('siteConfig.siteStartDate', v)} type="date" />
                    </InputGroup>
                     <InputGroup label={t('settings.fields.language')}>
                        <Input value={config.siteConfig?.lang} onChange={v => updateDeep('siteConfig.lang', v)} />
                    </InputGroup>
                </div>
                <InputGroup label={t('settings.fields.timezone')}>
                    <Input value={config.siteConfig?.timeZone} onChange={v => updateDeep('siteConfig.timeZone', v)} type="number" />
                </InputGroup>

                 <div className="border-t pt-4 mt-4">
                     <Toggle 
                        label={t('settings.fields.showLastModified')}
                        checked={config.siteConfig?.showLastModified}
                        onChange={v => updateDeep('siteConfig.showLastModified', v)}
                    />
                    <Toggle 
                        label={t('settings.fields.generateOgImages')}
                        checked={config.siteConfig?.generateOgImages}
                        onChange={v => updateDeep('siteConfig.generateOgImages', v)}
                    />
                 </div>
            </Section>

            <Section title={t('settings.sections.license')}>
                 <Toggle 
                    label={t('settings.fields.enableLicense')}
                    checked={config.licenseConfig?.enable}
                    onChange={v => updateDeep('licenseConfig.enable', v)}
                />
                <InputGroup label={t('settings.fields.licenseName')}>
                     <Input value={config.licenseConfig?.name} onChange={v => updateDeep('licenseConfig.name', v)} />
                </InputGroup>
                <InputGroup label={t('settings.fields.licenseUrl')}>
                     <Input value={config.licenseConfig?.url} onChange={v => updateDeep('licenseConfig.url', v)} />
                </InputGroup>
            </Section>

            <Section title={t('settings.sections.navbarTitle')}>
                <div className="grid grid-cols-2 gap-4">
                    <InputGroup label={t('settings.fields.text')}>
                         <Input value={config.siteConfig?.navbarTitle?.text} onChange={v => updateDeep('siteConfig.navbarTitle.text', v)} />
                    </InputGroup>
                    <InputGroup label={t('settings.fields.iconPath')}>
                         <Input value={config.siteConfig?.navbarTitle?.icon} onChange={v => updateDeep('siteConfig.navbarTitle.icon', v)} />
                    </InputGroup>
                </div>
            </Section>
        </div>
    );
}
