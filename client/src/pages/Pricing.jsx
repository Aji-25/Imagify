import React, { useContext, useState, useEffect } from 'react';
import { AppContext } from '../context/AppContext';

export default function Pricing() {
    const { user, credit, addCredits, setShowLogin } = useContext(AppContext);
    const [activePlan, setActivePlan] = useState(null);

    // Load active plan from localStorage on mount
    useEffect(() => {
        const savedActivePlan = localStorage.getItem('imagify_active_plan');
        if (savedActivePlan) {
            setActivePlan(savedActivePlan);
        }
    }, []);

    // Save active plan to localStorage whenever it changes
    useEffect(() => {
        if (activePlan) {
            localStorage.setItem('imagify_active_plan', activePlan);
        } else {
            localStorage.removeItem('imagify_active_plan');
        }
    }, [activePlan]);

    const plans = [
        {
            id: 'basic',
            name: 'Basic',
            price: 10,
            credits: 100,
            features: ['100 AI Generations', 'High Quality Images', 'Download & Share'],
            popular: false
        },
        {
            id: 'advanced',
            name: 'Advanced',
            price: 50,
            credits: 500,
            features: ['500 AI Generations', 'High Quality Images', 'Download & Share', 'Priority Support'],
            popular: true
        },
        {
            id: 'business',
            name: 'Business',
            price: 250,
            credits: 2500,
            features: ['2500 AI Generations', 'High Quality Images', 'Download & Share', 'Priority Support', 'API Access'],
            popular: false
        }
    ];

    const handlePurchase = (plan) => {
        if (!user) {
            setShowLogin(true);
            return;
        }

        // Add credits immediately
        addCredits(plan.credits);
        
        // Set as the only active plan (replaces any previous active plan)
        setActivePlan(plan.id);
    };

    const isPlanActive = (planId) => activePlan === planId;

    return (
        <div className="min-h-screen py-12 bg-gray-50">
            <div className="max-w-6xl mx-auto px-4">
                {/* Header */}
                <div className="text-center mb-12">
                    <h1 className="text-4xl font-bold text-gray-900 mb-4">
                        Choose Your Plan
                    </h1>
                    <p className="text-xl text-gray-600">
                        Get credits to generate amazing AI images
                    </p>
                </div>

                {/* Plans Grid */}
                <div className="grid grid-cols-1 md:grid-cols-3 gap-8 mb-12">
                    {plans.map((plan) => (
                        <div
                            key={plan.id}
                            className={`bg-white rounded-lg shadow-md p-6 transition-all duration-300 hover:shadow-xl hover:scale-105 hover:border-2 hover:border-blue-500 ${
                                plan.popular ? 'ring-2 ring-blue-500' : ''
                            }`}
                        >
                            {plan.popular && (
                                <div className="bg-blue-500 text-white text-sm font-medium px-3 py-1 rounded-full text-center mb-4">
                                    Most Popular
                                </div>
                            )}
                            
                            <h3 className="text-2xl font-bold text-gray-900 mb-2">{plan.name}</h3>
                            <div className="mb-4">
                                <span className="text-4xl font-bold text-gray-900">${plan.price}</span>
                                <span className="text-gray-600"> / one-time</span>
                            </div>
                            
                            <ul className="space-y-3 mb-6">
                                {plan.features.map((feature, index) => (
                                    <li key={index} className="flex items-center text-gray-700">
                                        <span className="text-green-500 mr-2">✓</span>
                                        {feature}
                                    </li>
                                ))}
                            </ul>
                            
                            <button
                                onClick={() => handlePurchase(plan)}
                                disabled={isPlanActive(plan.id)}
                                className={`w-full py-3 px-6 rounded-lg font-medium transition-colors ${
                                    isPlanActive(plan.id)
                                        ? 'bg-green-500 text-white cursor-default'
                                        : 'bg-blue-600 hover:bg-blue-700 text-white'
                                }`}
                            >
                                {isPlanActive(plan.id) ? 'Active Plan' : 'Get Started'}
                            </button>
                        </div>
                    ))}
                </div>

                {/* Current Credits */}
                {user && (
                    <div className="bg-white rounded-lg shadow-md p-6 text-center">
                        <h3 className="text-xl font-semibold text-gray-900 mb-2">
                            Your Current Credits
                        </h3>
                        <p className="text-3xl font-bold text-blue-600">{credit}</p>
                        <p className="text-gray-600 mt-2">credits remaining</p>
                    </div>
                )}

                {/* FAQ Section */}
                <div className="mt-12">
                    <h2 className="text-2xl font-bold text-gray-900 text-center mb-8">
                        Frequently Asked Questions
                    </h2>
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-2">How do credits work?</h3>
                            <p className="text-gray-600">Each AI image generation costs 1 credit. Credits never expire.</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-2">Can I get a refund?</h3>
                            <p className="text-gray-600">Credits are non-refundable once purchased.</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-2">What image quality do I get?</h3>
                            <p className="text-gray-600">All plans generate high-quality 512x512 pixel images.</p>
                        </div>
                        <div className="bg-white rounded-lg p-6 shadow-md">
                            <h3 className="font-semibold text-gray-900 mb-2">Do credits expire?</h3>
                            <p className="text-gray-600">No, your credits will never expire.</p>
                        </div>
                    </div>
                </div>
            </div>
        </div>
    );
}
