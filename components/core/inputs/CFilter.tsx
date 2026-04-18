import { FaFilter } from 'react-icons/fa';

interface CFilterProps {
    filter: string;
    onFilterChange: (filter: string) => void;
}

const CFilter = ({ filter, onFilterChange }: CFilterProps) => {
    return (
        <div className="flex items-center space-x-2">
            <FaFilter className="text-gray-500" />
            <select
                className="border border-gray-300 rounded-lg px-3 py-2 focus:outline-none focus:ring-2 focus:ring-purple-500"
                value={filter}
                onChange={(e) => onFilterChange(e.target.value)}>
                <option value="all">All Auctions</option>
                <option value="active">Active</option>
                <option value="pending">Pending</option>
                <option value="finished">Finished</option>
            </select>
        </div>
    );
};

export default CFilter;