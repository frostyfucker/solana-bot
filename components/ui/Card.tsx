
import React from 'react';

interface CardProps extends React.HTMLAttributes<HTMLDivElement> {
    children: React.ReactNode;
}

const Card: React.FC<CardProps> = ({ children, className = '', ...props }) => {
    const baseStyles = 'bg-gray-800/50 backdrop-blur-lg border rounded-lg shadow-lg';
    const combinedClassName = `${baseStyles} ${className}`;

    return (
        <div className={combinedClassName} {...props}>
            {children}
        </div>
    );
};

export default Card;