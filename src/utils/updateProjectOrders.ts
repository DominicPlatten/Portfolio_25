import { collection, getDocs, writeBatch } from 'firebase/firestore';
import { db } from '../lib/firebase';

export async function updateProjectOrders() {
  const batch = writeBatch(db);
  const projectsRef = collection(db, 'projects');
  const snapshot = await getDocs(projectsRef);
  
  snapshot.docs.forEach((doc, index) => {
    if (!doc.data().order) {
      batch.update(doc.ref, { 
        order: index + 1,
        updatedAt: new Date()
      });
    }
  });

  await batch.commit();
}