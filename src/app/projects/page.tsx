import { createClient } from '@/utils/supabase/server';
import { users, type IUser } from '@/utils/users';
// import { AccountDetails } from './AccountDetails';
import { Projects } from './Projects';
import { redirect } from 'next/navigation';
import { projects } from '@/utils/projects';
import { auth, currentUser } from "@clerk/nextjs/server";

export default async function ProjectsPage() {
  const supabase = await createClient();

  // const {
  //   data: { user },
  // } = await supabase.auth.getUser();
  // if (!user) redirect('/login');

  // const userData = await users.getUser(user.id);
  // if (!userData) redirect('/login');

  const { userId } = await auth();
  console.log(userId)
  if (!userId) redirect('/login');

  const clerkUser = await currentUser();
  if (!clerkUser) redirect('/login');

  const userProjects = await projects.getUserProjects(userId);

  return (
    <div className="flex flex-col md:flex-row ml-4 mr-4 gap-4">
      <div className="flex-1">
        <Projects initialProjects={userProjects} />
      </div>
    </div>
  );
}