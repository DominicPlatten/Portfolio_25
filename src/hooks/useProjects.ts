import { useState, useEffect } from 'react';
import { collection, query, orderBy, onSnapshot } from 'firebase/firestore';
import { db } from '../lib/firebase';
import { Project } from '../types';

export function useProjects() {
  const [projects, setProjects] = useState<Project[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const q = query(
      collection(db, 'projects'),
      orderBy('order', 'asc')
    );

    const unsubscribe = onSnapshot(q, 
      (snapshot) => {
        const projectData = snapshot.docs.map(doc => ({
          ...doc.data(),
          id: doc.id,
          order: doc.data().order || Number.MAX_SAFE_INTEGER,
          createdAt: doc.data().createdAt?.toDate(),
          updatedAt: doc.data().updatedAt?.toDate(),
        })) as Project[];
        
        setProjects(projectData);
        setLoading(false);
      },
      (error) => {
        console.error('Error fetching projects:', error);
        setError(error.message);
        setLoading(false);
      }
    );

    return () => unsubscribe();
  }, []);

  return { projects, loading, error };
}