import React from 'react';
import { useParams, Link } from 'react-router-dom';
import { ArrowLeft } from 'lucide-react';
import { useProjects } from '../hooks/useProjects';
import { useCategories } from '../hooks/useCategories';

export function ProjectDetail() {
  const { id } = useParams();
  const { projects, loading: projectsLoading } = useProjects();
  const { categories, loading: categoriesLoading } = useCategories();
  const project = projects.find(p => p.id === id);

  if (projectsLoading || categoriesLoading) {
    return <div className="min-h-screen flex items-center justify-center text-white">Loading...</div>;
  }

  if (!project) {
    return <div className="text-white">Project not found</div>;
  }

  const projectCategories = categories
    .filter(cat => {
      if (Array.isArray(project.categories)) {
        return project.categories.includes(cat.id);
      }
      return project.category === cat.id;
    })
    .map(cat => cat.name)
    .join(', ');

  return (
    <div className="pt-16">
      <Link
        to="/"
        className="fixed top-24 left-4 md:left-8 z-10 flex items-center text-sm text-zinc-400 hover:text-white transition-colors duration-200"
      >
        <ArrowLeft className="h-4 w-4 mr-2" />
        Back
      </Link>

      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 pt-16 pb-32">
        <h1 className="text-4xl font-light mb-4 text-white">{project.title}</h1>
        <div className="flex flex-col gap-4 mb-12">
          <p className="text-zinc-300 whitespace-pre-wrap">{project.description}</p>
          <div className="flex flex-col sm:flex-row sm:gap-x-8">
            <p className="text-sm">
              <span className="text-white">Year:</span>{' '}
              <span className="text-zinc-300">{project.year}</span>
            </p>
            <p className="text-sm">
              <span className="text-white">Categories:</span>{' '}
              <span className="text-zinc-300">{projectCategories || 'Uncategorized'}</span>
            </p>
          </div>
        </div>

        <div className="space-y-24">
          {project.media?.map((item, index) => (
            <div key={index} className="space-y-4">
              {item.type === 'image' ? (
                <div className="aspect-[16/9] w-full overflow-hidden bg-zinc-800 rounded-lg">
                  <img
                    src={item.url}
                    alt={item.description || `${project.title} - Image ${index + 1}`}
                    className="w-full h-full object-cover"
                  />
                </div>
              ) : (
                <div className="aspect-[16/9] w-full overflow-hidden bg-zinc-800 rounded-lg">
                  <video
                    src={item.url}
                    controls
                    className="w-full h-full object-contain"
                    poster={item.posterUrl || project.thumbnail || project.coverImage}
                  >
                    Your browser does not support the video tag.
                  </video>
                </div>
              )}
              {item.description && (
                <p className="text-zinc-400 text-sm italic whitespace-pre-wrap">{item.description}</p>
              )}
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}