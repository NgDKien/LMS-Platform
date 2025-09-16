import { createClient } from '@/utils/supabase/server';
import { redirect } from 'next/navigation';
import { ProjectSettingsForm } from './ProjectSettingsForm';
import { SettingsLayout } from './SettingLayout';
import { auth } from '@clerk/nextjs/server';

interface Props {
    params: { projectId: string };
}

export default async function SettingsPage({ params }: Props) {
    const { projectId } = params;
    const supabase = await createClient();

    const { userId } = await auth();
    if (!userId) redirect('/login');

    const { data: project, error } = await supabase
        .from('projects')
        .select('*')
        .eq('id', projectId)
        .single();

    if (error || !project) redirect('/projects');

    return (
        <SettingsLayout title="Project Settings">
            <ProjectSettingsForm project={project} />
        </SettingsLayout>
    );
}