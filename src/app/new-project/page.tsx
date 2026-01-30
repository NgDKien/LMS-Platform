'use client'
import { Separator } from '@/components/ui/separator';
import { NewProjectForm } from './NewProjectForm';

export default function NewProjectPage() {
    return (
        <div className="min-h-screen bg-[#030712] text-gray-100 py-8 px-6">
            <div className="mx-auto max-w-5xl">
                <header className="mb-10 text-center md:text-left">
                    <h1 className="text-5xl font-extrabold tracking-tight bg-gradient-to-r from-indigo-400 via-sky-400 to-violet-400 bg-clip-text text-transparent">
                        Tạo dự án mới của bạn
                    </h1>
                    <p className="mt-3 text-base md:text-lg text-gray-300 max-w-2xl leading-relaxed">
                        Thiết lập nhanh — xác định cấu trúc dự án, nhãn mặc định và cài đặt quy trình làm việc ở cùng một nơi.
                    </p>
                </header>


                <Separator className="my-8 border-gray-800" />

                <NewProjectForm />
            </div>
        </div>
    );
}
