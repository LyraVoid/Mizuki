import React, { createContext, useState, useContext, useEffect } from 'react';
import en from '../i18n/en';
import zh from '../i18n/zh';

const LanguageContext = createContext();

export const LanguageProvider = ({ children }) => {
    // Default to browser language or 'en'
    const [lang, setLang] = useState('zh'); 

    const toggleLang = () => {
        setLang(prev => prev === 'en' ? 'zh' : 'en');
    };

    const t = (path) => {
        const keys = path.split('.');
        let current = lang === 'en' ? en : zh;
        for (const key of keys) {
            if (current[key] === undefined) return path;
            current = current[key];
        }
        return current;
    };

    return (
        <LanguageContext.Provider value={{ lang, setLang, toggleLang, t }}>
            {children}
        </LanguageContext.Provider>
    );
};

export const useLanguage = () => useContext(LanguageContext);
