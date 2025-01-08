import React, { useState } from 'react';
import { collection, addDoc, deleteDoc, doc, serverTimestamp, getDocs, query, where, writeBatch } from 'firebase/firestore';
import { db } from '../../lib/firebase';
import { useCategories } from '../../hooks/useCategories';
import { Trash2 } from 'lucide-react';

export function CategoryManager() {
  const [newCategory, setNewCategory] = useState('');
  const { categories, loading } = useCategories();

  const handleAddCategory = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!newCategory.trim()) return;

    try {
      const slug = newCategory.toLowerCase().replace(/\s+/g, '-');
      await addDoc(collection(db, 'categories'), {
        name: newCategory.trim(),
        slug,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
      });
      setNewCategory('');
    } catch (error) {
      console.error('Error adding category:', error);
      alert('Error adding category. Please try again.');
    }
  };

  const handleDeleteCategory = async (categoryId: string) => {
    if (!confirm('Are you sure you want to delete this category? Projects using this category will be set to "uncategorized".')) {
      return;
    }

    try {
      const projectsRef = collection(db, 'projects');
      const projectsSnapshot = await getDocs(query(projectsRef, where('category', '==', categoryId)));
      
      const batch = writeBatch(db);
      projectsSnapshot.docs.forEach((projectDoc) => {
        batch.update(doc(db, 'projects', projectDoc.id), {
          category: 'uncategorized',
          updatedAt: serverTimestamp(),
        });
      });
      
      batch.delete(doc(db, 'categories', categoryId));
      await batch.commit();
    } catch (error) {
      console.error('Error deleting category:', error);
      alert('Error deleting category. Please try again.');
    }
  };

  if (loading) {
    return <div>Loading categories...</div>;
  }

  return (
    <div className="bg-zinc-800 p-6 rounded-lg shadow-sm">
      <h2 className="text-xl font-light mb-4 text-white">Categories</h2>
      
      <form onSubmit={handleAddCategory} className="mb-6">
        <div className="flex gap-2">
          <input
            type="text"
            value={newCategory}
            onChange={(e) => setNewCategory(e.target.value)}
            placeholder="New category name"
            className="flex-1 bg-zinc-700 border border-zinc-600 rounded-md p-2 text-white placeholder-zinc-400"
          />
          <button
            type="submit"
            className="bg-white text-zinc-900 px-4 py-2 rounded-md hover:bg-zinc-100"
          >
            Add
          </button>
        </div>
      </form>

      <div className="space-y-2">
        {categories.map((category) => (
          <div
            key={category.id}
            className="flex items-center justify-between p-2 hover:bg-zinc-700/50 rounded-md"
          >
            <span className="text-white">{category.name}</span>
            <button
              onClick={() => handleDeleteCategory(category.id)}
              className="text-zinc-400 hover:text-red-500"
            >
              <Trash2 className="h-4 w-4" />
            </button>
          </div>
        ))}
      </div>
    </div>
  );
}