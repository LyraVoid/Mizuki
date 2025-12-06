import React, { useEffect, useState, useCallback } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Upload, Trash2, Copy, Image as ImageIcon, Check } from 'lucide-react';

export default function Media() {
    const { t } = useLanguage();
    const [images, setImages] = useState([]);
    const [loading, setLoading] = useState(true);
    const [dragActive, setDragActive] = useState(false);
    const [uploading, setUploading] = useState(false);
    const [copiedId, setCopiedId] = useState(null);

    const loadImages = () => {
        setLoading(true);
        fetch('/api/media')
            .then(res => res.json())
            .then(data => {
                setImages(data);
                setLoading(false);
            })
            .catch(err => {
                console.error("Failed to load media", err);
                setLoading(false);
            });
    };

    useEffect(() => {
        loadImages();
    }, []);

    const handleDrag = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        if (e.type === "dragenter" || e.type === "dragover") {
            setDragActive(true);
        } else if (e.type === "dragleave") {
            setDragActive(false);
        }
    }, []);

    const handleDrop = useCallback((e) => {
        e.preventDefault();
        e.stopPropagation();
        setDragActive(false);
        if (e.dataTransfer.files && e.dataTransfer.files[0]) {
            handleUpload(e.dataTransfer.files[0]);
        }
    }, []);

    const handleUpload = (file) => {
        setUploading(true);
        const formData = new FormData();
        formData.append('file', file);

        fetch('/api/media', {
            method: 'POST',
            body: formData
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                loadImages();
            }
        })
        .catch(err => console.error(err))
        .finally(() => setUploading(false));
    };

    const handleDelete = (filename) => {
        if (!confirm(t('media.deleteConfirm'))) return;

        fetch(`/api/media/${filename}`, {
            method: 'DELETE'
        })
        .then(res => res.json())
        .then(data => {
            if (data.success) {
                setImages(prev => prev.filter(img => img.name !== filename));
            }
        });
    };

    const copyToClipboard = (path, name) => {
        navigator.clipboard.writeText(path).then(() => {
            setCopiedId(name);
            setTimeout(() => setCopiedId(null), 2000);
        });
    };

    const formatBytes = (bytes, decimals = 0) => {
        if (!+bytes) return '0 Bytes';
        const k = 1024;
        const dm = decimals < 0 ? 0 : decimals;
        const sizes = ['Bytes', 'KB', 'MB', 'GB'];
        const i = Math.floor(Math.log(bytes) / Math.log(k));
        return `${parseFloat((bytes / Math.pow(k, i)).toFixed(dm))} ${sizes[i]}`;
    };

    return (
        <div className="space-y-6 animate-fade-in">
            <div className="flex justify-between items-center">
                <h2 className="text-2xl font-bold text-gray-800">{t('media.title')}</h2>
                <div className="text-sm text-gray-500">
                    {images.length} items
                </div>
            </div>

            {/* Upload Area */}
            <div 
                className={`border-2 border-dashed rounded-xl p-8 text-center transition-colors ${
                    dragActive ? 'border-blue-500 bg-blue-50' : 'border-gray-300 hover:border-blue-400'
                }`}
                onDragEnter={handleDrag}
                onDragLeave={handleDrag}
                onDragOver={handleDrag}
                onDrop={handleDrop}
            >
                <div className="flex flex-col items-center gap-3">
                    <div className="p-4 bg-gray-100 rounded-full text-gray-400">
                        {uploading ? (
                            <div className="animate-spin w-8 h-8 border-4 border-blue-500 border-t-transparent rounded-full"></div>
                        ) : (
                            <Upload size={32} />
                        )}
                    </div>
                    <p className="text-gray-600 font-medium">
                        {uploading ? 'Uploading...' : t('media.dragDrop')}
                    </p>
                    <input 
                        type="file" 
                        className="hidden" 
                        id="file-upload"
                        onChange={(e) => e.target.files[0] && handleUpload(e.target.files[0])}
                        accept="image/*"
                    />
                    <label 
                        htmlFor="file-upload"
                        className="px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors cursor-pointer text-sm font-medium"
                    >
                        {t('media.upload')}
                    </label>
                </div>
            </div>

            {/* Image Grid */}
            {loading ? (
                <div className="text-center py-12 text-gray-400">{t('common.loading')}</div>
            ) : images.length === 0 ? (
                <div className="text-center py-12 text-gray-400">{t('media.empty')}</div>
            ) : (
                <div className="grid grid-cols-2 md:grid-cols-4 lg:grid-cols-5 gap-4">
                    {images.map((img) => (
                        <div key={img.name} className="group relative bg-white rounded-xl shadow-sm border border-gray-100 overflow-hidden hover:shadow-md transition-shadow">
                            <div className="aspect-square bg-gray-100 overflow-hidden flex items-center justify-center">
                                <img 
                                    src={`http://localhost:3001${img.path}`} // Using backend port for preview if needed, or relative if proxied
                                    onError={(e) => {e.target.onerror = null; e.target.src=`${img.path}`}} // Fallback to direct path
                                    alt={img.name} 
                                    className="w-full h-full object-cover transition-transform group-hover:scale-105"
                                    loading="lazy"
                                />
                            </div>
                            
                            <div className="p-3">
                                <p className="text-sm font-medium text-gray-800 truncate" title={img.name}>{img.name}</p>
                                <p className="text-xs text-gray-400 mt-1">{formatBytes(img.size)}</p>
                            </div>

                            {/* Overlay Actions */}
                            <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex flex-col justify-end p-3">
                                <div className="flex gap-2 justify-end">
                                    <button 
                                        onClick={() => copyToClipboard(img.path, img.name)}
                                        className="p-2 bg-white text-gray-700 rounded-lg hover:bg-blue-500 hover:text-white transition-colors shadow-sm"
                                        title="Copy Path"
                                    >
                                        {copiedId === img.name ? <Check size={16} /> : <Copy size={16} />}
                                    </button>
                                    <button 
                                        onClick={() => handleDelete(img.name)}
                                        className="p-2 bg-white text-red-600 rounded-lg hover:bg-red-500 hover:text-white transition-colors shadow-sm"
                                        title="Delete"
                                    >
                                        <Trash2 size={16} />
                                    </button>
                                </div>
                            </div>
                        </div>
                    ))}
                </div>
            )}
        </div>
    );
}
