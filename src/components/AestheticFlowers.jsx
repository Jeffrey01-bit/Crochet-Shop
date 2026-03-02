import React from 'react';
import './AestheticFlowers.css';

const FlowerList = [
    { id: 1, top: '5%', left: '8%', size: '90px', rotate: '15deg', opacity: 0.35, animationDelay: '0s', color: 'var(--accent-color)' },
    { id: 2, top: '25%', left: '88%', size: '140px', rotate: '-25deg', opacity: 0.25, animationDelay: '2s', color: '#ffd1dc' },
    { id: 3, top: '55%', left: '6%', size: '110px', rotate: '45deg', opacity: 0.4, animationDelay: '1s', color: '#f5ddd8' },
    { id: 4, top: '85%', left: '85%', size: '80px', rotate: '-10deg', opacity: 0.3, animationDelay: '3s', color: 'var(--accent-color)' },
    { id: 5, top: '40%', left: '70%', size: '60px', rotate: '80deg', opacity: 0.2, animationDelay: '1.5s', color: '#ffecf0' },
    { id: 6, top: '75%', left: '30%', size: '150px', rotate: '120deg', opacity: 0.15, animationDelay: '2.5s', color: '#e8ece2' },
];

const AestheticFlowers = () => {
    return (
        <div className="flowers-container">
            {FlowerList.map(flower => (
                <div
                    key={flower.id}
                    className="flower"
                    style={{
                        top: flower.top,
                        left: flower.left,
                        width: flower.size,
                        height: flower.size,
                        opacity: flower.opacity,
                        animationDelay: flower.animationDelay,
                        color: flower.color,
                        '--base-rotate': flower.rotate
                    }}
                >
                    <svg viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg" width="100%" height="100%">
                        <path fill="currentColor" opacity="0.8" d="M50 15 C 40 0, 20 15, 30 35 C 40 55, 50 50, 50 50 C 50 50, 60 55, 70 35 C 80 15, 60 0, 50 15 Z" />
                        <path fill="currentColor" opacity="0.8" d="M85 50 C 100 40, 85 20, 65 30 C 45 40, 50 50, 50 50 C 50 50, 45 60, 65 70 C 85 80, 100 60, 85 50 Z" />
                        <path fill="currentColor" opacity="0.8" d="M50 85 C 60 100, 80 85, 70 65 C 60 45, 50 50, 50 50 C 50 50, 40 45, 30 65 C 20 85, 40 100, 50 85 Z" />
                        <path fill="currentColor" opacity="0.8" d="M15 50 C 0 60, 15 80, 35 70 C 55 60, 50 50, 50 50 C 50 50, 55 40, 35 30 C 15 20, 0 40, 15 50 Z" />
                        <circle cx="50" cy="50" r="12" fill="rgba(255,253,247,0.8)" />
                    </svg>
                </div>
            ))}
        </div>
    );
};

export default AestheticFlowers;
