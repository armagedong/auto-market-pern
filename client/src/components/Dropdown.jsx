// client/src/components/Dropdown.jsx

import React, { useState, useEffect, useRef } from 'react';

const Dropdown = ({
                      children,
                      items = [],
                      position = 'bottom', // 'bottom', 'top', 'left', 'right'
                      width = 'w-48',
                      trigger = 'click', // 'click' или 'hover'
                      onSelect
                  }) => {
    const [isOpen, setIsOpen] = useState(false);
    const dropdownRef = useRef(null);

    // Закрытие при клике вне компонента
    useEffect(() => {
        const handleClickOutside = (event) => {
            if (dropdownRef.current && !dropdownRef.current.contains(event.target)) {
                setIsOpen(false);
            }
        };

        if (isOpen) {
            document.addEventListener('mousedown', handleClickOutside);
        }

        return () => {
            document.removeEventListener('mousedown', handleClickOutside);
        };
    }, [isOpen]);

    const handleTrigger = () => {
        if (trigger === 'click') {
            setIsOpen(!isOpen);
        }
    };

    const handleMouseEnter = () => {
        if (trigger === 'hover') {
            setIsOpen(true);
        }
    };

    const handleMouseLeave = () => {
        if (trigger === 'hover') {
            setIsOpen(false);
        }
    };

    const handleItemClick = (item, index) => {
        if (onSelect) {
            onSelect(item, index);
        }
        setIsOpen(false);
    };

    // Определяем позицию выпадающего списка
    const getPositionClasses = () => {
        switch (position) {
            case 'top':
                return 'bottom-full mb-2';
            case 'left':
                return 'right-full mr-2 top-0';
            case 'right':
                return 'left-full ml-2 top-0';
            default: // bottom
                return 'top-full mt-2';
        }
    };

    return (
        <div
            ref={dropdownRef}
            className="relative inline-block"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {/* Триггер (кнопка или другой элемент) */}
            <div
                onClick={handleTrigger}
                className="cursor-pointer"
            >
                {children}
            </div>

            {/* Выпадающий список */}
            {isOpen && items.length > 0 && (
                <div
                    className={`absolute z-40 ${getPositionClasses()} ${width} bg-gray-900 border border-gray-700 rounded-lg shadow-xl overflow-hidden`}
                >
                    <div className="py-1">
                        {items.map((item, index) => (
                            <div
                                key={index}
                                onClick={() => handleItemClick(item, index)}
                                className="px-4 py-2 text-sm text-gray-300 hover:bg-gray-800 hover:text-white cursor-pointer transition-colors duration-150 font-inter"
                            >
                                {typeof item === 'object' ? item.label : item}
                            </div>
                        ))}
                    </div>
                </div>
            )}
        </div>
    );
};

export default Dropdown;