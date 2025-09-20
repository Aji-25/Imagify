import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

export default function History() {
    const { user, getHistory, toggleFavorite, deleteGeneration, setShowLogin } = useContext(AppContext);
    const [history, setHistory] = useState([]);
    const [filter, setFilter] = useState('all'); // all, favorites
    const [searchTerm, setSearchTerm] = useState('');

    useEffect(() => {
        if (user) {
            const userHistory = getHistory();
            setHistory(userHistory);
        }
    }, [user, getHistory]);

    const filteredHistory = history.filter(generation => {
        const matchesFilter = filter === 'all' || (filter === 'favorites' && generation.favorite);
        const matchesSearch = generation.prompt.toLowerCase().includes(searchTerm.toLowerCase());
        return matchesFilter && matchesSearch;
    });

    const handleToggleFavorite = (generationId) => {
        toggleFavorite(generationId);
        // Refresh history
        const updatedHistory = getHistory();
        setHistory(updatedHistory);
    };

    const handleDelete = (generationId) => {
        if (window.confirm('Are you sure you want to delete this generation?')) {
            deleteGeneration(generationId);
            // Refresh history
            const updatedHistory = getHistory();
            setHistory(updatedHistory);
        }
    };

    const handleDownload = (imageUrl, prompt) => {
        const link = document.createElement('a');
        link.href = imageUrl;
        link.download = `imagify-${prompt.slice(0, 20)}.png`;
        document.body.appendChild(link);
        link.click();
        document.body.removeChild(link);
    };

    const copyToClipboard = (text) => {
        navigator.clipboard.writeText(text);
        // You could add a toast notification here
    };

    if (!user) {
        return (
            <div className="min-h-screen flex items-center justify-center">
                <div className="text-center">
                    <h2 className="text-2xl font-bold text-gray-800 mb-4">Please Login</h2>
                    <p className="text-gray-600 mb-6">You need to be logged in to view your generation history.</p>
                    <button 
                        onClick={() => setShowLogin(true)}
                        className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium"
                    >
                        Login
                    </button>
                </div>
            </div>
        );
    }

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-7xl mx-auto px-4">
                {/* Header */}
                <div className="mb-8">
                    <h1 className="text-4xl font-bold text-gray-800 mb-4">Generation History</h1>
                    <p className="text-gray-600 text-lg">
                        Your AI-generated images and prompts
                    </p>
                </div>

                {/* Controls */}
                <div className="bg-white rounded-2xl shadow-lg p-6 mb-8">
                    <div className="flex flex-col sm:flex-row gap-4 items-center justify-between">
                        <div className="flex gap-4">
                            <button
                                onClick={() => setFilter('all')}
                                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                    filter === 'all'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                All ({history.length})
                            </button>
                            <button
                                onClick={() => setFilter('favorites')}
                                className={`px-4 py-2 rounded-full font-medium transition-colors ${
                                    filter === 'favorites'
                                        ? 'bg-blue-600 text-white'
                                        : 'bg-gray-100 text-gray-700 hover:bg-gray-200'
                                }`}
                            >
                                Favorites ({history.filter(g => g.favorite).length})
                            </button>
                        </div>
                        
                        <div className="relative">
                            <input
                                type="text"
                                placeholder="Search prompts..."
                                value={searchTerm}
                                onChange={(e) => setSearchTerm(e.target.value)}
                                className="pl-10 pr-4 py-2 border border-gray-300 rounded-full focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <svg className="w-5 h-5 text-gray-400 absolute left-3 top-1/2 transform -translate-y-1/2" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M21 21l-6-6m2-5a7 7 0 11-14 0 7 7 0 0114 0z" />
                            </svg>
                        </div>
                    </div>
                </div>

                {/* History Grid */}
                {filteredHistory.length === 0 ? (
                    <div className="text-center py-16">
                        <div className="w-24 h-24 bg-gray-100 rounded-full mx-auto mb-4 flex items-center justify-center">
                            <svg className="w-12 h-12 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M4 16l4.586-4.586a2 2 0 012.828 0L16 16m-2-2l1.586-1.586a2 2 0 012.828 0L20 14m-6-6h.01M6 20h12a2 2 0 002-2V6a2 2 0 00-2-2H6a2 2 0 00-2 2v12a2 2 0 002 2z" />
                            </svg>
                        </div>
                        <h3 className="text-xl font-semibold text-gray-800 mb-2">No images yet</h3>
                        <p className="text-gray-600 mb-6">
                            {filter === 'favorites' 
                                ? "You haven't favorited any images yet."
                                : "Start generating images to see them here!"
                            }
                        </p>
                        {filter === 'all' && (
                            <a
                                href="/generate"
                                className="bg-blue-600 hover:bg-blue-700 text-white px-6 py-3 rounded-full font-medium inline-block"
                            >
                                Generate Your First Image
                            </a>
                        )}
                    </div>
                ) : (
                    <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
                        {filteredHistory.map((generation) => (
                            <div key={generation.id} className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition-shadow">
                                {/* Image */}
                                <div className="relative group">
                                    <img 
                                        src={generation.imageUrl} 
                                        alt={generation.prompt}
                                        className="w-full h-48 object-cover"
                                    />
                                    
                                    {/* Overlay Actions */}
                                    <div className="absolute inset-0 bg-black/50 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center gap-2">
                                        <button
                                            onClick={() => handleDownload(generation.imageUrl, generation.prompt)}
                                            className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                                            title="Download"
                                        >
                                            <img src={assets.download_icon} alt="Download" className="w-5 h-5" />
                                        </button>
                                        <button
                                            onClick={() => copyToClipboard(generation.prompt)}
                                            className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors"
                                            title="Copy Prompt"
                                        >
                                            <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2m-6-4l2 2 4-4" />
                                            </svg>
                                        </button>
                                    </div>

                                    {/* Favorite Button */}
                                    <button
                                        onClick={() => handleToggleFavorite(generation.id)}
                                        className={`absolute top-2 left-2 p-2 rounded-full transition-colors ${
                                            generation.favorite
                                                ? 'bg-red-500 text-white'
                                                : 'bg-white/90 hover:bg-white text-gray-600'
                                        }`}
                                        title={generation.favorite ? 'Remove from favorites' : 'Add to favorites'}
                                    >
                                        <svg className="w-5 h-5" fill={generation.favorite ? 'currentColor' : 'none'} stroke="currentColor" viewBox="0 0 24 24">
                                            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={generation.favorite ? 0 : 2} d="M4.318 6.318a4.5 4.5 0 000 6.364L12 20.364l7.682-7.682a4.5 4.5 0 00-6.364-6.364L12 7.636l-1.318-1.318a4.5 4.5 0 00-6.364 0z" />
                                        </svg>
                                    </button>

                                    {/* Menu Button */}
                                    <div className="absolute top-2 right-2">
                                        <div className="relative group">
                                            <button className="bg-white/90 hover:bg-white p-2 rounded-full transition-colors">
                                                <svg className="w-5 h-5 text-gray-700" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 5v.01M12 12v.01M12 19v.01M12 6a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2zm0 7a1 1 0 110-2 1 1 0 010 2z" />
                                                </svg>
                                            </button>
                                            
                                            {/* Dropdown Menu */}
                                            <div className="absolute right-0 top-full mt-2 w-32 bg-white rounded-lg shadow-lg border opacity-0 invisible group-hover:opacity-100 group-hover:visible transition-all z-10">
                                                <button
                                                    onClick={() => handleDownload(generation.imageUrl, generation.prompt)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 rounded-t-lg flex items-center gap-2"
                                                >
                                                    <img src={assets.download_icon} alt="Download" className="w-4 h-4" />
                                                    Download
                                                </button>
                                                <button
                                                    onClick={() => copyToClipboard(generation.prompt)}
                                                    className="w-full text-left px-4 py-2 text-sm text-gray-700 hover:bg-gray-100 flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M8 16H6a2 2 0 01-2-2V6a2 2 0 012-2h8a2 2 0 012 2v8a2 2 0 01-2 2h-2m-6-4l2 2 4-4" />
                                                    </svg>
                                                    Copy Prompt
                                                </button>
                                                <button
                                                    onClick={() => handleDelete(generation.id)}
                                                    className="w-full text-left px-4 py-2 text-sm text-red-600 hover:bg-red-50 rounded-b-lg flex items-center gap-2"
                                                >
                                                    <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                                                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 7l-.867 12.142A2 2 0 0116.138 21H7.862a2 2 0 01-1.995-1.858L5 7m5 4v6m4-6v6m1-10V4a1 1 0 00-1-1h-4a1 1 0 00-1 1v3M4 7h16" />
                                                    </svg>
                                                    Delete
                                                </button>
                                            </div>
                                        </div>
                                    </div>
                                </div>

                                {/* Content */}
                                <div className="p-4">
                                    <p className="text-sm text-gray-700 line-clamp-2 mb-2">
                                        {generation.prompt}
                                    </p>
                                    <p className="text-xs text-gray-500">
                                        {new Date(generation.timestamp).toLocaleDateString()}
                                    </p>
                                </div>
                            </div>
                        ))}
                    </div>
                )}
            </div>
        </div>
    );
}
