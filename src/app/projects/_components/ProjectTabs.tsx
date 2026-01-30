'use client';

import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { PanelsTopLeft, SquareKanban } from 'lucide-react';
import SearchAndButton from '../Search';
import { ProjectList } from '../ProjectList';

interface ProjectTabsProps {
  activeProjects: IProject[];
  closedProjects: IProject[];
  allProjects: IProject[];
  searchTerm: string;
  setSearchTerm?: (term: string) => void;
  sortOrder: 'newest' | 'oldest';
  onSort?: (order: 'newest' | 'oldest') => void;
  setProjectToClose?: (id: string) => void;
  setProjectToReopen?: (id: string) => void;
  setProjectToDelete?: (project: IProject) => void;
}

export const ProjectTabs = ({
  activeProjects,
  closedProjects,
  allProjects,
  searchTerm,
  setSearchTerm,
  sortOrder,
  onSort,
  setProjectToClose,
  setProjectToReopen,
  setProjectToDelete,
}: ProjectTabsProps) => (
  <Tabs defaultValue="active-projects">
    <TabsList className="bg-[#182446] text-[#afafaf] rounded">
      <TabsTrigger value="active-projects">
        <PanelsTopLeft className="w-4 h-4 mr-2" />
        <span>Dự án đang hoạt động</span>
      </TabsTrigger>
      <TabsTrigger value="closed-projects">
        <SquareKanban className="w-4 h-4 mr-2" />
        <span>Dự án đã đóng</span>
      </TabsTrigger>
      <TabsTrigger value="all-projects">
        <SquareKanban className="w-4 h-4 mr-2" />
        <span>Tất cả dự án</span>
      </TabsTrigger>
    </TabsList>

    <TabsContent value="active-projects">
      <SearchAndButton
        placeholderText="Tìm kiếm các dự án đang hoạt động"
        onSearch={setSearchTerm}
      />
      <ProjectList
        tab="active"
        projects={activeProjects}
        sortOrder={sortOrder}
        onSort={onSort}
        setProjectToClose={setProjectToClose}
        setProjectToReopen={setProjectToReopen}
        setProjectToDelete={setProjectToDelete}
      />
    </TabsContent>
    <TabsContent value="closed-projects">
      <SearchAndButton
        placeholderText="Tìm kiếm các dự án đã đóng"
        onSearch={setSearchTerm}
      />
      <ProjectList
        tab="closed"
        projects={closedProjects}
        sortOrder={sortOrder}
        onSort={onSort}
        setProjectToClose={setProjectToClose}
        setProjectToReopen={setProjectToReopen}
        setProjectToDelete={setProjectToDelete}
      />
    </TabsContent>
    <TabsContent value="all-projects">
      <SearchAndButton
        placeholderText="Search all projects"
        onSearch={setSearchTerm}
      />
      <ProjectList
        tab="all"
        projects={allProjects}
        sortOrder={sortOrder}
        onSort={onSort}
        setProjectToClose={setProjectToClose}
        setProjectToReopen={setProjectToReopen}
        setProjectToDelete={setProjectToDelete}
      />
    </TabsContent>
  </Tabs>
);