import React, { useState, useEffect } from 'react';
import { useLanguage } from '../context/LanguageContext';
import { Cloud, Check, Loader2, GitBranch, AlertCircle, ArrowUpCircle } from 'lucide-react';

export default function GitControl() {
    const { t } = useLanguage();
    const [status, setStatus] = useState({ hasChanges: false, changes: [], branch: '-' });
    const [loading, setLoading] = useState(false);
    const [syncing, setSyncing] = useState(false);
    const [message, setMessage] = useState('');

    const checkStatus = () => {
        setLoading(true);
        fetch('/api/git/status')
            .then(res => res.json())
            .then(data => {
                setStatus(data);
                setLoading(false);
            })
            .catch(err => {
                console.error(err);
                setLoading(false);
            });
    };

    useEffect(() => {
        checkStatus();
        const interval = setInterval(checkStatus, 30000); // Check every 30s
        return () => clearInterval(interval);
    }, []);

    const handleSync = () => {
        if (!status.hasChanges) return;
        
        setSyncing(true);
        fetch('/api/git/sync', { 
            method: 'POST',
            headers: { 'Content-Type': 'application/json' }
        })
            .then(res => res.json())
            .then(data => {
                if (data.success) {
                    setMessage(t('git.success'));
                    setTimeout(() => setMessage(''), 3000);
                    checkStatus();
                } else {
                    alert(t('git.error') + ': ' + data.error);
                }
            })
            .catch(err => alert(t('git.error')))
            .finally(() => setSyncing(false));
    };

    return (
        <div className="p-4 mx-4 mt-auto mb-4 bg-gray-50 rounded-xl border border-gray-200">
            <div className="flex items-center justify-between mb-2">
                <span className="text-xs font-semibold text-gray-500 uppercase flex items-center gap-1">
                    <Cloud size={12} />
                    {t('git.status')}
                </span>
                <span className="text-xs text-blue-500 flex items-center gap-1 bg-blue-50 px-2 py-0.5 rounded-full border border-blue-100">
                    <GitBranch size={10} />
                    {status.branch}
                </span>
            </div>

            {loading ? (
                <div className="flex items-center gap-2 text-sm text-gray-500 py-2">
                    <Loader2 size={16} className="animate-spin" />
                    Checking...
                </div>
            ) : status.hasChanges ? (
                <div className="space-y-3">
                    <div className="text-sm text-gray-700 flex items-center gap-2">
                        <AlertCircle size={16} className="text-amber-500" />
                        <span>{t('git.hasChanges', { count: status.changes.length })}</span>
                    </div>
                    <button
                        onClick={handleSync}
                        disabled={syncing}
                        className={`w-full flex items-center justify-center gap-2 py-2 px-3 rounded-lg text-sm font-medium transition-all ${
                            syncing 
                                ? 'bg-gray-100 text-gray-400 cursor-not-allowed'
                                : 'bg-blue-600 text-white hover:bg-blue-700 shadow-sm hover:shadow-md'
                        }`}
                    >
                        {syncing ? (
                            <>
                                <Loader2 size={16} className="animate-spin" />
                                {t('git.syncing')}
                            </>
                        ) : (
                            <>
                                <ArrowUpCircle size={16} />
                                {t('git.syncNow')}
                            </>
                        )}
                    </button>
                </div>
            ) : (
                <div className="flex items-center gap-2 text-sm text-green-600 py-2">
                    <Check size={16} />
                    <span>{t('git.noChanges')}</span>
                </div>
            )}
            
            {message && (
                <div className="mt-2 text-xs text-center text-green-600 font-medium animate-fade-in">
                    {message}
                </div>
            )}
        </div>
    );
}
