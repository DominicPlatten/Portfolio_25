import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import type { Category } from '../types';

export function useCategories() {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'categories'),
      orderBy('name', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const categoryData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Category[];
        
        setCategories(categoryData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching categories:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { categories, loading, error };
}