import React, { useState } from 'react';
import Sidebar from './layouts/Sidebar';
import Topbar from './layouts/Topbar';
import Dashboard from './pages/Dashboard';
import Media from './pages/Media';
import Settings from './pages/Settings';
import Posts from './pages/Posts';
import DataProjects from './pages/DataProjects';
import DataSkills from './pages/DataSkills';
import DataTimeline from './pages/DataTimeline';
import { LanguageProvider } from './context/LanguageContext';

function AdminLayout() {
    const [activeTab, setActiveTab] = useState('dashboard');

    return (
        <div className="flex h-screen bg-gray-50 text-gray-900 font-sans">
            <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
            
            <div className="flex-1 flex flex-col h-full overflow-hidden">
                <Topbar />
                
                <main className="flex-1 overflow-auto p-6 md:p-8">
                    <div className="max-w-7xl mx-auto h-full">
                        {activeTab === 'dashboard' && <Dashboard />}
                        {activeTab === 'media' && <Media />}
                        {activeTab === 'settings' && <Settings />}
                        {activeTab === 'posts' && <Posts />}
                        {activeTab === 'data-projects' && <DataProjects />}
                        {activeTab === 'data-skills' && <DataSkills />}
                        {activeTab === 'data-timeline' && <DataTimeline />}
                    </div>
                </main>
            </div>
        </div>
    );
}

export default function App() {
    return (
        <LanguageProvider>
            <AdminLayout />
        </LanguageProvider>
    );
}
