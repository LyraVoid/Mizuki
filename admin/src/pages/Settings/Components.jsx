import React from 'react';
import { Section, InputGroup, Input, Toggle, ObjectListEditor } from '../../components/Form';
import { useLanguage } from '../../context/LanguageContext';

export default function ComponentSettings({ config, updateDeep }) {
     const { t } = useLanguage();

    const renderSocialLink = (item, updateItem) => (
        <div className="grid grid-cols-3 gap-2">
            <Input 
                placeholder="Name (e.g. GitHub)" 
                value={item.name} 
                onChange={v => updateItem({ ...item, name: v })} 
            />
            <Input 
                placeholder="Icon (fa6-brands:github)" 
                value={item.icon} 
                onChange={v => updateItem({ ...item, icon: v })} 
            />
             <Input 
                placeholder="URL" 
                value={item.url} 
                onChange={v => updateItem({ ...item, url: v })} 
            />
        </div>
    );

    return (
        <div className="space-y-6">
            <Section title={t('settings.sections.profileCard')}>
                <InputGroup label={t('settings.fields.displayName')}>
                    <Input value={config.profileConfig?.name} onChange={v => updateDeep('profileConfig.name', v)} />
                </InputGroup>
                 <InputGroup label={t('settings.fields.bio')}>
                    <Input value={config.profileConfig?.bio} onChange={v => updateDeep('profileConfig.bio', v)} />
                </InputGroup>
                 <InputGroup label={t('settings.fields.avatarPath')}>
                    <Input value={config.profileConfig?.avatar} onChange={v => updateDeep('profileConfig.avatar', v)} />
                </InputGroup>

                <div className="bg-gray-50 p-4 rounded-lg mt-4">
                     <h4 className="text-sm font-semibold mb-3">{t('settings.fields.typewriter')}</h4>
                     <Toggle 
                        label={t('settings.fields.enable')}
                        checked={config.profileConfig?.typewriter?.enable}
                        onChange={v => updateDeep('profileConfig.typewriter.enable', v)}
                    />
                     {config.profileConfig?.typewriter?.enable && (
                        <InputGroup label={t('settings.fields.speed')} className="mt-2">
                            <Input type="number" value={config.profileConfig?.typewriter?.speed} onChange={v => updateDeep('profileConfig.typewriter.speed', Number(v))} />
                        </InputGroup>
                    )}
                </div>
                
                 <div className="mt-4">
                     <label className="block text-sm font-medium text-gray-700 mb-2">Social Links</label>
                    <ObjectListEditor 
                        values={config.profileConfig?.links}
                        onChange={v => updateDeep('profileConfig.links', v)}
                        createNewItem={() => ({ name: 'New Social', url: 'https://', icon: '' })}
                        renderItem={renderSocialLink}
                    />
                 </div>
            </Section>

            <Section title={t('settings.sections.announcement')}> 
                <InputGroup label={t('settings.fields.siteTitle')}>
                    <Input value={config.announcementConfig?.title} onChange={v => updateDeep('announcementConfig.title', v)} />
                </InputGroup>
                <InputGroup label={t('settings.fields.text')}>
                    <Input value={config.announcementConfig?.content} onChange={v => updateDeep('announcementConfig.content', v)} />
                </InputGroup>
                 <Toggle 
                    label={t('settings.fields.closable')}
                    checked={config.announcementConfig?.closable}
                    onChange={v => updateDeep('announcementConfig.closable', v)}
                />

                 <div className="mt-4 bg-gray-50 p-4 rounded-lg">
                    <h4 className="text-sm font-semibold mb-3">{t('settings.fields.linkTarget')}</h4>
                     <Toggle 
                        label={t('settings.fields.enable')}
                        checked={config.announcementConfig?.link?.enable}
                        onChange={v => updateDeep('announcementConfig.link.enable', v)}
                    />
                    {config.announcementConfig?.link?.enable && (
                        <div className="grid grid-cols-2 gap-4 mt-2">
                             <InputGroup label={t('settings.fields.text')}>
                                <Input value={config.announcementConfig?.link?.text} onChange={v => updateDeep('announcementConfig.link.text', v)} />
                            </InputGroup>
                             <InputGroup label={t('settings.fields.url')}>
                                <Input value={config.announcementConfig?.link?.url} onChange={v => updateDeep('announcementConfig.link.url', v)} />
                            </InputGroup>
                        </div>
                    )}
                 </div>
            </Section>
        </div>
    );
}
