'use client';
import { cn } from '@/lib/utils';
import { Check, RefreshCcw } from 'lucide-react';
import { useState } from 'react';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Card } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
    Popover,
    PopoverContent,
    PopoverTrigger,
} from '@/components/ui/popover';
import { labelColors } from '@/consts/colors';
import { motion } from 'framer-motion';

const defaultColor = labelColors[1];

interface Props {
    mode?: 'create' | 'edit';
    data?: ICustomFieldData;
    save?: (data: ICustomFieldData) => void;
    cancel?: () => void;
    isSubmitting?: boolean;
}

export const CreateOrEditLabelForm = ({
    mode = 'create',
    data,
    cancel,
    save,
    isSubmitting,
}: Props) => {
    const [labelName, setLabelName] = useState(data?.label || '');
    const [description, setDescription] = useState(data?.description || '');
    const [color, setColor] = useState(data?.color || defaultColor);

    function isValidHexColor(code: string) {
        const hexColorPattern = /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/;
        return hexColorPattern.test(code);
    }

    function selectRandomColor() {
        const randomIndex = Math.floor(Math.random() * labelColors.length);
        setColor(labelColors[randomIndex]);
    }

    return (
        <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            className="max-w-[420px] w-full"
        >
            <Card className="p-5 bg-gray-900/70 border border-gray-800 rounded-2xl shadow-md backdrop-blur-sm">
                {/* Preview */}
                <div className="flex justify-between items-center mb-5">
                    <Badge
                        className="py-1 px-4 rounded-full text-sm font-medium text-white"
                        style={{ backgroundColor: color }}
                    >
                        {labelName || 'Label preview'}
                    </Badge>
                    <span className="text-xs text-gray-400 uppercase tracking-wide">
                        {mode === 'edit' ? 'Edit mode' : 'Create new label'}
                    </span>
                </div>

                {/* Form fields */}
                <div className="space-y-4 mb-5">
                    <div className="flex flex-col space-y-2">
                        <Label className="text-gray-300">Label name</Label>
                        <Input
                            placeholder="Enter label name"
                            className="bg-gray-800 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                            value={labelName}
                            onChange={(e) => setLabelName(e.currentTarget.value)}
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label className="text-gray-300">Description</Label>
                        <Input
                            placeholder="Short description (optional)"
                            className="bg-gray-800 border-gray-700 focus:ring-indigo-500 focus:border-indigo-500 text-white"
                            value={description}
                            onChange={(e) => setDescription(e.currentTarget.value)}
                        />
                    </div>

                    <div className="flex flex-col space-y-2">
                        <Label className="text-gray-300">Color</Label>
                        <div className="flex items-center gap-3">
                            <Button
                                type="button"
                                size="icon"
                                onClick={selectRandomColor}
                                className="h-9 w-9 flex items-center justify-center rounded-md text-white"
                                style={{ backgroundColor: color }}
                            >
                                <RefreshCcw className="h-4 w-4" />
                            </Button>
                            <Popover>
                                <PopoverTrigger asChild>
                                    <Input
                                        placeholder="#000000"
                                        value={color}
                                        onChange={(e) => setColor(e.currentTarget.value)}
                                        className={cn(
                                            'w-[110px] bg-gray-800 border-gray-700 h-9 text-sm text-gray-300 focus:ring-indigo-500 focus:border-indigo-500',
                                            !isValidHexColor(color) && 'ring-red-500'
                                        )}
                                    />
                                </PopoverTrigger>
                                <PopoverContent
                                    className="flex justify-center flex-wrap gap-2 bg-gray-900 border border-gray-700 p-3 z-50"
                                    sideOffset={8}
                                >
                                    {labelColors.map((labelColor) => (
                                        <Button
                                            key={labelColor}
                                            onClick={() => setColor(labelColor)}
                                            className={cn(
                                                'w-8 h-8 rounded-md border border-transparent',
                                                labelColor === color &&
                                                'ring-2 ring-indigo-400 ring-offset-1 ring-offset-gray-900'
                                            )}
                                            style={{ backgroundColor: labelColor }}
                                        >
                                            {labelColor === color && (
                                                <Check className="w-4 h-4 text-white" />
                                            )}
                                        </Button>
                                    ))}
                                </PopoverContent>
                            </Popover>
                        </div>
                    </div>
                </div>

                {/* Actions */}
                <div className="flex justify-end gap-3 pt-4 border-t border-gray-800">
                    <Button
                        variant="outline"
                        onClick={() => cancel?.()}
                        className="bg-transparent border-gray-700 text-gray-300 hover:bg-gray-800"
                    >
                        Cancel
                    </Button>
                    <Button
                        onClick={() =>
                            save?.({
                                id: mode === 'edit' ? data?.id! : crypto.randomUUID(),
                                label: labelName,
                                description,
                                color,
                            })
                        }
                        disabled={!isValidHexColor(color) || !labelName.trim() || isSubmitting}
                        className="bg-indigo-600 hover:bg-indigo-700 text-white shadow-sm"
                    >
                        {isSubmitting
                            ? 'Submitting...'
                            : mode === 'edit'
                                ? 'Update Label'
                                : 'Create Label'}
                    </Button>
                </div>
            </Card>
        </motion.div>
    );
};
