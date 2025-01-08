import React, { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import { doc, updateDoc, serverTimestamp } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useProjects } from '../../hooks/useProjects';
import { useCategories } from '../../hooks/useCategories';
import { MediaItem } from '../../types';
import { Plus, X } from 'lucide-react';

const MAX_MEDIA_ITEMS = 10;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

export function ProjectEdit() {
  const { id } = useParams();
  const navigate = useNavigate();
  const { projects, loading } = useProjects();
  const { categories } = useCategories();
  const project = projects.find(p => p.id === id);

  // Initialize state with project data
  const [formData, setFormData] = useState({
    title: '',
    description: '',
    category: '',
    year: new Date().getFullYear(),
    media: [] as MediaItem[]
  });
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // Update form data when project loads
  useEffect(() => {
    if (project) {
      setFormData({
        title: project.title,
        description: project.description,
        category: project.category,
        year: project.year,
        media: project.media || []
      });
    }
  }, [project]);

  if (loading) {
    return <div className="min-h-screen flex items-center justify-center">Loading...</div>;
  }

  if (!project) {
    return <div>Project not found</div>;
  }

  const validateFile = (file: File) => {
    if (file.size > MAX_FILE_SIZE) {
      throw new Error(`File ${file.name} exceeds maximum size of 100MB`);
    }
    const isImage = ALLOWED_IMAGE_TYPES.includes(file.type);
    const isVideo = ALLOWED_VIDEO_TYPES.includes(file.type);
    if (!isImage && !isVideo) {
      throw new Error(`File ${file.name} has unsupported format`);
    }
    return isImage ? 'image' : 'video';
  };

  const handleMediaUpload = async (files: FileList) => {
    if (formData.media.length + files.length > MAX_MEDIA_ITEMS) {
      setError(`Maximum ${MAX_MEDIA_ITEMS} media items allowed`);
      return;
    }

    setUploading(true);
    setError(null);

    try {
      const newMedia = await Promise.all(
        Array.from(files).map(async (file) => {
          const type = validateFile(file);
          const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          return { url, type, description: '' } as MediaItem;
        })
      );

      setFormData(prev => ({
        ...prev,
        media: [...prev.media, ...newMedia]
      }));
    } catch (error) {
      setError(error instanceof Error ? error.message : 'Error uploading files');
    } finally {
      setUploading(false);
    }
  };

  const handleRemoveMedia = async (index: number) => {
    try {
      const mediaItem = formData.media[index];
      const fileRef = ref(storage, mediaItem.url);
      await deleteObject(fileRef);
      
      setFormData(prev => ({
        ...prev,
        media: prev.media.filter((_, i) => i !== index)
      }));
    } catch (error) {
      console.error('Error removing media:', error);
      setError('Error removing media item');
    }
  };

  const handleUpdateDescription = (index: number, description: string) => {
    setFormData(prev => ({
      ...prev,
      media: prev.media.map((item, i) => 
        i === index ? { ...item, description } : item
      )
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setUploading(true);
    setError(null);

    try {
      await updateDoc(doc(db, 'projects', project.id), {
        ...formData,
        updatedAt: serverTimestamp(),
      });

      navigate('/admin/dashboard');
    } catch (error) {
      console.error('Error updating project:', error);
      setError('Error updating project. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50 pt-20">
      <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <h1 className="text-3xl font-light mb-8">Edit Project</h1>
        
        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-500 rounded-md">
            {error}
          </div>
        )}

        <form onSubmit={handleSubmit} className="space-y-6">
          <div>
            <label className="block text-sm text-gray-700">Title</label>
            <input
              type="text"
              value={formData.title}
              onChange={(e) => setFormData(prev => ({ ...prev, title: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Description</label>
            <textarea
              value={formData.description}
              onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              rows={4}
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700">Category</label>
            <select
              value={formData.category}
              onChange={(e) => setFormData(prev => ({ ...prev, category: e.target.value }))}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            >
              <option value="">Select a category</option>
              {categories.map((cat) => (
                <option key={cat.id} value={cat.id}>
                  {cat.name}
                </option>
              ))}
            </select>
          </div>

          <div>
            <label className="block text-sm text-gray-700">Year</label>
            <input
              type="number"
              value={formData.year}
              onChange={(e) => setFormData(prev => ({ ...prev, year: parseInt(e.target.value) }))}
              min="1900"
              max={new Date().getFullYear() + 10}
              className="mt-1 block w-full border border-gray-300 rounded-md shadow-sm p-2"
              required
            />
          </div>

          <div>
            <label className="block text-sm text-gray-700 mb-2">
              Media ({formData.media.length}/{MAX_MEDIA_ITEMS})
            </label>
            
            {formData.media.length < MAX_MEDIA_ITEMS && (
              <div className="mb-4">
                <input
                  type="file"
                  id="media"
                  multiple
                  accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
                  onChange={(e) => e.target.files && handleMediaUpload(e.target.files)}
                  className="hidden"
                />
                <label
                  htmlFor="media"
                  className="inline-flex items-center px-4 py-2 border border-gray-300 rounded-md shadow-sm text-sm font-medium text-gray-700 bg-white hover:bg-gray-50 cursor-pointer"
                >
                  <Plus className="h-4 w-4 mr-2" />
                  Add Media
                </label>
              </div>
            )}

            <div className="space-y-4">
              {formData.media.map((item, index) => (
                <div key={index} className="relative border rounded-lg p-4">
                  <div className="flex items-start space-x-4">
                    <div className="w-32 h-32 bg-gray-100 rounded-md overflow-hidden flex-shrink-0">
                      {item.type === 'image' ? (
                        <img
                          src={item.url}
                          alt=""
                          className="w-full h-full object-cover"
                        />
                      ) : (
                        <video
                          src={item.url}
                          className="w-full h-full object-cover"
                        />
                      )}
                    </div>
                    <div className="flex-grow">
                      <textarea
                        value={item.description}
                        onChange={(e) => handleUpdateDescription(index, e.target.value)}
                        placeholder="Add a description..."
                        className="w-full border border-gray-300 rounded-md shadow-sm p-2"
                        rows={3}
                      />
                    </div>
                    <button
                      type="button"
                      onClick={() => handleRemoveMedia(index)}
                      className="text-gray-400 hover:text-red-500"
                    >
                      <X className="h-4 w-4" />
                    </button>
                  </div>
                </div>
              ))}
            </div>
          </div>

          <div className="flex justify-end space-x-4">
            <button
              type="button"
              onClick={() => navigate('/admin/dashboard')}
              className="px-4 py-2 text-gray-600 hover:text-black"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={uploading}
              className="px-4 py-2 bg-black text-white rounded-md hover:bg-gray-800 disabled:opacity-50"
            >
              {uploading ? 'Updating...' : 'Update Project'}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}