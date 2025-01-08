import React from 'react';
import { Mail, Phone, MapPin } from 'lucide-react';

export function Contact() {
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

        <form className="space-y-6">
          <div>
            <label htmlFor="name" className="block text-sm text-zinc-300 mb-2">
              Name
            </label>
            <input
              type="text"
              id="name"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 focus:ring-0 transition-colors duration-200 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="email" className="block text-sm text-zinc-300 mb-2">
              Email
            </label>
            <input
              type="email"
              id="email"
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 focus:ring-0 transition-colors duration-200 rounded-md"
            />
          </div>

          <div>
            <label htmlFor="message" className="block text-sm text-zinc-300 mb-2">
              Message
            </label>
            <textarea
              id="message"
              rows={4}
              className="w-full px-4 py-2 bg-zinc-800 border border-zinc-700 text-white focus:border-zinc-500 focus:ring-0 transition-colors duration-200 rounded-md"
            ></textarea>
          </div>

          <button
            type="submit"
            className="w-full bg-white text-zinc-900 px-6 py-3 hover:bg-zinc-100 transition-colors duration-200 rounded-md"
          >
            Send Message
          </button>
        </form>
      </div>
    </div>
  );
}