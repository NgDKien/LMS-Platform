'use client';
import { CreateNewLabel } from './CreateNewLabel';
import { LabelList } from './LabelList';
import { useState } from 'react';

interface Props {
    projectId: string;
    initialLabels: ICustomFieldData[];
}

export const LabelsContainer = ({ projectId, initialLabels }: Props) => {
    const [labels, setLabels] = useState(initialLabels);

    const handleLabelCreated = (newLabel: ICustomFieldData) => {
        setLabels((prev) => [...prev, newLabel]);
    };

    const handleLabelUpdated = (updatedLabel: ICustomFieldData) => {
        setLabels((prev) =>
            prev.map((label) => (label.id === updatedLabel.id ? updatedLabel : label))
        );
    };

    const handleLabelDeleted = (labelId: string) => {
        setLabels((prev) => prev.filter((label) => label.id !== labelId));
    };

    return (
        <div className="w-full space-y-6">
            <CreateNewLabel
                projectId={projectId}
                onLabelCreated={handleLabelCreated}
            />

            <div className="bg-muted/20 dark:bg-gray-900 rounded-2xl shadow-sm border border-gray-800 transition-all">
                <div className="flex items-center justify-between p-4 border-b border-gray-700">
                    <h2 className="text-sm font-medium text-gray-300">
                        {labels.length} {labels.length === 1 ? 'Label' : 'Labels'}
                    </h2>
                </div>

                <LabelList
                    labels={labels}
                    onLabelUpdated={handleLabelUpdated}
                    onLabelDeleted={handleLabelDeleted}
                />
            </div>
        </div>
    );
};
