import React, { useEffect, useState } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { FileText, Cpu, Clock, PenTool, Layout, FolderOpen, ExternalLink, Activity } from 'lucide-react';
import { Link, useNavigate } from 'react-router-dom';

export default function Dashboard() {
    const { t } = useLanguage();
    const navigate = useNavigate();
    const [stats, setStats] = useState({
        total: 0,
        published: 0,
        drafts: 0,
        lastUpdated: '-'
    });
    const [recentPosts, setRecentPosts] = useState([]);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => {
                const sorted = data.sort((a, b) => new Date(b.date) - new Date(a.date));
                setStats({
                    total: data.length,
                    published: data.filter(p => !p.draft).length,
                    drafts: data.filter(p => p.draft).length,
                    lastUpdated: sorted[0]?.date ? new Date(sorted[0].date).toLocaleDateString() : '-'
                });
                setRecentPosts(sorted.slice(0, 5));
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load dashboard data", err);
                setLoading(false);
            });
    }, []);

    const StatCard = ({ icon: Icon, title, value, color, delay }) => (
        <div 
            className="bg-white p-6 rounded-xl shadow-sm border border-gray-100 flex items-center gap-4 animate-fade-in-up"
            style={{ animationDelay: `${delay}ms` }}
        >
            <div className={`p-4 rounded-xl ${color} text-white shadow-md transform transition-transform hover:scale-110`}>
                <Icon size={24} />
            </div>
            <div>
                <p className="text-gray-500 text-sm font-medium">{title}</p>
                <p className="text-2xl font-bold text-gray-800 tracking-tight">{loading ? '-' : value}</p>
            </div>
        </div>
    );

    return (
        <div className="space-y-8 animate-fade-in">
            {/* Header */}
            <div className="flex justify-between items-center">
                <div>
                    <h2 className="text-2xl font-bold text-gray-800">{t('common.dashboard')}</h2>
                    <p className="text-gray-500 text-sm mt-1">{t('common.welcome')}</p>
                </div>
                <div className="flex gap-3">
                    <a 
                        href="http://localhost:4321" 
                        target="_blank" 
                        rel="noopener noreferrer"
                        className="flex items-center gap-2 px-4 py-2 bg-white border border-gray-200 text-gray-700 rounded-lg hover:bg-gray-50 transition-colors shadow-sm text-sm font-medium"
                    >
                        <ExternalLink size={16} />
                        {t('common.viewSite')}
                    </a>
                </div>
            </div>
            
            {/* Stats Grid */}
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
                <StatCard 
                    icon={FileText} 
                    title={t('common.stats.totalPosts')} 
                    value={stats.total} 
                    color="bg-gradient-to-br from-blue-500 to-blue-600"
                    delay={0}
                />
                <StatCard 
                    icon={Layout} 
                    title={t('common.stats.published')} 
                    value={stats.published} 
                    color="bg-gradient-to-br from-green-500 to-emerald-600"
                    delay={100}
                />
                <StatCard 
                    icon={PenTool} 
                    title={t('common.stats.drafts')} 
                    value={stats.drafts} 
                    color="bg-gradient-to-br from-amber-400 to-orange-500"
                    delay={200}
                />
                <StatCard 
                    icon={Clock} 
                    title={t('common.stats.latestUpdate')} 
                    value={stats.lastUpdated} 
                    color="bg-gradient-to-br from-purple-500 to-indigo-600"
                    delay={300}
                />
            </div>

            <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
                {/* Recent Activity */}
                <div className="lg:col-span-2 bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden">
                    <div className="p-6 border-b border-gray-100 flex justify-between items-center">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Activity size={20} className="text-blue-500" />
                            {t('common.activity.title')}
                        </h3>
                        <Link to="/posts" className="text-sm text-blue-600 hover:text-blue-800 font-medium">{t('common.viewAll')}</Link>
                    </div>
                    <div className="divide-y divide-gray-100">
                        {loading ? (
                            <div className="p-8 text-center text-gray-400">{t('common.loading')}</div>
                        ) : recentPosts.length === 0 ? (
                            <div className="p-8 text-center text-gray-400">{t('common.noActivity')}</div>
                        ) : (
                            recentPosts.map((post, idx) => (
                                <div key={post.slug} className="p-4 hover:bg-gray-50 transition-colors flex items-center justify-between group">
                                    <div className="flex items-center gap-4">
                                        <div className={`p-2 rounded-lg ${post.draft ? 'bg-amber-100 text-amber-600' : 'bg-green-100 text-green-600'}`}>
                                            <FileText size={18} />
                                        </div>
                                        <div>
                                            <h4 className="text-sm font-semibold text-gray-800 group-hover:text-blue-600 transition-colors">{post.title || post.slug}</h4>
                                            <p className="text-xs text-gray-500 flex items-center gap-2">
                                                <span>{new Date(post.date).toLocaleDateString()}</span>
                                                <span className="w-1 h-1 bg-gray-300 rounded-full"></span>
                                                <span>{post.category || 'Uncategorized'}</span>
                                            </p>
                                        </div>
                                    </div>
                                    <div className="flex items-center gap-2 opacity-0 group-hover:opacity-100 transition-opacity">
                                        <button 
                                            onClick={() => navigate('/posts')} // Ideally navigate to edit, but for now just posts
                                            className="px-3 py-1.5 text-xs font-medium text-gray-600 bg-white border border-gray-200 rounded hover:bg-gray-50 hover:text-blue-600 transition-colors"
                                        >
                                            {t('common.edit')}
                                        </button>
                                    </div>
                                </div>
                            ))
                        )}
                    </div>
                </div>

                {/* Quick Actions */}
                <div className="bg-white rounded-xl shadow-sm border border-gray-100 h-fit">
                    <div className="p-6 border-b border-gray-100">
                        <h3 className="font-bold text-gray-800 flex items-center gap-2">
                            <Cpu size={20} className="text-orange-500" />
                            {t('common.quickActions.title')}
                        </h3>
                    </div>
                    <div className="p-6 grid grid-cols-1 gap-4">
                        <button 
                            onClick={() => navigate('/posts')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-blue-50 group transition-colors border border-transparent hover:border-blue-100"
                        >
                            <span className="flex items-center gap-3 font-medium text-gray-700 group-hover:text-blue-700">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-blue-500 group-hover:scale-110 transition-transform">
                                    <PenTool size={18} />
                                </div>
                                {t('common.quickActions.newPost')}
                            </span>
                            <span className="text-gray-400 group-hover:text-blue-400">→</span>
                        </button>

                        <button 
                            onClick={() => navigate('/media')}
                            className="w-full flex items-center justify-between p-4 bg-gray-50 rounded-xl hover:bg-purple-50 group transition-colors border border-transparent hover:border-purple-100"
                        >
                            <span className="flex items-center gap-3 font-medium text-gray-700 group-hover:text-purple-700">
                                <div className="p-2 bg-white rounded-lg shadow-sm text-purple-500 group-hover:scale-110 transition-transform">
                                    <FolderOpen size={18} />
                                </div>
                                {t('common.quickActions.media')}
                            </span>
                            <span className="text-gray-400 group-hover:text-purple-400">→</span>
                        </button>
                    </div>
                </div>
            </div>
        </div>
    );
}
