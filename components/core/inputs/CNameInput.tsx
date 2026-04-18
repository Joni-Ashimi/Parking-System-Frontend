import React from 'react';
import {FaUser} from "react-icons/fa";
import CInput, {CInputProps} from "@/components/core/inputs/CInput";

const CNameInput = ({ value, onChange, ...props }: CInputProps) => {
    return (
        <CInput
            value={value}
            onChange={onChange}
            type='text'
            appendIcon={<FaUser className="absolute left-3 top-3 text-gray-400" />}
            {...props}
        />
    );
};

export default CNameInput;