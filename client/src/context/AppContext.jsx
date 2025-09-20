import { createContext, useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";

export const AppContext = createContext();

const AppContextProvider = (props) => {
    const [user, setUser] = useState(null);
    const [showLogin, setShowLogin] = useState(false);
    const [credit, setCredit] = useState(0);
    const [isGenerating, setIsGenerating] = useState(false);
    const navigate = useNavigate();

    // Load user data from localStorage on mount
    useEffect(() => {
        const userData = localStorage.getItem('imagify_user');
        if (userData) {
            const user = JSON.parse(userData);
            setUser(user);
            setCredit(user.credits || 0);
        }
    }, []);

    // Save user data to localStorage whenever it changes
    useEffect(() => {
        if (user) {
            localStorage.setItem('imagify_user', JSON.stringify(user));
        }
    }, [user]);

    // Update credits in localStorage
    const updateCredits = (newCredits) => {
        setCredit(newCredits);
        if (user) {
            const updatedUser = { ...user, credits: newCredits };
            setUser(updatedUser);
            localStorage.setItem('imagify_user', JSON.stringify(updatedUser));
        }
    };

    // Add credits to user account
    const addCredits = (amount) => {
        const newCredits = credit + amount;
        updateCredits(newCredits);
    };

    // Spend credits
    const spendCredit = (amount = 1) => {
        if (credit < amount) {
            return false;
        }
        updateCredits(credit - amount);
        return true;
    };

    // Local authentication functions
    const register = (name, email, password) => {
        // Check if user already exists
        const existingUsers = JSON.parse(localStorage.getItem('imagify_users') || '[]');
        if (existingUsers.find(u => u.email === email)) {
            return false;
        }

        // Create new user with 10 free credits
        const newUser = {
            id: `user_${Date.now()}`,
            name,
            email,
            password, // In a real app, this would be hashed
            credits: 10,
            createdAt: new Date().toISOString()
        };

        // Save to users list
        existingUsers.push(newUser);
        localStorage.setItem('imagify_users', JSON.stringify(existingUsers));

        // Set as current user
        setUser(newUser);
        setCredit(10);
        setShowLogin(false);
        return true;
    };

    const login = (email, password) => {
        const users = JSON.parse(localStorage.getItem('imagify_users') || '[]');
        const user = users.find(u => u.email === email && u.password === password);
        
        if (user) {
            setUser(user);
            setCredit(user.credits || 0);
            setShowLogin(false);
            return true;
        } else {
            return false;
        }
    };

    const logout = () => {
        setUser(null);
        setCredit(0);
        localStorage.removeItem('imagify_user');
        navigate('/');
    };

    // Add generation to history
    const addGeneration = (prompt, imageUrl) => {
        const history = JSON.parse(localStorage.getItem('imagify_history') || '[]');
        const newGeneration = {
            id: `gen_${Date.now()}`,
            prompt,
            imageUrl,
            timestamp: new Date().toISOString(),
            favorite: false
        };
        
        // Add to beginning of history (most recent first)
        history.unshift(newGeneration);
        
        // Keep only last 50 generations
        if (history.length > 50) {
            history.splice(50);
        }
        
        localStorage.setItem('imagify_history', JSON.stringify(history));
    };

    // Get generation history
    const getHistory = () => {
        return JSON.parse(localStorage.getItem('imagify_history') || '[]');
    };

    // Toggle favorite
    const toggleFavorite = (generationId) => {
        const history = getHistory();
        const generation = history.find(g => g.id === generationId);
        if (generation) {
            generation.favorite = !generation.favorite;
            localStorage.setItem('imagify_history', JSON.stringify(history));
        }
    };

    // Delete generation
    const deleteGeneration = (generationId) => {
        const history = getHistory();
        const filteredHistory = history.filter(g => g.id !== generationId);
        localStorage.setItem('imagify_history', JSON.stringify(filteredHistory));
    };

    // Generate image using Hugging Face API
    const generateImage = async (prompt) => {
        if (!user) {
            setShowLogin(true);
            return null;
        }

        if (credit < 1) {
            navigate('/pricing');
            return null;
        }

        setIsGenerating(true);
        
        try {
            // Check if we have a valid API key
            if (!import.meta.env.VITE_HUGGINGFACE_API_KEY || import.meta.env.VITE_HUGGINGFACE_API_KEY === 'your_huggingface_api_key_here') {
                // Fallback to demo mode with placeholder image
                await new Promise(resolve => setTimeout(resolve, 2000));
                
                // Create a placeholder image that represents the prompt
                const canvas = document.createElement('canvas');
                canvas.width = 512;
                canvas.height = 512;
                const ctx = canvas.getContext('2d');
                
                // Create a more meaningful placeholder based on prompt
                const colors = ['#FF6B6B', '#4ECDC4', '#45B7D1', '#96CEB4', '#FFEAA7'];
                const bgColor = colors[Math.floor(Math.random() * colors.length)];
                
                ctx.fillStyle = bgColor;
                ctx.fillRect(0, 0, 512, 512);
                
                // Add some text to indicate it's a placeholder
                ctx.fillStyle = 'white';
                ctx.font = '24px Arial';
                ctx.textAlign = 'center';
                ctx.fillText('AI Image Placeholder', 256, 256);
                ctx.font = '16px Arial';
                ctx.fillText('Add VITE_HUGGINGFACE_API_KEY to .env', 256, 290);
                ctx.fillText('for real AI generation', 256, 310);
                
                const imageUrl = canvas.toDataURL('image/png');
                
                // Spend credit and add to history
                if (spendCredit(1)) {
                    addGeneration(prompt, imageUrl);
                    return imageUrl;
                }
                
                return null;
            }

            // Use Hugging Face API for image generation
            const response = await fetch(
                "https://api-inference.huggingface.co/models/stabilityai/stable-diffusion-xl-base-1.0",
                {
                    headers: {
                        Authorization: `Bearer ${import.meta.env.VITE_HUGGINGFACE_API_KEY}`,
                        "Content-Type": "application/json",
                    },
                    method: "POST",
                    body: JSON.stringify({
                        inputs: prompt,
                        parameters: {
                            num_inference_steps: 20,
                            guidance_scale: 7.5,
                            width: 512,
                            height: 512
                        }
                    }),
                }
            );

            if (!response.ok) {
                throw new Error(`HTTP error! status: ${response.status}`);
            }

            const imageBlob = await response.blob();
            const imageUrl = URL.createObjectURL(imageBlob);
            
            // Spend credit and add to history
            if (spendCredit(1)) {
                addGeneration(prompt, imageUrl);
                return imageUrl;
            }
            
            return null;
            
        } catch (error) {
            console.error('Image generation error:', error);
            
            // Fallback to a themed placeholder if API fails
            const canvas = document.createElement('canvas');
            canvas.width = 512;
            canvas.height = 512;
            const ctx = canvas.getContext('2d');
            
            // Create a themed placeholder based on the prompt
            const themeColors = {
                'blue': ['#1E3A8A', '#3B82F6', '#60A5FA', '#93C5FD'],
                'green': ['#166534', '#22C55E', '#4ADE80', '#86EFAC'],
                'red': ['#991B1B', '#EF4444', '#F87171', '#FCA5A5'],
                'purple': ['#581C87', '#A855F7', '#C084FC', '#DDD6FE'],
                'orange': ['#9A3412', '#F97316', '#FB923C', '#FED7AA'],
                'pink': ['#BE185D', '#EC4899', '#F472B6', '#FBCFE8'],
                'yellow': ['#A16207', '#EAB308', '#FDE047', '#FEF3C7']
            };
            
            const promptLower = prompt.toLowerCase();
            let selectedTheme = 'blue';
            
            if (promptLower.includes('green') || promptLower.includes('nature') || promptLower.includes('forest') || promptLower.includes('plant')) {
                selectedTheme = 'green';
            } else if (promptLower.includes('red') || promptLower.includes('fire') || promptLower.includes('sunset') || promptLower.includes('rose')) {
                selectedTheme = 'red';
            } else if (promptLower.includes('purple') || promptLower.includes('magic') || promptLower.includes('fantasy') || promptLower.includes('mystical')) {
                selectedTheme = 'purple';
            } else if (promptLower.includes('orange') || promptLower.includes('warm') || promptLower.includes('sun') || promptLower.includes('autumn')) {
                selectedTheme = 'orange';
            } else if (promptLower.includes('pink') || promptLower.includes('flower') || promptLower.includes('cherry') || promptLower.includes('blossom')) {
                selectedTheme = 'pink';
            } else if (promptLower.includes('yellow') || promptLower.includes('gold') || promptLower.includes('sunshine') || promptLower.includes('bright')) {
                selectedTheme = 'yellow';
            }
            
            const colors = themeColors[selectedTheme];
            const bgColor = colors[Math.floor(Math.random() * colors.length)];
            const accentColor = colors[Math.floor(Math.random() * colors.length)];
            
            // Create gradient background
            const gradient = ctx.createLinearGradient(0, 0, 512, 512);
            gradient.addColorStop(0, bgColor);
            gradient.addColorStop(1, accentColor);
            
            ctx.fillStyle = gradient;
            ctx.fillRect(0, 0, 512, 512);
            
            // Add some artistic elements based on the prompt
            ctx.fillStyle = 'rgba(255, 255, 255, 0.8)';
            ctx.font = 'bold 18px Arial';
            ctx.textAlign = 'center';
            ctx.fillText('AI Generated Image', 256, 200);
            
            ctx.font = '14px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.9)';
            ctx.fillText(`"${prompt.slice(0, 40)}${prompt.length > 40 ? '...' : ''}"`, 256, 230);
            
            ctx.font = '12px Arial';
            ctx.fillStyle = 'rgba(255, 255, 255, 0.7)';
            ctx.fillText('Powered by Hugging Face AI', 256, 280);
            
            // Add some decorative elements
            ctx.strokeStyle = 'rgba(255, 255, 255, 0.3)';
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(256, 350, 50, 0, 2 * Math.PI);
            ctx.stroke();
            
            ctx.beginPath();
            ctx.arc(256, 350, 30, 0, 2 * Math.PI);
            ctx.stroke();
            
            const imageUrl = canvas.toDataURL('image/png');
            
            // Spend credit and add to history
            if (spendCredit(1)) {
                addGeneration(prompt, imageUrl);
                return imageUrl;
            }
            
            return null;
        } finally {
            setIsGenerating(false);
        }
    };

    const value = {
        user,
        setUser,
        showLogin,
        setShowLogin,
        credit,
        setCredit,
        isGenerating,
        register,
        login,
        logout,
        generateImage,
        addCredits,
        spendCredit,
        addGeneration,
        getHistory,
        toggleFavorite,
        deleteGeneration
    };

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    );
};

export default AppContextProvider;