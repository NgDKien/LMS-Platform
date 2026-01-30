'use client';

import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { ChevronDown } from 'lucide-react';

interface ProjectListHeaderProps {
    tab: 'active' | 'all' | 'closed';
    count: number;
    sortOrder: 'newest' | 'oldest';
    onSort?: (order: 'newest' | 'oldest') => void;
}

export const ProjectListHeader = ({
    tab,
    count,
    sortOrder,
    onSort,
}: ProjectListHeaderProps) => (
    <div className="flex justify-between items-center rounded bg-[#182446] p-6">
        <div>
            <span className="text-sm">
                {tab === 'active' && `Dự án đang hoạt động (${count})`}
                {tab === 'closed' && `Dự án đã đóng (${count})`}
                {tab === 'all' && `Tất cả dự án (${count})`}
            </span>
        </div>
        <DropdownMenu>
            <DropdownMenuTrigger className="flex items-center">
                <span className="text-sm">Sắp xếp</span>
                <ChevronDown className="w-4 h-4 ml-1" />
            </DropdownMenuTrigger>
            <DropdownMenuContent className='bg-[#0f172d] border border-[#2C2F3A] text-white'>
                <DropdownMenuItem onClick={() => onSort?.('newest')}>
                    Mới nhất {sortOrder === 'newest' && '✓'}
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => onSort?.('oldest')}>
                    Cũ nhất {sortOrder === 'oldest' && '✓'}
                </DropdownMenuItem>
            </DropdownMenuContent>
        </DropdownMenu>
    </div>
);