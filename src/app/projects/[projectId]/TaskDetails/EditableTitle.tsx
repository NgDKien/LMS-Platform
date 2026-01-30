import { secondaryBtnStyles, successBtnStyles } from '@/app/commonStyles';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { cn } from '@/lib/utils';
import { Check, X, Edit3, Loader2 } from 'lucide-react';
import { Dispatch, SetStateAction, useState } from 'react';

interface Props {
    title: string;
    isEditing: boolean;
    setIsEditing: Dispatch<SetStateAction<boolean>>;
    onSave: (newTitle: string) => Promise<void>;
}

export const EditableTitle = ({
    title,
    isEditing,
    setIsEditing,
    onSave,
}: Props) => {
    const [text, setText] = useState(title);
    const [isSaving, setIsSaving] = useState(false);

    const handleSave = async () => {
        try {
            setIsSaving(true);
            await onSave(text);
            setIsEditing(false);
        } catch (error) {
            console.error('Failed to save title:', error);
            // Optionally add error handling UI here
        } finally {
            setIsSaving(false);
        }
    };

    const handleCancel = () => {
        setText(title); // Reset to original title
        setIsEditing(false);
    };

    const handleKeyDown = (e: React.KeyboardEvent) => {
        if (e.key === 'Enter') {
            handleSave();
        } else if (e.key === 'Escape') {
            handleCancel();
        }
    };

    if (isEditing) {
        return (
            <div className="flex items-center space-x-3 w-full">
                <div className="flex-1">
                    <Input
                        type="text"
                        value={text}
                        onChange={(e) => setText(e.target.value)}
                        onKeyDown={handleKeyDown}
                        className="h-12 bg-slate-800/50 border-slate-700 focus:border-blue-500 focus:ring-2 focus:ring-blue-500/20 text-white text-lg font-semibold placeholder-slate-500 rounded-lg transition-all"
                        placeholder="Enter task title..."
                        disabled={isSaving}
                        autoFocus
                    />
                </div>
                <div className="flex items-center space-x-2">
                    <Button
                        onClick={handleSave}
                        className="h-10 px-4 bg-blue-600 hover:bg-blue-700 text-white rounded-lg transition-all shadow-lg shadow-blue-500/20 hover:shadow-blue-500/30 disabled:opacity-50 disabled:cursor-not-allowed flex items-center space-x-2"
                        disabled={isSaving || !text.trim()}
                    >
                        {isSaving ? (
                            <>
                                <Loader2 className="w-4 h-4 animate-spin" />
                                <span className="hidden sm:inline">Saving...</span>
                            </>
                        ) : (
                            <>
                                <Check className="w-4 h-4" />
                                <span className="hidden sm:inline">Lưu</span>
                            </>
                        )}
                    </Button>
                    <Button
                        onClick={handleCancel}
                        className="h-10 px-4 bg-slate-700/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-600 rounded-lg transition-all flex items-center space-x-2"
                        disabled={isSaving}
                    >
                        <X className="w-4 h-4" />
                        <span className="hidden sm:inline">Hủy</span>
                    </Button>
                </div>
            </div>
        );
    }

    return (
        <div className="flex items-center space-x-4 w-full group">
            <h1
                title={title}
                className="text-left text-white text-lg sm:text-xl md:text-2xl lg:text-3xl font-bold flex-grow truncate tracking-tight"
            >
                {text}
            </h1>
            <Button
                onClick={() => setIsEditing(true)}
                className="h-9 px-4 bg-slate-800/50 hover:bg-slate-700 text-slate-300 hover:text-white border border-slate-700 hover:border-slate-600 rounded-lg transition-all opacity-0 group-hover:opacity-100 flex items-center space-x-2 shadow-sm"
            >
                <Edit3 className="w-4 h-4" />
                <span className="hidden md:inline">Edit</span>
            </Button>
        </div>
    );
};