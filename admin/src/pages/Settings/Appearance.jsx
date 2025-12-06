import React from 'react';
import { Section, InputGroup, Input, Toggle, ArrayInput, Select, ObjectListEditor } from '../../components/Form';
import { useLanguage } from '../../context/LanguageContext';

export default function AppearanceSettings({ config, updateDeep }) {
    const { t } = useLanguage();

    const fonts = [
        { label: 'ZenMaruGothic', value: 'ZenMaruGothic-Medium' },
        { label: 'Roboto', value: 'Roboto' },
        { label: 'Inter', value: 'Inter' }
    ];

    return (
        <div className="space-y-6">
            <Section title={t('settings.sections.theme')}>
                 <InputGroup label={t('settings.fields.themeHue')}>
                    <div className="flex gap-4 items-center">
                        <input 
                            type="range" min="0" max="360" 
                            className="flex-1"
                            value={config.siteConfig?.themeColor?.hue || 230} 
                            onChange={e => updateDeep('siteConfig.themeColor.hue', Number(e.target.value))} 
                        />
                        <span className="w-12 text-right">{config.siteConfig?.themeColor?.hue}</span>
                    </div>
                </InputGroup>
                <Toggle 
                    label={t('settings.fields.fixedTheme')}
                    checked={config.siteConfig?.themeColor?.fixed}
                    onChange={v => updateDeep('siteConfig.themeColor.fixed', v)}
                />
            </Section>

            <Section title={t('settings.sections.fonts')}>
                <div className="grid grid-cols-2 gap-4">
                     <InputGroup label={t('settings.fields.asciiFont')}>
                        <Select 
                            value={config.siteConfig?.font?.asciiFont?.fontFamily}
                            onChange={v => updateDeep('siteConfig.font.asciiFont.fontFamily', v)}
                            options={fonts}
                        />
                    </InputGroup>
                     <InputGroup label={t('settings.fields.cjkFont')}>
                        <Input value={config.siteConfig?.font?.cjkFont?.fontFamily} onChange={v => updateDeep('siteConfig.font.cjkFont.fontFamily', v)} />
                    </InputGroup>
                </div>
                
                 <div className="grid grid-cols-2 gap-4 mt-4">
                     <InputGroup label={t('settings.fields.fontWeight')}>
                        <Input value={config.siteConfig?.font?.asciiFont?.fontWeight} onChange={v => updateDeep('siteConfig.font.asciiFont.fontWeight', v)} placeholder="400" />
                    </InputGroup>
                     <div className="flex items-center pt-6">
                        <Toggle 
                            label={t('settings.fields.enableCompress')}
                            checked={config.siteConfig?.font?.asciiFont?.enableCompress}
                            onChange={v => updateDeep('siteConfig.font.asciiFont.enableCompress', v)}
                        />
                     </div>
                </div>
            </Section>
            
            <Section title={t('settings.sections.banner')}>
                 <Toggle 
                    label={t('settings.fields.enableCarousel')}
                    checked={config.siteConfig?.banner?.carousel?.enable}
                    onChange={v => updateDeep('siteConfig.banner.carousel.enable', v)}
                />
                 <Toggle 
                    label={t('settings.fields.enableTypewriter')}
                    checked={config.siteConfig?.banner?.homeText?.enable}
                    onChange={v => updateDeep('siteConfig.banner.homeText.enable', v)}
                />

                <InputGroup label={t('settings.fields.desktopImages')}>
                    <ArrayInput 
                        values={config.siteConfig?.banner?.src?.desktop} 
                        onChange={v => updateDeep('siteConfig.banner.src.desktop', v)}
                    />
                </InputGroup>
                 <InputGroup label={t('settings.fields.mobileImages')}>
                    <ArrayInput 
                        values={config.siteConfig?.banner?.src?.mobile} 
                        onChange={v => updateDeep('siteConfig.banner.src.mobile', v)}
                    />
                </InputGroup>

                <div className="grid grid-cols-2 gap-4 mt-4">
                     <InputGroup label={t('settings.fields.bannerPosition')}>
                        <Select 
                            value={config.siteConfig?.banner?.position || 'center'}
                            onChange={v => updateDeep('siteConfig.banner.position', v)}
                            options={[
                                { label: 'Center', value: 'center' },
                                { label: 'Top', value: 'top' },
                                { label: 'Bottom', value: 'bottom' }
                            ]}
                        />
                    </InputGroup>
                    <InputGroup label={t('settings.fields.interval')}>
                         <Input 
                            type="number"
                            value={config.siteConfig?.banner?.carousel?.interval || 1.5} 
                            onChange={v => updateDeep('siteConfig.banner.carousel.interval', Number(v))} 
                        />
                    </InputGroup>
                </div>

                {/* Home Text (Slogan) */}
                <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
                     <h4 className="text-sm font-semibold text-gray-900">{t('settings.fields.bannerText')}</h4>
                     <InputGroup label={t('settings.fields.bannerTitle')}>
                        <Input value={config.siteConfig?.banner?.homeText?.title} onChange={v => updateDeep('siteConfig.banner.homeText.title', v)} />
                    </InputGroup>
                    <ObjectListEditor
                        label={t('settings.fields.bannerSubtitle')}
                        values={config.siteConfig?.banner?.homeText?.subtitle?.map(s => ({ text: s }))} 
                        onChange={v => updateDeep('siteConfig.banner.homeText.subtitle', v.map(i => i.text))}
                        createNewItem={() => ({ text: 'New Slogan' })}
                        renderItem={(item, updateItem) => (
                             <Input 
                                value={item.text} 
                                onChange={v => updateItem({ ...item, text: v })} 
                            />
                        )}
                    />
                    
                    {config.siteConfig?.banner?.homeText?.enable && (
                        <div className="grid grid-cols-3 gap-4 bg-gray-50 p-4 rounded-lg">
                             <InputGroup label={t('settings.fields.typewriterSpeed')}>
                                <Input type="number" value={config.siteConfig?.banner?.homeText?.typewriter?.speed} onChange={v => updateDeep('siteConfig.banner.homeText.typewriter.speed', Number(v))} />
                            </InputGroup>
                            <InputGroup label={t('settings.fields.typewriterDeleteSpeed')}>
                                <Input type="number" value={config.siteConfig?.banner?.homeText?.typewriter?.deleteSpeed} onChange={v => updateDeep('siteConfig.banner.homeText.typewriter.deleteSpeed', Number(v))} />
                            </InputGroup>
                            <InputGroup label={t('settings.fields.typewriterPauseTime')}>
                                <Input type="number" value={config.siteConfig?.banner?.homeText?.typewriter?.pauseTime} onChange={v => updateDeep('siteConfig.banner.homeText.typewriter.pauseTime', Number(v))} />
                            </InputGroup>
                        </div>
                    )}
                </div>

                {/* Advanced Banner Settings */}
                <div className="border-t border-gray-100 pt-4 mt-4 space-y-4">
                    <h4 className="text-sm font-semibold text-gray-900">{t('settings.sections.bannerAdvanced')}</h4>
                    
                     <InputGroup label={t('settings.fields.navbarTransparentMode')}>
                        <Select 
                            value={config.siteConfig?.banner?.navbar?.transparentMode || 'semifull'}
                            onChange={v => updateDeep('siteConfig.banner.navbar.transparentMode', v)}
                            options={[
                                { label: 'Semi Full', value: 'semifull' },
                                { label: 'Full', value: 'full' },
                                { label: 'None', value: 'none' }
                            ]}
                        />
                    </InputGroup>

                    {/* Waves */}
                    <div className="bg-gray-50 p-4 rounded-lg">
                        <Toggle 
                            label={t('settings.fields.enableWaves')}
                            checked={config.siteConfig?.banner?.waves?.enable}
                            onChange={v => updateDeep('siteConfig.banner.waves.enable', v)}
                        />
                        {config.siteConfig?.banner?.waves?.enable && (
                            <div className="pl-4 mt-2 space-y-2 border-l-2 border-gray-200">
                                <Toggle 
                                    label={t('settings.fields.performanceMode')}
                                    checked={config.siteConfig?.banner?.waves?.performanceMode}
                                    onChange={v => updateDeep('siteConfig.banner.waves.performanceMode', v)}
                                />
                                <Toggle 
                                    label={t('settings.fields.mobileDisable')}
                                    checked={config.siteConfig?.banner?.waves?.mobileDisable}
                                    onChange={v => updateDeep('siteConfig.banner.waves.mobileDisable', v)}
                                />
                            </div>
                        )}
                    </div>

                    {/* Image API */}
                    <InputGroup label={t('settings.fields.imageApi')}>
                         <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <Toggle 
                                label={t('settings.fields.enable')}
                                checked={config.siteConfig?.banner?.imageApi?.enable}
                                onChange={v => updateDeep('siteConfig.banner.imageApi.enable', v)}
                            />
                            {config.siteConfig?.banner?.imageApi?.enable && (
                                <Input 
                                    placeholder="API URL"
                                    value={config.siteConfig?.banner?.imageApi?.url} 
                                    onChange={v => updateDeep('siteConfig.banner.imageApi.url', v)} 
                                />
                            )}
                        </div>
                    </InputGroup>

                     {/* Credit */}
                    <InputGroup label={t('settings.fields.credit')}>
                         <div className="bg-gray-50 p-4 rounded-lg space-y-3">
                            <Toggle 
                                label={t('settings.fields.enable')}
                                checked={config.siteConfig?.banner?.credit?.enable}
                                onChange={v => updateDeep('siteConfig.banner.credit.enable', v)}
                            />
                            {config.siteConfig?.banner?.credit?.enable && (
                                <div className="grid grid-cols-2 gap-4">
                                    <Input 
                                        placeholder="Text"
                                        value={config.siteConfig?.banner?.credit?.text} 
                                        onChange={v => updateDeep('siteConfig.banner.credit.text', v)} 
                                    />
                                     <Input 
                                        placeholder="URL"
                                        value={config.siteConfig?.banner?.credit?.url} 
                                        onChange={v => updateDeep('siteConfig.banner.credit.url', v)} 
                                    />
                                </div>
                            )}
                        </div>
                    </InputGroup>
                </div>
            </Section>

            <Section title={t('settings.sections.wallpaperMode')}>
                 <InputGroup label={t('settings.fields.defaultMode')}>
                    <Select 
                        value={config.siteConfig?.wallpaperMode?.defaultMode}
                        onChange={v => updateDeep('siteConfig.wallpaperMode.defaultMode', v)}
                        options={[
                            { label: 'Banner', value: 'banner' },
                            { label: 'Full', value: 'full' }
                        ]}
                    />
                </InputGroup>
                 <InputGroup label={t('settings.fields.showModeSwitchOnMobile')}>
                    <Select 
                        value={config.siteConfig?.wallpaperMode?.showModeSwitchOnMobile}
                        onChange={v => updateDeep('siteConfig.wallpaperMode.showModeSwitchOnMobile', v)}
                        options={[
                            { label: 'Desktop Only', value: 'desktop' },
                            { label: 'Mobile Only', value: 'mobile' },
                            { label: 'Both', value: 'both' },
                             { label: 'None', value: 'none' }
                        ]}
                    />
                </InputGroup>
            </Section>

            <Section title={t('settings.sections.fullscreenWallpaper')}>
                 <Toggle 
                    label={t('settings.fields.enableCarousel')}
                    checked={config.fullscreenWallpaperConfig?.carousel?.enable}
                    onChange={v => updateDeep('fullscreenWallpaperConfig.carousel.enable', v)}
                />
                 {config.fullscreenWallpaperConfig?.carousel?.enable && (
                    <InputGroup label={t('settings.fields.interval')}>
                         <Input 
                            type="number"
                            value={config.fullscreenWallpaperConfig?.carousel?.interval || 5} 
                            onChange={v => updateDeep('fullscreenWallpaperConfig.carousel.interval', Number(v))} 
                        />
                    </InputGroup>
                )}

                <div className="grid grid-cols-2 gap-4 mt-4">
                    <InputGroup label={t('settings.fields.opacity')}>
                        <div className="flex gap-4 items-center">
                            <input 
                                type="range" min="0" max="1" step="0.1"
                                className="flex-1"
                                value={config.fullscreenWallpaperConfig?.opacity || 1} 
                                onChange={e => updateDeep('fullscreenWallpaperConfig.opacity', Number(e.target.value))} 
                            />
                            <span className="w-12 text-right">{config.fullscreenWallpaperConfig?.opacity}</span>
                        </div>
                    </InputGroup>
                     <InputGroup label={t('settings.fields.blur')}>
                         <div className="flex gap-4 items-center">
                            <input 
                                type="range" min="0" max="20" step="1"
                                className="flex-1"
                                value={config.fullscreenWallpaperConfig?.blur || 0} 
                                onChange={e => updateDeep('fullscreenWallpaperConfig.blur', Number(e.target.value))} 
                            />
                            <span className="w-12 text-right">{config.fullscreenWallpaperConfig?.blur}px</span>
                        </div>
                    </InputGroup>
                </div>
                 <div className="grid grid-cols-2 gap-4 mt-4">
                     <InputGroup label={t('settings.fields.position')}>
                        <Select 
                            value={config.fullscreenWallpaperConfig?.position || 'center'}
                            onChange={v => updateDeep('fullscreenWallpaperConfig.position', v)}
                            options={[
                                { label: 'Center', value: 'center' },
                                { label: 'Top', value: 'top' },
                                { label: 'Bottom', value: 'bottom' }
                            ]}
                        />
                    </InputGroup>
                    <InputGroup label={t('settings.fields.zIndex')}>
                        <Input type="number" value={config.fullscreenWallpaperConfig?.zIndex} onChange={v => updateDeep('fullscreenWallpaperConfig.zIndex', Number(v))} />
                    </InputGroup>
                </div>

                 <InputGroup label={t('settings.fields.desktopImages')} className="mt-4">
                    <ArrayInput 
                        values={config.fullscreenWallpaperConfig?.src?.desktop} 
                        onChange={v => updateDeep('fullscreenWallpaperConfig.src.desktop', v)}
                    />
                </InputGroup>
                 <InputGroup label={t('settings.fields.mobileImages')}>
                    <ArrayInput 
                        values={config.fullscreenWallpaperConfig?.src?.mobile} 
                        onChange={v => updateDeep('fullscreenWallpaperConfig.src.mobile', v)}
                    />
                </InputGroup>
            </Section>

            <Section title={t('settings.sections.postStyling')}>
                 <InputGroup label={t('settings.fields.postListLayout')}>
                    <Select 
                        value={config.siteConfig?.postListLayout?.defaultMode}
                        onChange={v => updateDeep('siteConfig.postListLayout.defaultMode', v)}
                        options={[
                            { label: 'List', value: 'list' },
                            { label: 'Grid', value: 'grid' }
                        ]}
                    />
                </InputGroup>
                <Toggle 
                    label={t('settings.fields.allowLayoutSwitch')}
                    checked={config.siteConfig?.postListLayout?.allowSwitch}
                    onChange={v => updateDeep('siteConfig.postListLayout.allowSwitch', v)}
                />
                 <Toggle 
                    label={t('settings.fields.useNewTagStyle')}
                    checked={config.siteConfig?.tagStyle?.useNewStyle}
                    onChange={v => updateDeep('siteConfig.tagStyle.useNewStyle', v)}
                />
                 <InputGroup label={t('settings.fields.codeBlockTheme')}>
                    <Input value={config.expressiveCodeConfig?.theme} onChange={v => updateDeep('expressiveCodeConfig.theme', v)} placeholder="github-dark" />
                </InputGroup>
                 <Toggle 
                    label={t('settings.fields.hideDuringThemeTransition')}
                    checked={config.expressiveCodeConfig?.hideDuringThemeTransition}
                    onChange={v => updateDeep('expressiveCodeConfig.hideDuringThemeTransition', v)}
                />
            </Section>

            <Section title={t('settings.sections.favicon')}>
                <ObjectListEditor
                    label={t('settings.fields.faviconArray')}
                    values={config.siteConfig?.favicon}
                    onChange={v => updateDeep('siteConfig.favicon', v)}
                    createNewItem={() => ({ href: '/favicon.ico' })}
                    renderItem={(item, updateItem) => (
                        <div className="grid grid-cols-2 gap-2">
                             <Input 
                                placeholder="Href (/favicon.ico)" 
                                value={item.href} 
                                onChange={v => updateItem({ ...item, href: v })} 
                            />
                             <Input 
                                placeholder="Size/Type (Optional)" 
                                value={item.sizes || item.type} 
                                onChange={v => {
                                    // Basic guess logic or just store generic properties
                                    // For simplicity in this demo, just storing as 'type' if looks like mime, 'sizes' if num
                                    updateItem({ ...item, type: v })
                                }} 
                            />
                        </div>
                    )}
                />
            </Section>
        </div>
    );
}
