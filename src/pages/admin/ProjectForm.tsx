import React, { useState } from 'react';
import { collection, addDoc, serverTimestamp, query, orderBy, limit, getDocs } from 'firebase/firestore';
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage';
import { db, storage } from '../../lib/firebase';
import { useCategories } from '../../hooks/useCategories';
import { Plus, GripVertical } from 'lucide-react';

interface ProjectFormProps {
  onClose: () => void;
}

const MAX_MEDIA_ITEMS = 10;
const MAX_FILE_SIZE = 100 * 1024 * 1024; // 100MB
const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp'];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm'];

export function ProjectForm({ onClose }: ProjectFormProps) {
  const [title, setTitle] = useState('');
  const [description, setDescription] = useState('');
  const [selectedCategories, setSelectedCategories] = useState<string[]>([]);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [thumbnail, setThumbnail] = useState<File | null>(null);
  const [media, setMedia] = useState<Array<{ file: File; description: string }>>([]);
  const [uploading, setUploading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const { categories } = useCategories();

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

  const handleMediaAdd = (files: FileList) => {
    if (media.length + files.length > MAX_MEDIA_ITEMS) {
      setError(`Maximum ${MAX_MEDIA_ITEMS} media items allowed`);
      return;
    }

    const newMedia = Array.from(files).map(file => ({
      file,
      description: ''
    }));
    setMedia([...media, ...newMedia]);
  };

  const handleMediaRemove = (index: number) => {
    setMedia(media.filter((_, i) => i !== index));
  };

  const handleDescriptionChange = (index: number, description: string) => {
    const updatedMedia = [...media];
    updatedMedia[index].description = description;
    setMedia(updatedMedia);
  };

  const reorderMedia = (dragIndex: number, dropIndex: number) => {
    const newMedia = [...media];
    const [draggedItem] = newMedia.splice(dragIndex, 1);
    newMedia.splice(dropIndex, 0, draggedItem);
    setMedia(newMedia);
  };

  const handleCategoryToggle = (categoryId: string) => {
    setSelectedCategories(prev => 
      prev.includes(categoryId)
        ? prev.filter(id => id !== categoryId)
        : [...prev, categoryId]
    );
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (selectedCategories.length === 0) {
      setError('Please select at least one category');
      return;
    }
    
    setError(null);
    setUploading(true);

    try {
      const orderQuery = query(collection(db, 'projects'), orderBy('order', 'desc'), limit(1));
      const orderSnapshot = await getDocs(orderQuery);
      const maxOrder = orderSnapshot.empty ? 0 : orderSnapshot.docs[0].data().order || 0;

      // Upload thumbnail if provided
      let thumbnailUrl = '';
      if (thumbnail) {
        const thumbnailRef = ref(storage, `projects/thumbnails/${Date.now()}_${thumbnail.name}`);
        await uploadBytes(thumbnailRef, thumbnail);
        thumbnailUrl = await getDownloadURL(thumbnailRef);
      }

      const uploadedMedia = await Promise.all(
        media.map(async ({ file, description }) => {
          const type = validateFile(file);
          const storageRef = ref(storage, `projects/${Date.now()}_${file.name}`);
          await uploadBytes(storageRef, file);
          const url = await getDownloadURL(storageRef);
          return { url, type, description };
        })
      );

      const coverImage = uploadedMedia[0]?.url || '';

      await addDoc(collection(db, 'projects'), {
        title,
        description,
        categories: selectedCategories,
        year,
        thumbnail: thumbnailUrl,
        coverImage,
        media: uploadedMedia,
        order: maxOrder + 1,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });

      onClose();
    } catch (error) {
      console.error('Error creating project:', error);
      setError(error instanceof Error ? error.message : 'Error creating project');
    } finally {
      setUploading(false);
    }
  };

  return (
    <form onSubmit={handleSubmit} className="space-y-6">
      {error && (
        <div className="bg-red-500/10 text-red-500 p-4 rounded-md">
          {error}
        </div>
      )}

      <div>
        <label className="block text-sm text-zinc-300">Title</label>
        <input
          type="text"
          value={title}
          onChange={(e) => setTitle(e.target.value)}
          className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-md shadow-sm p-2 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-300">Description</label>
        <textarea
          value={description}
          onChange={(e) => setDescription(e.target.value)}
          className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-md shadow-sm p-2 text-white"
          rows={4}
          required
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-300">Thumbnail</label>
        <input
          type="file"
          accept={ALLOWED_IMAGE_TYPES.join(',')}
          onChange={(e) => e.target.files && setThumbnail(e.target.files[0])}
          className="mt-1 block w-full text-zinc-300"
        />
        <p className="mt-1 text-sm text-zinc-400">Optional. If not provided, the first media item will be used as thumbnail.</p>
      </div>

      <div>
        <label className="block text-sm text-zinc-300">Categories</label>
        <div className="mt-2 flex flex-wrap gap-2">
          {categories.map((cat) => (
            <button
              key={cat.id}
              type="button"
              onClick={() => handleCategoryToggle(cat.id)}
              className={`px-3 py-1 rounded-full text-sm ${
                selectedCategories.includes(cat.id)
                  ? 'bg-white text-zinc-900'
                  : 'bg-zinc-700 text-zinc-300 hover:bg-zinc-600'
              }`}
            >
              {cat.name}
            </button>
          ))}
        </div>
        {selectedCategories.length === 0 && (
          <p className="mt-2 text-sm text-red-500">Please select at least one category</p>
        )}
      </div>

      <div>
        <label className="block text-sm text-zinc-300">Year</label>
        <input
          type="number"
          value={year}
          onChange={(e) => setYear(parseInt(e.target.value))}
          min="1900"
          max={new Date().getFullYear() + 10}
          className="mt-1 block w-full bg-zinc-700 border border-zinc-600 rounded-md shadow-sm p-2 text-white"
          required
        />
      </div>

      <div>
        <label className="block text-sm text-zinc-300 mb-2">
          Media ({media.length}/{MAX_MEDIA_ITEMS})
        </label>
        
        {media.length < MAX_MEDIA_ITEMS && (
          <div className="mb-4">
            <input
              type="file"
              id="media"
              multiple
              accept={[...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES].join(',')}
              onChange={(e) => e.target.files && handleMediaAdd(e.target.files)}
              className="hidden"
            />
            <label
              htmlFor="media"
              className="inline-flex items-center px-4 py-2 border border-zinc-600 rounded-md shadow-sm text-sm font-medium text-zinc-300 bg-zinc-700 hover:bg-zinc-600 cursor-pointer"
            >
              <Plus className="h-4 w-4 mr-2" />
              Add Media
            </label>
          </div>
        )}

        <div className="space-y-4">
          {media.map((item, index) => (
            <div
              key={index}
              className="relative border border-zinc-600 rounded-lg p-4"
              draggable
              onDragStart={(e) => {
                e.dataTransfer.setData('text/plain', index.toString());
                e.currentTarget.classList.add('opacity-50');
              }}
              onDragEnd={(e) => {
                e.currentTarget.classList.remove('opacity-50');
              }}
              onDragOver={(e) => {
                e.preventDefault();
                e.currentTarget.classList.add('border-white');
              }}
              onDragLeave={(e) => {
                e.currentTarget.classList.remove('border-white');
              }}
              onDrop={(e) => {
                e.preventDefault();
                e.currentTarget.classList.remove('border-white');
                const dragIndex = parseInt(e.dataTransfer.getData('text/plain'));
                if (dragIndex !== index) {
                  reorderMedia(dragIndex, index);
                }
              }}
            >
              <div className="flex items-start space-x-4">
                <div className="flex items-center">
                  <GripVertical className="h-4 w-4 text-zinc-400 cursor-move" />
                </div>
                <div className="w-32 h-32 bg-zinc-700 rounded-md overflow-hidden flex-shrink-0">
                  {ALLOWED_IMAGE_TYPES.includes(item.file.type) ? (
                    <img
                      src={URL.createObjectURL(item.file)}
                      alt=""
                      className="w-full h-full object-cover"
                    />
                  ) : (
                    <video
                      src={URL.createObjectURL(item.file)}
                      className="w-full h-full object-cover"
                    />
                  )}
                </div>
                <div className="flex-grow">
                  <textarea
                    value={item.description}
                    onChange={(e) => handleDescriptionChange(index, e.target.value)}
                    placeholder="Add a description..."
                    className="w-full bg-zinc-700 border border-zinc-600 rounded-md shadow-sm p-2 text-white placeholder-zinc-400"
                    rows={3}
                  />
                </div>
                <button
                  type="button"
                  onClick={() => handleMediaRemove(index)}
                  className="text-zinc-400 hover:text-red-500"
                >
                  ×
                </button>
              </div>
            </div>
          ))}
        </div>
      </div>

      <div className="flex justify-end space-x-4">
        <button
          type="button"
          onClick={onClose}
          className="px-4 py-2 text-zinc-400 hover:text-white"
        >
          Cancel
        </button>
        <button
          type="submit"
          disabled={uploading || selectedCategories.length === 0}
          className="px-4 py-2 bg-white text-zinc-900 rounded-md hover:bg-zinc-100 disabled:opacity-50 disabled:hover:bg-white"
        >
          {uploading ? 'Creating...' : 'Create Project'}
        </button>
      </div>
    </form>
  );
}