import React from 'react';
import { FaLock } from 'react-icons/fa';
import CInput, {CInputProps} from "@/components/core/inputs/CInput";

const CPasswordInput = (props: CInputProps) => {
    return (
        <CInput
            type="password"
            appendIcon={<FaLock className="absolute left-3 top-3 text-gray-400" />}
            {...props}
        />
    );
};

export default CPasswordInput;