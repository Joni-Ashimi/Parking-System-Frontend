import React from 'react';
import DefaultButton, {DefaultButtonProps} from "@/components/core/buttons/DefaultButton";

interface GradientButtonProps extends DefaultButtonProps {
    fromColor?: string;
    toColor?: string;
    hoverFromColor?: string;
    hoverToColor?: string;
}

const GradientButton: React.FC<GradientButtonProps> = ({
                                                           fromColor = 'from-purple-600',
                                                           toColor = 'to-blue-500',
                                                           hoverFromColor = 'hover:from-purple-700',
                                                           hoverToColor = 'hover:to-blue-600',
                                                           className = '',
                                                           ...props
                                                       }) => {
    return (
        <DefaultButton
            {...props}
            className={`bg-gradient-to-r ${fromColor} ${toColor} ${hoverFromColor} ${hoverToColor} ${className}`}
        />
    );
};

export default GradientButton;