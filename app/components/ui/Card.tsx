import { ReactNode } from 'react';

interface CardProps {
    title: string;
    icon?: ReactNode;
    iconColor?: string;
    children: ReactNode;
    className?: string;
    titleColor?: string;
}

export function Card({ 
    title, 
    icon, 
    iconColor = "text-green-600",
    children, 
    className = "", 
    titleColor = "text-gray-800" 
}: CardProps) {
    return (
        <div className={`bg-gray-50 p-4 rounded-xl print:bg-white border border-gray-100 ${className}`}>
            <h2 className={`text-sm font-semibold ${titleColor} mb-3 flex items-center`}>
                {icon && (
                    <span className={`h-4 w-4 mr-2 ${iconColor}`}>
                        {icon}
                    </span>
                )}
                {title}
            </h2>
            <div className="space-y-2 text-sm">
                {children}
            </div>
        </div>
    );
} 