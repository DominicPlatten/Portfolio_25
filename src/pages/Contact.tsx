import React, { useState } from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';
import { collection, addDoc, serverTimestamp } from 'firebase/firestore';
import { db } from '../lib/firebase';

export function Contact() {
  const [formData, setFormData] = useState({
    name: '',
    email: '',
    message: ''
  });
  const [status, setStatus] = useState<'idle' | 'submitting' | 'success' | 'error'>('idle');
  const [error, setError] = useState('');

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('submitting');
    setError('');

    try {
      // Store the message in Firestore
      await addDoc(collection(db, 'messages'), {
        ...formData,
        createdAt: serverTimestamp()
      });

      setStatus('success');
      setFormData({ name: '', email: '', message: '' });
    } catch (err) {
      console.error('Error sending message:', err);
      setStatus('error');
      setError('Failed to send message. Please try again.');
    }
  };

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ ...prev, [name]: value }));
  };

  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <h1 className="text-4xl font-light mb-12 text-white">Contact</h1>
      
      <div className="grid md:grid-cols-2 gap-12">
        <div>
          <p className="text-zinc-300 mb-8">
            I'm always interested in discussing new projects and opportunities.
            Get in touch to start a conversation about your next project.
          </p>

          <div className="space-y-4">
            <div className="flex items-center">
              <Mail className="h-5 w-5 mr-3 text-zinc-400" />
              <a href="mailto:dominic.platten@gmail.com" className="text-zinc-300 hover:text-white">
                dominic.platten@gmail.com
              </a>
            </div>
            
            <div className="flex items-center">
              <Phone className="h-5 w-5 mr-3 text-zinc-400" />
              <a href="tel:+41786975590" className="text-zinc-300 hover:text-white">
                +41 78 697 55 90
              </a>
            </div>
            
            <div className="flex items-center">
              <MapPin className="h-5 w-5 mr-3 text-zinc-400" />
              <span className="text-zinc-300">
                5400 Baden<br />
                Switzerland
              </span>
            </div>
          </div>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {status === 'success' && (
            <div className="bg-green-500/10 text-green-500 p-4 rounded-md">
              Message sent successfully! I'll get back to you soon.
            </div>
          )}

          {status === 'error' && (
            <div className="bg-red-500/10 text-red-500 p-4 rounded-md">
              {error}
            </div>
          )}

          <div>
            <label htmlFor="name" className="block text-sm text-zinc-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              name="name"
              value={formData.name}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 focus:ring-0 transition-colors duration-200 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              name="email"
              value={formData.email}
              onChange={handleChange}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 focus:ring-0 transition-colors duration-200 rounded-md"
              required
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm text-zinc-300 mb-2">
              Message
            </label>
            <textarea
              id="message"
              name="message"
              value={formData.message}
              onChange={handleChange}
              rows={4}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 focus:ring-0 transition-colors duration-200 rounded-md"
              required
            ></textarea>
          </div>

          <button
            type="submit"
            disabled={status === 'submitting'}
            className="w-full bg-white text-zinc-900 px-6 py-3 hover:bg-zinc-100 transition-colors duration-200 rounded-md disabled:opacity-50"
          >
            {status === 'submitting' ? 'Sending...' : 'Send Message'}
          </button>
        </form>
      </div>
    </div>
  );
}