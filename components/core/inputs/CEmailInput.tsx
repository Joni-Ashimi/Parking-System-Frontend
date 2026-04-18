import React from 'react';
import { FaEnvelope } from 'react-icons/fa';
import CInput, {CInputProps} from "@/components/core/inputs/CInput";

const CEmailInput = ({ value, onChange, ...props }: CInputProps) => {
    return (
        <CInput
            value={value}
            onChange={onChange}
            appendIcon={<FaEnvelope className="absolute left-3 top-3 text-gray-400" />}
            {...props}
        />
    );
};

export default CEmailInput;