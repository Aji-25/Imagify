import React, { useContext, useState } from 'react';
import { AppContext } from '../context/AppContext';
import { assets } from '../assets/assets';

export default function Generate() {
    const { user, credit, generateImage, isGenerating, setShowLogin } = useContext(AppContext);
    const [prompt, setPrompt] = useState('');
    const [recentImage, setRecentImage] = useState(null);

    const handleGenerate = async () => {
        if (!prompt.trim()) {
            return;
        }

        const imageUrl = await generateImage(prompt);
        if (imageUrl) {
            setRecentImage({
                imageUrl,
                prompt: prompt
            });
            setPrompt('');
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

    return (
        <div className="min-h-screen py-8">
            <div className="max-w-4xl mx-auto px-4">
                {/* Main Generation Area */}
                <div className="bg-white rounded-2xl shadow-lg p-8 mb-8">
                    {/* Generated Image Display */}
                    <div className="mb-8 text-center">
                        <h3 className="text-xl font-semibold text-gray-800 mb-4">
                            {recentImage ? 'Your Generated Image' : 'Sample Generated Image'}
                        </h3>
                        <div className="relative inline-block">
                            <img 
                                src={recentImage ? recentImage.imageUrl : assets.sample_img_1} 
                                alt={recentImage ? recentImage.prompt : "Sample AI Generated Image"}
                                className="max-w-full h-auto rounded-lg shadow-md"
                                style={{ maxHeight: '400px' }}
                            />
                            <div className="absolute bottom-2 left-2 bg-black/70 text-white px-3 py-1 rounded-full text-sm">
                                "{recentImage ? recentImage.prompt : 'A majestic dragon flying over a mystical forest'}"
                            </div>
                            {recentImage && (
                                <button
                                    onClick={() => handleDownload(recentImage.imageUrl, recentImage.prompt)}
                                    className="absolute top-2 right-2 bg-white/90 hover:bg-white p-2 rounded-full shadow-md transition-all"
                                >
                                    <img src={assets.download_icon} alt="Download" className="w-5 h-5" />
                                </button>
                            )}
                        </div>
                        <p className="text-gray-600 mt-3 text-sm">
                            {recentImage ? 'Your AI-generated image!' : 'This is an example of what AI can create. Try your own prompt below!'}
                        </p>
                    </div>

                    {/* Loading State */}
                    {isGenerating && (
                        <div className="text-center mb-8">
                            <div className="text-2xl text-gray-600 mb-4">Loading.....</div>
                        </div>
                    )}

                    {/* Generation Form */}
                    <div className="space-y-6">
                        <div className="flex items-center gap-4">
                            <input
                                value={prompt}
                                onChange={(e) => setPrompt(e.target.value)}
                                placeholder="Describe what you want to generate"
                                className="flex-1 px-6 py-3 border border-gray-300 rounded-full text-lg focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
                            />
                            <button
                                onClick={handleGenerate}
                                disabled={isGenerating || !prompt.trim()}
                                className="bg-black hover:bg-gray-800 text-white px-8 py-3 rounded-full text-lg font-medium transition-all disabled:opacity-50 disabled:cursor-not-allowed"
                            >
                                Generate
                            </button>
                        </div>

                        {/* Generate Button for non-logged in users */}
                        {!user && (
                            <div className="text-center">
                                <button
                                    onClick={() => setShowLogin(true)}
                                    className="bg-blue-600 hover:bg-blue-700 text-white px-8 py-3 rounded-full text-lg font-medium transition-colors"
                                >
                                    Login to Generate
                                </button>
                            </div>
                        )}

                        {/* Credit status */}
                        {user && credit <= 0 && (
                            <div className="text-center space-y-3">
                                <button disabled className="bg-gray-400 text-white px-8 py-3 rounded-full text-lg font-medium cursor-not-allowed">
                                    No Credits Left
                                </button>
                                <div>
                                    <a 
                                        href="/pricing" 
                                        className="text-blue-600 hover:text-blue-700 text-sm underline"
                                    >
                                        Get Credits →
                                    </a>
                                </div>
                            </div>
                        )}
                    </div>
                </div>
            </div>
        </div>
    );
}
