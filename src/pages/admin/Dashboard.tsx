import React, { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '../../hooks/useAuth';
import { useProjects } from '../../hooks/useProjects';
import { ProjectForm } from './ProjectForm';
import { CategoryManager } from './CategoryManager';
import { deleteDoc, doc, writeBatch } from 'firebase/firestore';
import { ref, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { Plus, Edit, Trash2, ArrowUp, ArrowDown } from 'lucide-react';

export function Dashboard() {
  const { isAdmin, loading } = useAuth();
  const { projects } = useProjects();
  const [showForm, setShowForm] = useState(false);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  const navigate = useNavigate();

  if (loading) return <div>Loading...</div>;
  if (!isAdmin) {
    navigate('/admin/login');
    return null;
  }

  const handleDeleteProject = async (projectId: string) => {
    try {
      const project = projects.find(p => p.id === projectId);
      if (!project) return;

      // Delete all associated media files
      const mediaUrls = [project.coverImage, ...(project.media || []).map(m => m.url)];

      // Delete each media file from storage
      const deletePromises = mediaUrls.map(async (url) => {
        if (!url) return;
        try {
          const fileRef = ref(storage, url);
          await deleteObject(fileRef);
        } catch (error) {
          console.error('Error deleting file:', error);
        }
      });

      // Wait for all files to be deleted
      await Promise.all(deletePromises);

      // Delete the project document
      await deleteDoc(doc(db, 'projects', projectId));
      setProjectToDelete(null);
    } catch (error) {
      console.error('Error deleting project:', error);
      alert('Error deleting project. Please try again.');
    }
  };

  const handleReorder = async (projectId: string, direction: 'up' | 'down') => {
    const sortedProjects = [...projects].sort((a, b) => a.order - b.order);
    const currentIndex = sortedProjects.findIndex(p => p.id === projectId);
    if (currentIndex === -1) return;

    const newIndex = direction === 'up' ? currentIndex - 1 : currentIndex + 1;
    if (newIndex < 0 || newIndex >= sortedProjects.length) return;

    const batch = writeBatch(db);
    const currentProject = sortedProjects[currentIndex];
    const swapProject = sortedProjects[newIndex];

    batch.update(doc(db, 'projects', currentProject.id), {
      order: swapProject.order,
      updatedAt: new Date()
    });

    batch.update(doc(db, 'projects', swapProject.id), {
      order: currentProject.order,
      updatedAt: new Date()
    });

    await batch.commit();
  };

  const sortedProjects = [...projects].sort((a, b) => a.order - b.order);

  return (
    <div className="min-h-screen bg-zinc-900 pt-20">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-light text-white">Project Management</h1>
          <button
            onClick={() => setShowForm(true)}
            className="bg-white text-zinc-900 px-4 py-2 rounded-md hover:bg-zinc-100 flex items-center"
          >
            <Plus className="w-4 h-4 mr-2" />
            New Project
          </button>
        </div>

        <div className="mb-8">
          <CategoryManager />
        </div>

        <div className="grid gap-6">
          {sortedProjects.map((project, index) => (
            <div
              key={project.id}
              className="bg-zinc-800 p-6 rounded-lg shadow-sm flex justify-between items-center"
            >
              <div>
                <h3 className="text-xl font-light text-white">{project.title}</h3>
                <p className="text-zinc-400">{project.category}</p>
              </div>
              <div className="flex items-center space-x-4">
                <div className="flex space-x-2">
                  {index > 0 && (
                    <button
                      onClick={() => handleReorder(project.id, 'up')}
                      className="text-zinc-400 hover:text-white p-1"
                      title="Move up"
                    >
                      <ArrowUp className="h-4 w-4" />
                    </button>
                  )}
                  {index < sortedProjects.length - 1 && (
                    <button
                      onClick={() => handleReorder(project.id, 'down')}
                      className="text-zinc-400 hover:text-white p-1"
                      title="Move down"
                    >
                      <ArrowDown className="h-4 w-4" />
                    </button>
                  )}
                </div>
                <button
                  onClick={() => navigate(`/admin/project/${project.id}`)}
                  className="text-zinc-400 hover:text-white flex items-center"
                >
                  <Edit className="h-4 w-4 mr-1" />
                  Edit
                </button>
                <button
                  onClick={() => setProjectToDelete(project.id)}
                  className="text-zinc-400 hover:text-red-500 flex items-center"
                >
                  <Trash2 className="h-4 w-4 mr-1" />
                  Delete
                </button>
              </div>
            </div>
          ))}
        </div>

        {showForm && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-zinc-800 p-8 rounded-lg max-w-2xl w-full max-h-[90vh] overflow-y-auto">
              <ProjectForm onClose={() => setShowForm(false)} />
            </div>
          </div>
        )}

        {projectToDelete && (
          <div className="fixed inset-0 bg-black bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-zinc-800 p-8 rounded-lg max-w-md w-full">
              <h2 className="text-xl font-light mb-4 text-white">Delete Project</h2>
              <p className="text-zinc-400 mb-6">Are you sure you want to delete this project? This action cannot be undone.</p>
              <div className="flex justify-end space-x-4">
                <button
                  onClick={() => setProjectToDelete(null)}
                  className="px-4 py-2 text-zinc-400 hover:text-white"
                >
                  Cancel
                </button>
                <button
                  onClick={() => handleDeleteProject(projectToDelete)}
                  className="px-4 py-2 bg-red-500 text-white rounded-md hover:bg-red-600"
                >
                  Delete Project
                </button>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}