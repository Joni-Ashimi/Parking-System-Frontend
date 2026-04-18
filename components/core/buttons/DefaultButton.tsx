import React from 'react';

export interface DefaultButtonProps extends React.ButtonHTMLAttributes<HTMLButtonElement> {
    label: any;
    textColor?: string;
    color?: string;
    hoverColor?: string;
    isLoading?: boolean;
}

const DefaultButton = ({
                           className,
                           label,
                           textColor = 'text-white',
                           color = 'bg-purple-600',
                           hoverColor = 'hover:bg-purple-700',
                           isLoading = false,
                           disabled,
                           ...props
                       }: DefaultButtonProps) => {
    return (
        <button
            {...props}
            disabled={disabled || isLoading}
            className={`disabled:cursor-default cursor-pointer group relative w-full flex items-center justify-center py-3 px-4 border border-transparent text-sm font-medium rounded-lg ${textColor} ${color} ${hoverColor} focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-purple-500 ${className}`}>
            {isLoading && (
                <div className="w-4 h-4 border-2 border-t-transparent border-white rounded-full animate-spin mr-2" />
            )}
            {label}
        </button>
    );
};

export default DefaultButton;