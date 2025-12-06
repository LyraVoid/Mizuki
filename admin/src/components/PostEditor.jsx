import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { 
    FileText, Save, ArrowLeft, Eye, Edit3, Columns, 
    Bold, Italic, List, ListOrdered, Link as LinkIcon, Image as ImageIcon,
    Quote, Code, Heading1, Heading2, Table as TableIcon
} from 'lucide-react';
import ReactMarkdown from 'react-markdown';
import remarkGfm from 'remark-gfm';
import rehypeHighlight from 'rehype-highlight';
import 'highlight.js/styles/github.css'; 

export default function PostEditor({ slug, onBack }) {
    const { t } = useLanguage();
    const [content, setContent] = useState('');
    const [viewMode, setViewMode] = useState('split'); // edit, preview, split
    const [metadata, setMetadata] = useState({
        title: '',
        description: '',
        published: new Date().toISOString().split('T')[0],
        draft: false,
        tags: '',
        category: '',
        pinned: false,
        image: '',
    });
    const [slugName, setSlugName] = useState(slug === 'new' ? '' : slug);
    const [loading, setLoading] = useState(slug !== 'new');

    useEffect(() => {
        if (slug !== 'new') {
            fetch(`/api/posts/${slug}`)
                .then(res => res.json())
                .then(data => {
                    setContent(data.content);
                    const tags = Array.isArray(data.metadata.tags) 
                        ? data.metadata.tags.join(', ') 
                        : (data.metadata.tags || '');
                    setMetadata({
                        ...data.metadata,
                        tags: tags
                    });
                    setLoading(false);
                });
        }
    }, [slug]);

    const handleSave = () => {
        if (!slugName) return alert(t('posts.editor.slugRequired'));
        if (!metadata.title) return alert(t('posts.editor.titleRequired'));

        const payload = {
            slug: slugName,
            content,
            metadata: {
                ...metadata,
                tags: typeof metadata.tags === 'string' 
                    ? metadata.tags.split(',').map(t => t.trim()).filter(Boolean) 
                    : metadata.tags
            }
        };

        fetch('/api/posts', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(payload)
        })
        .then(() => {
            alert(t('common.saved'));
            if (slug === 'new') onBack(); 
        });
    };

    const insertText = (before, after = '') => {
        const textarea = document.getElementById('markdown-editor');
        if (!textarea) return;

        const start = textarea.selectionStart;
        const end = textarea.selectionEnd;
        const selectedText = content.substring(start, end);
        const newText = content.substring(0, start) + before + selectedText + after + content.substring(end);
        
        setContent(newText);
        
        // Restore focus and selection
        setTimeout(() => {
            textarea.focus();
            textarea.setSelectionRange(start + before.length, end + before.length);
        }, 0);
    };

    if (loading) return <div className="p-8 text-center text-gray-500">{t('common.loading')}</div>;

    return (
        <div className="h-full flex flex-col">
            {/* Top Bar */}
            <div className="flex justify-between items-center mb-4 bg-white p-2 rounded-xl border border-gray-100 shadow-sm">
                <div className="flex items-center gap-4">
                     <button onClick={onBack} className="text-gray-600 hover:text-gray-900 px-3 py-1.5 rounded-lg text-sm hover:bg-gray-50 transition-all flex items-center gap-2">
                        <ArrowLeft size={18} />
                        {t('common.back')}
                     </button>
                     <div className="h-6 w-px bg-gray-200"></div>
                     <input 
                        type="text" 
                        placeholder={t('posts.editor.placeholder.title')}
                        className="text-lg font-bold text-gray-800 border-none focus:ring-0 placeholder-gray-300 w-96 bg-transparent"
                        value={metadata.title}
                        onChange={e => setMetadata({...metadata, title: e.target.value})}
                     />
                </div>
               
                <div className="flex gap-2 items-center">
                     <div className="flex bg-gray-100 p-1 rounded-lg mr-2">
                        <button 
                            onClick={() => setViewMode('edit')} 
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'edit' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title={t('common.edit')}
                        >
                            <Edit3 size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('split')} 
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'split' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title={t('posts.editor.preview')}
                        >
                            <Columns size={18} />
                        </button>
                        <button 
                            onClick={() => setViewMode('preview')} 
                            className={`p-1.5 rounded-md transition-all ${viewMode === 'preview' ? 'bg-white shadow text-blue-600' : 'text-gray-500 hover:text-gray-700'}`}
                            title={t('posts.editor.preview')}
                        >
                            <Eye size={18} />
                        </button>
                     </div>
                     <button onClick={handleSave} className="bg-blue-600 text-white px-4 py-2 rounded-lg hover:bg-blue-700 font-medium shadow-sm transition-colors flex items-center gap-2">
                        <Save size={18} />
                        {t('common.save')}
                     </button>
                </div>
            </div>

            <div className="flex-1 flex gap-4 overflow-hidden">
                {/* Editor Pane */}
                {(viewMode === 'edit' || viewMode === 'split') && (
                    <div className={`flex flex-col bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden ${viewMode === 'split' ? 'w-1/2' : 'w-full'}`}>
                        {/* Toolbar */}
                        <div className="p-2 border-b bg-gray-50 flex items-center gap-1 flex-wrap">
                            <ToolbarButton icon={Bold} onClick={() => insertText('**', '**')} label={t('posts.editor.toolbar.bold')} />
                            <ToolbarButton icon={Italic} onClick={() => insertText('*', '*')} label={t('posts.editor.toolbar.italic')} />
                            <div className="w-px h-4 bg-gray-300 mx-1"></div>
                            <ToolbarButton icon={Heading1} onClick={() => insertText('# ')} label={t('posts.editor.toolbar.h1')} />
                            <ToolbarButton icon={Heading2} onClick={() => insertText('## ')} label={t('posts.editor.toolbar.h2')} />
                            <div className="w-px h-4 bg-gray-300 mx-1"></div>
                            <ToolbarButton icon={List} onClick={() => insertText('- ')} label={t('posts.editor.toolbar.list')} />
                            <ToolbarButton icon={ListOrdered} onClick={() => insertText('1. ')} label={t('posts.editor.toolbar.orderedList')} />
                            <ToolbarButton icon={Quote} onClick={() => insertText('> ')} label={t('posts.editor.toolbar.quote')} />
                            <ToolbarButton icon={Code} onClick={() => insertText('```\\n', '\\n```')} label={t('posts.editor.toolbar.code')} />
                            <div className="w-px h-4 bg-gray-300 mx-1"></div>
                            <ToolbarButton icon={LinkIcon} onClick={() => insertText('[', '](url)')} label={t('posts.editor.toolbar.link')} />
                            <ToolbarButton icon={ImageIcon} onClick={() => insertText('![alt](', ')')} label={t('posts.editor.toolbar.image')} />
                            <ToolbarButton icon={TableIcon} onClick={() => insertText('| Header | Header |\\n| --- | --- |\\n| Cell | Cell |')} label={t('posts.editor.toolbar.table')} />
                        </div>
                        
                        <textarea 
                            id="markdown-editor"
                            className="flex-1 w-full p-6 font-mono text-sm resize-none focus:outline-none leading-relaxed"
                            value={content}
                            onChange={e => setContent(e.target.value)}
                            placeholder={t('posts.editor.placeholder.content')}
                        />
                    </div>
                )}

                {/* Preview Pane */}
                {(viewMode === 'preview' || viewMode === 'split') && (
                    <div className={`bg-gray-50 rounded-xl border border-gray-200 overflow-hidden flex flex-col ${viewMode === 'split' ? 'w-1/2' : 'w-full max-w-4xl mx-auto'}`}>
                        <div className="p-3 border-b bg-white/50 text-xs font-bold text-gray-500 uppercase tracking-wider flex justify-between items-center">
                            <span>{t('posts.editor.preview')}</span>
                        </div>
                        <div className="flex-1 overflow-auto p-8 prose prose-blue max-w-none prose-img:rounded-lg">
                            <ReactMarkdown 
                                remarkPlugins={[remarkGfm]}
                                rehypePlugins={[rehypeHighlight]}
                            >
                                {content}
                            </ReactMarkdown>
                        </div>
                    </div>
                )}
            </div>

            {/* Bottom Metadata Bar */}
            <div className="mt-4 bg-white p-4 rounded-xl border border-gray-100 shadow-sm flex gap-6 items-center flex-wrap text-sm">
                 <div className="flex items-center gap-2">
                    <span className="text-gray-500">{t('posts.editor.slug')}:</span>
                    <input 
                        type="text" 
                        className="border-b border-gray-200 focus:border-blue-500 outline-none px-1 py-0.5"
                        value={slugName}
                        onChange={e => setSlugName(e.target.value)}
                        disabled={slug !== 'new'}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-500">{t('posts.editor.date')}:</span>
                    <input 
                        type="date" 
                        className="bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none px-1 py-0.5"
                        value={metadata.published ? new Date(metadata.published).toISOString().split('T')[0] : ''}
                        onChange={e => setMetadata({...metadata, published: e.target.value})}
                    />
                </div>
                 <div className="flex items-center gap-2">
                    <span className="text-gray-500">{t('posts.editor.category')}:</span>
                    <input 
                        type="text" 
                        className="bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none px-1 py-0.5 w-32"
                        value={metadata.category || ''}
                        onChange={e => setMetadata({...metadata, category: e.target.value})}
                        placeholder={t('posts.editor.placeholder.category')}
                    />
                </div>
                <div className="flex items-center gap-2">
                    <span className="text-gray-500">{t('posts.editor.tags')}:</span>
                    <input 
                        type="text" 
                        className="bg-transparent border-b border-gray-200 focus:border-blue-500 outline-none px-1 py-0.5 w-48"
                        value={metadata.tags}
                        onChange={e => setMetadata({...metadata, tags: e.target.value})}
                        placeholder={t('posts.editor.placeholder.tags')}
                    />
                </div>
                <label className="flex items-center gap-2 cursor-pointer select-none">
                    <input 
                        type="checkbox" 
                        className="rounded text-blue-600 focus:ring-blue-500"
                        checked={metadata.draft}
                        onChange={e => setMetadata({...metadata, draft: e.target.checked})}
                    />
                    <span className="text-gray-700">{t('posts.editor.draft')}</span>
                </label>
            </div>
        </div>
    );
}

function ToolbarButton({ icon: Icon, onClick, label }) {
    return (
        <button 
            onClick={onClick}
            className="p-1.5 text-gray-500 hover:text-blue-600 hover:bg-blue-50 rounded-md transition-colors"
            title={label}
        >
            <Icon size={16} />
        </button>
    )
}
