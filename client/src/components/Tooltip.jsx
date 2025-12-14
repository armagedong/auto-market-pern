// client/src/components/Tooltip.jsx

import React, { useState } from 'react';

const Tooltip = ({ children, content }) => {
    const [isVisible, setIsVisible] = useState(false);

    if (!content) return children;

    return (
        <div
            className="relative inline-flex items-center"
            onMouseEnter={() => setIsVisible(true)}
            onMouseLeave={() => setIsVisible(false)}
        >
            {children}

            {/* Иконка 'i' для активации подсказки */}
            <div className="ml-2 text-gray-400 hover:text-blue-400 transition cursor-help">
                <svg className="w-4 h-4" fill="none" stroke="currentColor" viewBox="0 0 24 24" xmlns="http://www.w3.org/2000/svg"><path strokeLinecap="round" strokeLinejoin="round" strokeWidth="2" d="M13 16h-1v-4h-1m1-4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z"></path></svg>
            </div>

            {/* Выпадающее окно подсказки */}
            {isVisible && (
                <div
                    className="absolute z-40 top-full mt-2 w-64 p-3 bg-gray-900 border border-gray-700 rounded-lg shadow-xl text-xs text-gray-300 font-inter"
                    style={{ left: '100%', transform: 'translateX(-50%)' }}
                >
                    {content}
                </div>
            )}
        </div>
    );
};

export default Tooltip;