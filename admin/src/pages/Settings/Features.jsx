import React from 'react';
import { Section, InputGroup, Input, Toggle, Select, ArrayInput } from '../../components/Form';
import { useLanguage } from '../../context/LanguageContext';

export default function FeatureSettings({ config, updateDeep }) {
     const { t } = useLanguage();

    return (
        <div className="space-y-6">
            <Section title={t('settings.sections.featurePages')}>

                <div className="space-y-4">
                    {Object.keys(config.siteConfig?.featurePages || {}).map(key => (
                        <div key={key} className={`p-3 rounded-lg border ${config.siteConfig.featurePages[key] ? 'border-blue-200 bg-blue-50' : 'border-gray-200 bg-white'}`}>
                            <Toggle 
                                label={key.charAt(0).toUpperCase() + key.slice(1)}
                                checked={config.siteConfig.featurePages[key]}
                                onChange={v => updateDeep(`siteConfig.featurePages.${key}`, v)}
                            />
                            
                            {/* Anime Page Specific Settings */}
                            {key === 'anime' && config.siteConfig.featurePages.anime && (
                                <div className="mt-3 pl-4 border-l-2 border-blue-200 space-y-3 animation-fade-in">
                                     <InputGroup label={t('settings.fields.mode')}>
                                        <Select 
                                            value={config.siteConfig?.anime?.mode || 'bangumi'}
                                            onChange={v => updateDeep('siteConfig.anime.mode', v)}
                                            options={[
                                                { label: 'Bangumi API', value: 'bangumi' },
                                                { label: 'Local Data', value: 'local' }
                                            ]}
                                        />
                                    </InputGroup>
                                    {config.siteConfig?.anime?.mode !== 'local' && (
                                        <InputGroup label={t('settings.fields.userId')}>
                                            <Input 
                                                value={config.siteConfig?.bangumi?.userId} 
                                                onChange={v => updateDeep('siteConfig.bangumi.userId', v)} 
                                                placeholder="Bangumi User ID"
                                            />
                                        </InputGroup>
                                    )}
                                </div>
                            )}
                        </div>
                    ))}
                </div>
            </Section>

            <Section title={t('settings.sections.musicPlayer')}>
                <Toggle 
                    label={t('settings.fields.enable')}
                    checked={config.musicPlayerConfig?.enable}
                    onChange={v => updateDeep('musicPlayerConfig.enable', v)}
                />
                {config.musicPlayerConfig?.enable && (
                    <div className="space-y-4 mt-4">
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label={t('settings.fields.metingId')}>
                                <Input value={config.musicPlayerConfig?.id} onChange={v => updateDeep('musicPlayerConfig.id', v)} />
                            </InputGroup>
                             <InputGroup label={t('settings.fields.server')}>
                                <Select 
                                    value={config.musicPlayerConfig?.server}
                                    onChange={v => updateDeep('musicPlayerConfig.server', v)}
                                    options={[
                                        { label: 'Netease', value: 'netease' },
                                        { label: 'Tencent', value: 'tencent' },
                                        { label: 'Kugou', value: 'kugou' },
                                        { label: 'Xiami', value: 'xiami' },
                                        { label: 'Bilibili', value: 'bilibili' }
                                    ]}
                                />
                            </InputGroup>
                        </div>
                        <div className="grid grid-cols-2 gap-4">
                             <InputGroup label={t('settings.fields.type')}>
                                <Select 
                                    value={config.musicPlayerConfig?.type}
                                    onChange={v => updateDeep('musicPlayerConfig.type', v)}
                                    options={[
                                        { label: 'Playlist', value: 'playlist' },
                                        { label: 'Song', value: 'song' },
                                        { label: 'Album', value: 'album' },
                                        { label: 'Artist', value: 'artist' }
                                    ]}
                                />
                            </InputGroup>
                            <InputGroup label={t('settings.fields.mode')}>
                                <Select 
                                    value={config.musicPlayerConfig?.mode}
                                    onChange={v => updateDeep('musicPlayerConfig.mode', v)}
                                    options={[
                                        { label: 'Meting', value: 'meting' },
                                        { label: 'Local', value: 'local' }
                                    ]}
                                />
                            </InputGroup>
                        </div>
                         <InputGroup label={t('settings.fields.metingApi')}>
                            <Input value={config.musicPlayerConfig?.meting_api} onChange={v => updateDeep('musicPlayerConfig.meting_api', v)} />
                        </InputGroup>
                    </div>
                )}
            </Section>

            <Section title={t('settings.sections.mascot')}>
                 <Toggle 
                    label={t('settings.fields.enable')}
                    checked={config.pioConfig?.enable}
                    onChange={v => updateDeep('pioConfig.enable', v)}
                />
                {config.pioConfig?.enable && (
                    <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg animation-fade-in">
                         <InputGroup label={t('settings.fields.models')}>
                            <ArrayInput 
                                values={config.pioConfig?.models}
                                onChange={v => updateDeep('pioConfig.models', v)}
                            />
                        </InputGroup>
                        <div className="grid grid-cols-2 gap-4">
                            <InputGroup label={t('settings.fields.position')}>
                                <Select 
                                    value={config.pioConfig?.position || 'left'}
                                    onChange={v => updateDeep('pioConfig.position', v)}
                                    options={[
                                        { label: 'Left', value: 'left' },
                                        { label: 'Right', value: 'right' }
                                    ]}
                                />
                            </InputGroup>
                            <InputGroup label={t('settings.fields.mode')}>
                                <Select 
                                    value={config.pioConfig?.mode || 'draggable'}
                                    onChange={v => updateDeep('pioConfig.mode', v)}
                                    options={[
                                        { label: 'Static', value: 'static' },
                                        { label: 'Fixed', value: 'fixed' },
                                        { label: 'Draggable', value: 'draggable' }
                                    ]}
                                />
                            </InputGroup>
                        </div>
                         <div className="grid grid-cols-2 gap-4">
                             <InputGroup label={t('settings.fields.width')}>
                                <Input type="number" value={config.pioConfig?.width} onChange={v => updateDeep('pioConfig.width', Number(v))} />
                            </InputGroup>
                            <InputGroup label={t('settings.fields.height')}>
                                <Input type="number" value={config.pioConfig?.height} onChange={v => updateDeep('pioConfig.height', Number(v))} />
                            </InputGroup>
                         </div>
                    </div>
                )}
            </Section>

            <Section title={t('settings.sections.comments')}>
                 <Toggle 
                    label={t('settings.fields.enable')}
                    checked={config.commentConfig?.enable}
                    onChange={v => updateDeep('commentConfig.enable', v)}
                />
                {config.commentConfig?.enable && (
                    <div className="mt-4 space-y-4 bg-gray-50 p-4 rounded-lg animation-fade-in">
                        <h4 className="font-medium text-gray-700">Twikoo Settings</h4>
                        <InputGroup label={t('settings.fields.envId')}>
                            <Input value={config.commentConfig?.twikoo?.envId} onChange={v => updateDeep('commentConfig.twikoo.envId', v)} />
                        </InputGroup>
                         <InputGroup label={t('settings.fields.language')}>
                            <Input value={config.commentConfig?.twikoo?.lang} onChange={v => updateDeep('commentConfig.twikoo.lang', v)} placeholder="en" />
                        </InputGroup>
                    </div>
                )}
            </Section>

            <Section title={t('settings.sections.sakura')}>
                 <Toggle 
                    label={t('settings.fields.enable')}
                    checked={config.sakuraConfig?.enable}
                    onChange={v => updateDeep('sakuraConfig.enable', v)}
                />
                
                {config.sakuraConfig?.enable && (
                    <div className="mt-4 grid grid-cols-2 gap-x-6 gap-y-4 bg-gray-50 p-4 rounded-lg">
                        <InputGroup label={t('settings.fields.sakuraNum')}>
                             <Input type="number" value={config.sakuraConfig?.sakuraNum} onChange={v => updateDeep('sakuraConfig.sakuraNum', v)} />
                        </InputGroup>
                        <InputGroup label={t('settings.fields.zIndex')}>
                             <Input type="number" value={config.sakuraConfig?.zIndex} onChange={v => updateDeep('sakuraConfig.zIndex', v)} />
                        </InputGroup>

                        <div className="col-span-2 border-t border-gray-200 my-2"></div>
                        
                        <div className="col-span-1">
                             <h5 className="text-xs font-bold text-gray-500 mb-2 uppercase">Size</h5>
                             <div className="grid grid-cols-2 gap-2">
                                <Input placeholder="Min" type="number" value={config.sakuraConfig?.size?.min} onChange={v => updateDeep('sakuraConfig.size.min', v)} />
                                <Input placeholder="Max" type="number" value={config.sakuraConfig?.size?.max} onChange={v => updateDeep('sakuraConfig.size.max', v)} />
                             </div>
                        </div>
                        <div className="col-span-1">
                             <h5 className="text-xs font-bold text-gray-500 mb-2 uppercase">Opacity</h5>
                             <div className="grid grid-cols-2 gap-2">
                                <Input placeholder="Min" type="number" value={config.sakuraConfig?.opacity?.min} onChange={v => updateDeep('sakuraConfig.opacity.min', v)} />
                                <Input placeholder="Max" type="number" value={config.sakuraConfig?.opacity?.max} onChange={v => updateDeep('sakuraConfig.opacity.max', v)} />
                             </div>
                        </div>

                         <div className="col-span-2 border-t border-gray-200 my-2"></div>

                         <div className="col-span-1">
                             <h5 className="text-xs font-bold text-gray-500 mb-2 uppercase">Speed (Vertical)</h5>
                             <div className="grid grid-cols-2 gap-2">
                                <Input placeholder="Min" type="number" value={config.sakuraConfig?.speed?.vertical?.min} onChange={v => updateDeep('sakuraConfig.speed.vertical.min', v)} />
                                <Input placeholder="Max" type="number" value={config.sakuraConfig?.speed?.vertical?.max} onChange={v => updateDeep('sakuraConfig.speed.vertical.max', v)} />
                             </div>
                        </div>
                        <div className="col-span-1">
                             <h5 className="text-xs font-bold text-gray-500 mb-2 uppercase">Speed (Horizontal)</h5>
                             <div className="grid grid-cols-2 gap-2">
                                <Input placeholder="Min" type="number" value={config.sakuraConfig?.speed?.horizontal?.min} onChange={v => updateDeep('sakuraConfig.speed.horizontal.min', v)} />
                                <Input placeholder="Max" type="number" value={config.sakuraConfig?.speed?.horizontal?.max} onChange={v => updateDeep('sakuraConfig.speed.horizontal.max', v)} />
                             </div>
                        </div>
                    </div>
                )}
            </Section>
            <Section title={t('settings.sections.analytics')}>
                 <Toggle 
                    label={t('settings.fields.enable')}
                    checked={config.umamiConfig?.enabled}
                    onChange={v => updateDeep('umamiConfig.enabled', v)}
                />
                 {config.umamiConfig?.enabled && (
                    <div className="mt-4 space-y-3 bg-gray-50 p-4 rounded-lg">
                        <InputGroup label={t('settings.fields.websiteId')}>
                             <Input 
                                placeholder="e.g. 12345678-abcd-1234-abcd-1234567890ab"
                                value={config.umamiConfig?.websiteId || config.umamiConfig?.apiKey} // Supporting legacy or various naming
                                onChange={v => updateDeep('umamiConfig.websiteId', v)} 
                            />
                        </InputGroup>
                        <InputGroup label={t('settings.fields.scriptUrl')}>
                             <Input 
                                placeholder="https://analytics.umami.is/script.js"
                                value={config.umamiConfig?.scriptUrl || config.umamiConfig?.baseUrl} 
                                onChange={v => updateDeep('umamiConfig.scriptUrl', v)} 
                            />
                        </InputGroup>
                    </div>
                )}
            </Section>
        </div>
    );
}
