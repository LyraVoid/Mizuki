import React, { useState, useEffect, useMemo } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Pencil, Trash2, Plus, FileText, Search, Calendar, Tag, Folder, ArrowUpDown, CheckSquare, Square } from 'lucide-react';
import PostEditor from '../components/PostEditor';

export default function Posts() {
    const { t } = useLanguage();
    const [posts, setPosts] = useState([]);
    const [editingPost, setEditingPost] = useState(null);
    
    // Filters & Sorting state
    const [searchQuery, setSearchQuery] = useState('');
    const [selectedCategory, setSelectedCategory] = useState('all');
    const [selectedTag, setSelectedTag] = useState('all');
    const [sortBy, setSortBy] = useState('newest'); // newest, oldest, titleAZ, titleZA
    
    // Selection state
    const [selectedPosts, setSelectedPosts] = useState(new Set());

    useEffect(() => {
        loadPosts();
    }, []);

    const loadPosts = () => {
        fetch('/api/posts')
            .then(res => res.json())
            .then(data => setPosts(data));
    };

    const handleDelete = (slug) => {
        if (!confirm(t('common.confirm') + '?')) return;
        fetch(`/api/posts/${slug}`, { method: 'DELETE' })
            .then(() => {
                loadPosts();
                setSelectedPosts(prev => {
                    const newSet = new Set(prev);
                    newSet.delete(slug);
                    return newSet;
                });
            });
    };

    const handleBatchDelete = () => {
        const count = selectedPosts.size;
        if (count === 0) return;
        
        const message = t('posts.batch.confirmDelete').replace('{{count}}', count);
        if (!confirm(message)) return;

        // Execute all deletes
        Promise.all(Array.from(selectedPosts).map(slug => 
             fetch(`/api/posts/${slug}`, { method: 'DELETE' })
        )).then(() => {
            loadPosts();
            setSelectedPosts(new Set());
        });
    };

    const toggleSelection = (slug) => {
        setSelectedPosts(prev => {
            const newSet = new Set(prev);
            if (newSet.has(slug)) {
                newSet.delete(slug);
            } else {
                newSet.add(slug);
            }
            return newSet;
        });
    };

    const toggleSelectAll = () => {
        if (selectedPosts.size === filteredPosts.length) {
            setSelectedPosts(new Set());
        } else {
            setSelectedPosts(new Set(filteredPosts.map(p => p.slug)));
        }
    };

    // Derived data
    const categories = useMemo(() => {
        const cats = new Set(posts.map(p => p.category).filter(Boolean));
        return Array.from(cats).sort();
    }, [posts]);

    const tags = useMemo(() => {
        const tgs = new Set();
        posts.forEach(p => {
            if (Array.isArray(p.tags)) p.tags.forEach(t => tgs.add(t));
            else if (typeof p.tags === 'string') p.tags.split(',').forEach(t => tgs.add(t.trim()));
        });
        return Array.from(tgs).filter(Boolean).sort();
    }, [posts]);

    const filteredPosts = useMemo(() => {
        return posts
            .filter(post => {
                const matchesSearch = (post.title?.toLowerCase() || '').includes(searchQuery.toLowerCase()) || 
                                      post.slug.toLowerCase().includes(searchQuery.toLowerCase());
                const matchesCategory = selectedCategory === 'all' || post.category === selectedCategory;
                const matchesTag = selectedTag === 'all' || (
                    Array.isArray(post.tags) ? post.tags.includes(selectedTag) : (post.tags || '').includes(selectedTag)
                );
                return matchesSearch && matchesCategory && matchesTag;
            })
            .sort((a, b) => {
                if (sortBy === 'newest') return new Date(b.date || 0) - new Date(a.date || 0);
                if (sortBy === 'oldest') return new Date(a.date || 0) - new Date(b.date || 0);
                if (sortBy === 'titleAZ') return (a.title || '').localeCompare(b.title || '');
                if (sortBy === 'titleZA') return (b.title || '').localeCompare(a.title || '');
                return 0;
            });
    }, [posts, searchQuery, selectedCategory, selectedTag, sortBy]);

    if (editingPost) {
        return <PostEditor slug={editingPost} onBack={() => { setEditingPost(null); loadPosts(); }} />;
    }

    return (
        <div className="space-y-6 h-full flex flex-col">
            {/* Header & Actions */}
            <div className="flex justify-between items-center bg-white p-4 rounded-xl shadow-sm border border-gray-100">
                <div className="flex items-center gap-4">
                     <h2 className="text-xl font-bold text-gray-800 flex items-center gap-2">
                        <FileText className="text-blue-600" />
                        {t('common.posts')}
                        <span className="text-xs font-normal text-gray-500 bg-gray-100 px-2 py-0.5 rounded-full">{posts.length}</span>
                    </h2>
                </div>
                <button onClick={() => setEditingPost('new')} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 flex items-center gap-2 font-medium shadow-sm transition-colors text-sm">
                    <Plus size={16} />
                    {t('common.create')}
                </button>
            </div>

            {/* Toolbar: Filter & Search & Sorting */}
            <div className="grid grid-cols-1 md:grid-cols-12 gap-4">
                {/* Search */}
                <div className="md:col-span-4 relative">
                    <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={18} />
                    <input 
                        type="text"
                        placeholder={t('posts.filter.search')}
                        className="w-full pl-10 pr-4 py-2 border border-gray-200 rounded-lg focus:outline-none focus:ring-2 focus:ring-blue-500 transition-all text-sm"
                        value={searchQuery}
                        onChange={e => setSearchQuery(e.target.value)}
                    />
                </div>

                {/* Filters */}
                <div className="md:col-span-6 flex gap-3">
                    <div className="relative flex-1">
                        <Folder className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select 
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                            value={selectedCategory}
                            onChange={e => setSelectedCategory(e.target.value)}
                        >
                            <option value="all">{t('posts.filter.allCategories')}</option>
                            {categories.map(c => <option key={c} value={c}>{c}</option>)}
                        </select>
                    </div>
                    <div className="relative flex-1">
                        <Tag className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select 
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                            value={selectedTag}
                            onChange={e => setSelectedTag(e.target.value)}
                        >
                            <option value="all">{t('posts.filter.allTags')}</option>
                            {tags.map(t_ => <option key={t_} value={t_}>{t_}</option>)}
                        </select>
                    </div>
                    <div className="relative flex-1">
                        <ArrowUpDown className="absolute left-3 top-1/2 -translate-y-1/2 text-gray-400" size={16} />
                        <select 
                            className="w-full pl-9 pr-4 py-2 border border-gray-200 rounded-lg bg-white focus:outline-none focus:ring-2 focus:ring-blue-500 text-sm appearance-none"
                            value={sortBy}
                            onChange={e => setSortBy(e.target.value)}
                        >
                            <option value="newest">{t('posts.filter.newest')}</option>
                            <option value="oldest">{t('posts.filter.oldest')}</option>
                            <option value="titleAZ">{t('posts.filter.titleAZ')}</option>
                            <option value="titleZA">{t('posts.filter.titleZA')}</option>
                        </select>
                    </div>
                </div>

                {/* Batch Actions */}
                <div className="md:col-span-2 flex justify-end">
                    {selectedPosts.size > 0 && (
                        <button 
                            onClick={handleBatchDelete}
                            className="flex items-center gap-2 text-red-600 bg-red-50 hover:bg-red-100 px-4 py-2 rounded-lg text-sm font-medium transition-colors"
                        >
                            <Trash2 size={16} />
                            {t('posts.batch.delete')} ({selectedPosts.size})
                        </button>
                    )}
                </div>
            </div>
            
            {/* Table */}
            <div className="bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden flex-1 flex flex-col">
                <div className="overflow-auto flex-1">
                    <table className="min-w-full divide-y divide-gray-200">
                        <thead className="bg-gray-50 sticky top-0 z-10">
                            <tr>
                                <th className="px-6 py-3 w-12">
                                    <button onClick={toggleSelectAll} className="flex items-center text-gray-400 hover:text-gray-600">
                                        {selectedPosts.size > 0 && selectedPosts.size === filteredPosts.length ? <CheckSquare size={20} className="text-blue-600"/> : <Square size={20} />}
                                    </button>
                                </th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('posts.columns.title')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('posts.columns.category')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('posts.columns.tags')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('posts.columns.date')}</th>
                                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">{t('posts.columns.status')}</th>
                                <th className="px-6 py-3 text-right text-xs font-medium text-gray-500 uppercase tracking-wider">{t('posts.columns.actions')}</th>
                            </tr>
                        </thead>
                        <tbody className="bg-white divide-y divide-gray-200">
                            {filteredPosts.length === 0 ? (
                                <tr>
                                    <td colSpan="7" className="px-6 py-12 text-center text-gray-400">
                                        <div className="flex flex-col items-center gap-2">
                                            <FileText size={48} className="text-gray-200" />
                                            {t('posts.noResults')}
                                        </div>
                                    </td>
                                </tr>
                            ) : (
                                filteredPosts.map(post => (
                                    <tr key={post.slug} className={`hover:bg-gray-50 transition-colors ${selectedPosts.has(post.slug) ? 'bg-blue-50 hover:bg-blue-50' : ''}`}>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            <button onClick={() => toggleSelection(post.slug)} className="flex items-center text-gray-400 hover:text-gray-600">
                                                 {selectedPosts.has(post.slug) ? <CheckSquare size={20} className="text-blue-600"/> : <Square size={20} />}
                                            </button>
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="font-medium text-gray-900 line-clamp-1">{post.title || 'Untitled'}</div>
                                            <div className="text-xs text-gray-400 font-mono mt-0.5">{post.slug}</div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {post.category ? (
                                                <span className="inline-flex items-center px-2 py-1 rounded-md text-xs font-medium bg-gray-100 text-gray-700">
                                                    <Folder size={12} className="mr-1" />
                                                    {post.category}
                                                </span>
                                            ) : '-'}
                                        </td>
                                        <td className="px-6 py-4">
                                            <div className="flex flex-wrap gap-1">
                                                {Array.isArray(post.tags) 
                                                    ? post.tags.slice(0, 3).map(tag => (
                                                        <span key={tag} className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">
                                                            {tag}
                                                        </span>
                                                    ))
                                                    : post.tags ? <span className="inline-flex items-center px-2 py-0.5 rounded text-xs font-medium bg-blue-50 text-blue-700">{post.tags.split(',')[0]}</span> : '-'
                                                }
                                                {(Array.isArray(post.tags) && post.tags.length > 3) && <span className="text-xs text-gray-400">+{post.tags.length - 3}</span>}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-sm text-gray-600">
                                            <div className="flex items-center gap-1">
                                                <Calendar size={14} className="text-gray-400" />
                                                {post.date ? new Date(post.date).toLocaleDateString() : '-'}
                                            </div>
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap">
                                            {post.draft ? (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-yellow-100 text-yellow-800">
                                                    <span className="w-1.5 h-1.5 bg-yellow-400 rounded-full mr-1.5"></span>
                                                    {t('posts.status.draft')}
                                                </span>
                                            ) : (
                                                <span className="inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium bg-green-100 text-green-800">
                                                    <span className="w-1.5 h-1.5 bg-green-400 rounded-full mr-1.5"></span>
                                                    {t('posts.status.published')}
                                                </span>
                                            )}
                                        </td>
                                        <td className="px-6 py-4 whitespace-nowrap text-right text-sm font-medium">
                                            <div className="flex items-center justify-end gap-2">
                                                <button onClick={() => setEditingPost(post.slug)} className="p-1.5 text-blue-600 hover:bg-blue-50 rounded-lg transition-colors" title={t('common.edit')}>
                                                    <Pencil size={18} />
                                                </button>
                                                <button onClick={() => handleDelete(post.slug)} className="p-1.5 text-black/20 hover:text-red-600 hover:bg-red-50 rounded-lg transition-colors" title={t('common.delete')}>
                                                    <Trash2 size={18} />
                                                </button>
                                            </div>
                                        </td>
                                    </tr>
                                ))
                            )}
                        </tbody>
                    </table>
                </div>
            </div>
        </div>
    );
}
