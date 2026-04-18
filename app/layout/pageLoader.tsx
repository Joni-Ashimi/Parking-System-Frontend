'use client';

import { useSelector } from 'react-redux';
import { RootState } from '@/store/store';

const PageLoader = () => {
    const show = useSelector((state: RootState) => state.loading.show);
    const message = useSelector((state: RootState) => state.loading.message);

    if (!show) return null;

    return (
        <div className="fixed inset-0 bg-white/70 backdrop-blur-sm flex flex-col items-center justify-center z-50">
            <div className="animate-spin rounded-full h-12 w-12 border-t-4 border-purple-600 border-solid"></div>
            <p className="mt-3 text-lg text-gray-700 font-medium">
                {message || 'Loading...'}
            </p>
        </div>
    );
};

export default PageLoader;