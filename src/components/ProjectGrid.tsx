import React from 'react';
import { Link } from 'react-router-dom';
import { Project } from '../types';

interface ProjectGridProps {
  projects: Project[];
  selectedCategory: string;
}

export function ProjectGrid({ projects, selectedCategory }: ProjectGridProps) {
  const filteredProjects = selectedCategory === 'all'
    ? projects
    : projects.filter(project => {
        if (!project.categories) return false;
        return project.categories.includes(selectedCategory);
      });

  const sortedProjects = [...filteredProjects].sort((a, b) => 
    (a.order || Number.MAX_SAFE_INTEGER) - (b.order || Number.MAX_SAFE_INTEGER)
  );

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
      {sortedProjects.map((project) => (
        <Link
          key={project.id}
          to={`/project/${project.id}`}
          className="group"
        >
          <div className="aspect-square overflow-hidden rounded-lg">
            <img
              src={project.coverImage}
              alt={project.title}
              className="object-cover w-full h-full transition-transform duration-500 group-hover:scale-105"
            />
          </div>
          <div className="mt-2">
            <h3 className="text-white text-lg font-light">{project.title}</h3>
            <p className="text-zinc-400 text-sm mt-0.5">{project.year}</p>
          </div>
        </Link>
      ))}
    </div>
  );
}