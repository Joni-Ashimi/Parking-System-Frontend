import React from 'react';

export interface CInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label?: string;
    appendIcon?: React.ReactNode;
}

const CInput = ({ label, value, appendIcon, className, ...props }: CInputProps) => {
    return (
        <div>
            {label && (
                <label htmlFor={props.id} className="block text-sm font-medium text-gray-700">
                    {label}
                </label>
            )}
            <div className="mt-1 relative">
                <input
                    type="email"
                    className={`appearance-none block w-full px-3 py-2 pl-10 border border-gray-300 rounded-lg placeholder-gray-400 focus:outline-none focus:ring-purple-500 focus:border-purple-500 ${className}`}
                    value={value}
                    {...props}
                />
                {appendIcon}
            </div>
        </div>
    );
};

export default CInput;