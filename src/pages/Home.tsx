import React from 'react';
import { ProjectGrid } from '../components/ProjectGrid';
import { CategoryFilter } from '../components/CategoryFilter';
import { Category } from '../types';
import { useProjects } from '../hooks/useProjects';

export function Home() {
  const [selectedCategory, setSelectedCategory] = React.useState<Category>('all');
  const { projects, loading } = useProjects();

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <CategoryFilter
        selectedCategory={selectedCategory}
        onCategoryChange={setSelectedCategory}
      />
      <ProjectGrid
        projects={projects}
        selectedCategory={selectedCategory}
      />
    </div>
  );
}