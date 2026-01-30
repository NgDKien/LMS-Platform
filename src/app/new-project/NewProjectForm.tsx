'use client';

import TextEditor from '@/components/TextEditor';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Textarea } from '@/components/ui/textarea';
import { useState } from 'react';
import { CreateProjectModal } from './CreateProjectModal';
import { motion } from 'framer-motion';

export function NewProjectForm() {
    const [name, setName] = useState('');
    const [description, setDescription] = useState('');
    const [readme, setReadme] = useState('');

    return (
        <motion.div
            initial={{ opacity: 0, y: 6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.32 }}
            className="grid grid-cols-1 lg:grid-cols-3 gap-8"
        >
            {/* Left column - main inputs */}
            <div className="lg:col-span-2 space-y-6">
                <div className="bg-[#0e0e0e] backdrop-blur-sm border border-[#202020] rounded-2xl p-6 shadow-[0_6px_30px_rgba(4,8,15,0.6)]">
                    <h2 className="text-xl font-semibold">Chi tiết dự án</h2>
                    <p className="mt-1 text-sm text-gray-300">
                        Tên, giới thiệu ngắn và README tùy chọn để khởi động dự án.
                    </p>

                    <div className="mt-6 grid grid-cols-1 gap-4">
                        <div>
                            <Label className="text-sm text-gray-200">Tên dự án</Label>
                            <Input
                                className="mt-2 bg-transparent border border-white/10 focus:border-indigo-400 focus:ring-indigo-400 text-white placeholder-gray-400 h-11 rounded-md"
                                placeholder="Nhập tên dự án"
                                value={name}
                                onChange={(e) => setName(e.currentTarget.value)}
                            />
                        </div>

                        <div>
                            <Label className="text-sm text-gray-200">Giới thiệu ngắn</Label>
                            <Textarea
                                className="mt-2 bg-transparent border border-white/10 focus:border-indigo-400 focus:ring-indigo-400 text-white placeholder-gray-400 rounded-md p-3"
                                placeholder="Một dòng giới thiệu ngắn về dự án"
                                value={description}
                                onChange={(e) => setDescription(e.currentTarget.value)}
                                rows={4}
                            />
                        </div>

                        <div>
                            <Label className="text-sm text-gray-200">README (không bắt buộc)</Label>
                            <div className="mt-2 border border-white/6 rounded-lg overflow-hidden">
                                <TextEditor content={readme} onChange={setReadme} isEditable />
                            </div>
                        </div>
                    </div>
                </div>


            </div>

            {/* Right column - actions / summary */}
            <aside className="space-y-6">
                <div className=" top-24 bg-[#0e0e0e] border border-[#202020] rounded-2xl p-5 shadow-[0_8px_30px_rgba(4,8,15,0.45)]">
                    <h4 className="text-lg font-semibold">Sẵn sàng tiếp tục</h4>
                    <p className="mt-2 text-sm text-gray-300">Xem lại các thông tin mặc định để tạo dự án.</p>

                    <div className="mt-4">
                        <dl className="text-sm text-gray-300 space-y-2">
                            <div className="flex justify-between">
                                <dt className="text-gray-400">Tên</dt>
                                <dd className="font-medium truncate max-w-[10rem]">{name || '—'}</dd>
                            </div>
                            <div className="flex justify-between">
                                <dt className="text-gray-400">Mô tả</dt>
                                <dd className="font-medium truncate max-w-[10rem]">{description || '—'}</dd>
                            </div>
                        </dl>
                    </div>

                    <div className="mt-6">
                        <CreateProjectModal projectDetails={{ name, description, readme }} />
                    </div>
                </div>
                {/* Extra info or future sections */}
                <div className="bg-white/3 backdrop-blur-sm border border-[#202020] rounded-2xl p-6">
                    <h3 className="text-sm font-medium text-gray-200">Mẹo</h3>
                    <p className="mt-2 text-sm text-gray-400">
                        Bạn có thể tùy chỉnh độ lớn, độ ưu tiên, trạng thái và các nhãn trong dự án ở bước tiếp theo.
                    </p>
                </div>
            </aside>
        </motion.div>
    );
}
