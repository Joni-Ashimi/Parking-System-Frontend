import type {TableColumnsType, TableProps} from 'antd';
import {Input, Table} from 'antd';
import React, {useEffect, useMemo, useState} from 'react';
import _ from 'lodash';


const isArrayEmpty = (value: any): boolean => {
    if (Array.isArray(value)) return value.length === 0;
    if (value && typeof value === 'object') return Object.keys(value).length === 0;
    return !value;
};


interface TableParams {
    page: number;
    pageSize: number;
    qs: string;
}

type TableSelectData<T> = {
    selectedRowKeys: React.Key[];
    selectedRows: T[];
};

interface TableRecord {
    id: string | number;
}

interface DataTableProps<T> {
    columns: TableColumnsType<T>;
    data: T[];
    getData: (tableParams: TableParams) => void;
    defaultPage?: number;
    defaultPageSize?: number;
    pageSizeOptions?: Array<number>;
    total?: number;
    allowSearch?: boolean;
    allowFilter?: boolean;
    selectionType?: 'checkbox' | 'radio' | null;
    onRowSelect?:
        | React.Dispatch<React.SetStateAction<TableSelectData<T>>>
        | ((data: TableSelectData<T>) => void);
    extraDependencies?: Array<any>;
    defaultSelectedRows?: React.Key[];
    headerContent?: React.ReactNode;
    showCount?: boolean;
    onDefaultSelect?: (found: boolean) => void;
    title?: string;
}

const CustomTable = <T extends TableRecord>({
                                                columns,
                                                data,
                                                getData,
                                                defaultPage = 1,
                                                defaultPageSize = 10,
                                                pageSizeOptions = [10, 20, 30],
                                                total,
                                                allowSearch = false,
                                                selectionType,
                                                onRowSelect,
                                                extraDependencies = [],
                                                defaultSelectedRows,
                                                headerContent,
                                                showCount = false,
                                                onDefaultSelect,
                                                title,
                                            }: DataTableProps<T>) => {
    const [page, setPage] = useState(defaultPage);
    const [pageSize, setPageSize] = useState(defaultPageSize);
    const [isLoading, setIsLoading] = useState(false);
    const [searchTerm, setSearchTerm] = useState('');
    const [selectedRowKeys, setSelectedRowKeys] = useState<React.Key[]>([]);

    const onChange: TableProps<T>['onChange'] = (pagination, filters, sorter, extra) => {
        setPage(pagination.current || defaultPage);
        setPageSize(Number(pagination.pageSize) || defaultPageSize);
    };

    const rowSelection: TableProps<T>['rowSelection'] = !!selectionType
        ? {
            type: selectionType,
            selectedRowKeys,
            onChange: (newSelectedRowKeys: React.Key[], selectedRows: T[]) => {
                setSelectedRowKeys(newSelectedRowKeys);
                if (onRowSelect) {
                    onRowSelect({selectedRowKeys: newSelectedRowKeys, selectedRows});
                }
            },
        }
        : undefined;

    const pagination = useMemo(() => {
        return {
            current: page,
            pageSize,
            total,
            pageSizeOptions,
            showSizeChanger: true,
        };
    }, [page, pageSize, pageSizeOptions, total]);

    useEffect(() => {
        setIsLoading(true);
        getData({page, pageSize, qs: searchTerm});
        setIsLoading(false);
    }, [page, pageSize, searchTerm, ...extraDependencies]);

    const handleRowClick = (record: T) => {
        setSelectedRowKeys([record.id]);
        if (onRowSelect) {
            onRowSelect({selectedRowKeys: [record.id], selectedRows: [record]});
        }
    };

    useEffect(() => {
        if (
            defaultSelectedRows &&
            !isArrayEmpty(defaultSelectedRows) &&
            defaultSelectedRows.length !== selectedRowKeys.length
        ) {
            setSelectedRowKeys(defaultSelectedRows);
            if (onDefaultSelect) onDefaultSelect(true);
        }
    }, [defaultSelectedRows]);

    const search = _.debounce((e: string) => {
        setSearchTerm(e || '');
    }, 300);

    return (
        <div>
            {title && (
                <div className="px-6 pt-4 pb-3 text-sm font-semibold text-gray-700">
                    {title}
                </div>
            )}

            {allowSearch && (
                <div className="flex items-center justify-between px-6 pb-3">
                    <Input.Search
                        placeholder="Search..."
                        allowClear
                        onChange={(e) => search(e.target.value)}
                        style={{width: 300}}
                    />
                    {headerContent && <div>{headerContent}</div>}
                </div>
            )}

            <Table<T>
                columns={columns}
                dataSource={data}
                onChange={onChange}
                showSorterTooltip={{target: 'sorter-icon'}}
                rowKey="id"
                loading={isLoading}
                pagination={pagination}
                rowSelection={rowSelection}
                onRow={(record) => ({
                    onClick: () => handleRowClick(record),
                    style: {cursor: 'pointer'},
                })}
            />

            {showCount && (
                <div className="px-6 py-2 text-sm text-gray-500">
                    {selectedRowKeys.length} selected
                </div>
            )}
        </div>
    );
};

export default CustomTable;