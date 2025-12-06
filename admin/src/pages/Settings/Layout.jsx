import React from 'react';
import { Section, InputGroup, Input, Toggle, ObjectListEditor, Select } from '../../components/Form';
import { useLanguage } from '../../context/LanguageContext';

export default function LayoutSettings({ config, updateDeep }) {
    const { t } = useLanguage();

    // Recursive Navbar Editor
    const renderNavbarItem = (item, updateItem, depth = 0) => (
        <div className="space-y-3">
             <div className="grid grid-cols-2 gap-3">
                <Input 
                    placeholder="Name" 
                    value={item.name} 
                    onChange={v => updateItem({ ...item, name: v })} 
                />
                 <Input 
                    placeholder="URL (/about/)" 
                    value={item.url} 
                    onChange={v => updateItem({ ...item, url: v })} 
                />
            </div>
            <div className="grid grid-cols-2 gap-3">
                 <Input 
                    placeholder="Icon (material-symbols:home)" 
                    value={item.icon} 
                    onChange={v => updateItem({ ...item, icon: v })} 
                />
                <div className="flex items-center">
                    <input 
                        type="checkbox" 
                        checked={item.external || false} 
                        onChange={e => updateItem({...item, external: e.target.checked})}
                        className="mr-2"
                    />
                    <span className="text-sm text-gray-600">External</span>
                </div>
            </div>

            {/* Submenus (Only Main Level Usually) */}
            {depth === 0 && (
                <div className="mt-2 pl-2 border-l-2 border-blue-50">
                    <ObjectListEditor
                        label="Sub Menu"
                        values={item.children}
                        onChange={v => updateItem({ ...item, children: v })}
                        createNewItem={() => ({ name: 'New Item', url: '/', icon: '' })}
                        renderItem={(subItem, updateSub) => renderNavbarItem(subItem, updateSub, depth + 1)}
                    />
                </div>
            )}
        </div>
    );

    return (
        <div className="space-y-6">
            <Section title={t('settings.sections.navigationBar')}>
                <div className="grid grid-cols-2 gap-4 mb-4 p-4 bg-gray-50 rounded-lg">
                    <InputGroup label={t('settings.fields.navbarTitleText')}>
                        <Input 
                            value={config.siteConfig?.navbarTitle?.text}
                            onChange={v => updateDeep('siteConfig.navbarTitle.text', v)}
                        />
                    </InputGroup>
                    <InputGroup label={t('settings.fields.navbarTitleIcon')}>
                        <Input 
                            placeholder="assets/home/home.png"
                            value={config.siteConfig?.navbarTitle?.icon}
                            onChange={v => updateDeep('siteConfig.navbarTitle.icon', v)}
                        />
                    </InputGroup>
                </div>
                <ObjectListEditor 
                    values={config.navBarConfig?.links}
                    onChange={v => updateDeep('navBarConfig.links', v)}
                    createNewItem={() => ({ name: 'New Link', url: '/', icon: '', children: [] })}
                    renderItem={(item, update) => renderNavbarItem(item, update)}
                />
            </Section>

            <Section title={t('settings.sections.sidebarLayout')}>
                 <InputGroup label={t('settings.fields.sidebarPosition')}>
                    <Select 
                        value={config.sidebarLayoutConfig?.position || 'unilateral'}
                        onChange={v => updateDeep('sidebarLayoutConfig.position', v)}
                        options={[
                            { label: 'Unilateral', value: 'unilateral' },
                            { label: 'Both', value: 'both' }
                        ]}
                    />
                </InputGroup>
                
                <div className="mt-4">
                    <p className="text-sm text-gray-500 mb-2">{t('settings.fields.components')}</p>
                    {config.sidebarLayoutConfig?.components?.map((item, index) => (
                        <div key={index} className="flex items-center justify-between p-3 border rounded mb-2 bg-gray-50">
                            <div className="flex flex-col">
                                <span className="font-medium capitalize text-gray-800">{item.type}</span>
                                {config.sidebarLayoutConfig?.position === 'both' && (
                                     <div className="flex items-center mt-1 text-xs text-gray-500">
                                        <span className="mr-2">Side:</span>
                                        <select 
                                            value={item.sidebar || 'left'}
                                            onChange={e => updateDeep(`sidebarLayoutConfig.components.${index}.sidebar`, e.target.value)}
                                            className="bg-transparent border-b border-gray-300 focus:outline-none"
                                        >
                                            <option value="left">Left</option>
                                            <option value="right">Right</option>
                                        </select>
                                    </div>
                                )}
                            </div>
                            <Toggle 
                                label={t('settings.fields.enable')}
                                checked={item.enable}
                                onChange={v => updateDeep(`sidebarLayoutConfig.components.${index}.enable`, v)}
                            />
                        </div>
                    ))}
                </div>
            </Section>

             <Section title={t('settings.sections.toc')}>
                 <Toggle 
                    label={t('settings.fields.enable')}
                    checked={config.siteConfig?.toc?.enable}
                    onChange={v => updateDeep('siteConfig.toc.enable', v)}
                />
                {config.siteConfig?.toc?.enable && (
                    <div className="mt-4 grid grid-cols-2 gap-4 bg-gray-50 p-4 rounded-lg">
                        <InputGroup label={t('settings.fields.mode')}>
                            <Select 
                                value={config.siteConfig?.toc?.mode || 'sidebar'}
                                onChange={v => updateDeep('siteConfig.toc.mode', v)}
                                options={[
                                    { label: 'Sidebar', value: 'sidebar' },
                                    { label: 'Float Button', value: 'float' }
                                ]}
                            />
                        </InputGroup>
                        <InputGroup label={t('settings.fields.depth')}>
                            <Select 
                                value={config.siteConfig?.toc?.depth || 2}
                                onChange={v => updateDeep('siteConfig.toc.depth', Number(v))}
                                options={[
                                    { label: '1', value: 1 },
                                    { label: '2', value: 2 },
                                    { label: '3', value: 3 }
                                ]}
                            />
                        </InputGroup>
                         <div className="col-span-2">
                             <Toggle 
                                label={t('settings.fields.useJapaneseBadge')}
                                checked={config.siteConfig?.toc?.useJapaneseBadge}
                                onChange={v => updateDeep('siteConfig.toc.useJapaneseBadge', v)}
                            />
                         </div>
                    </div>
                )}
            </Section>

            <Section title={t('settings.sections.footer')}>
                 <Toggle 
                    label={t('settings.fields.customFooter')}
                    checked={config.footerConfig?.enable}
                    onChange={v => updateDeep('footerConfig.enable', v)}
                />
                {config.footerConfig?.enable && (
                    <InputGroup label={t('settings.fields.htmlContent')}>
                         <Input value={config.footerConfig?.customHtml} onChange={v => updateDeep('footerConfig.customHtml', v)} />
                    </InputGroup>
                )}
            </Section>
        </div>
    );
}
