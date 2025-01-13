import React from 'react';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

export function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <h1 className="text-4xl font-light mb-12 text-white">About & Contact</h1>
      
      <div className="space-y-12">
        {/* About Section */}
        <div className="prose prose-lg prose-invert">
          <div className="text-zinc-300 border-l-2 border-zinc-700 pl-6">
            <p className="mb-6">
              "Hi, I'm Dominic Platten, a game designer and developer from Switzerland with a passion for creating immersive, user-friendly digital experiences."
            </p>
            <p className="mb-6">
              "I began my career developing VR applications to train airport safety personnel and later collaborated with architecture agencies to design apps for clients like Steiner and Implenia. With a strong focus on UX and UI, I craft solutions that are visually appealing and intuitive across touch, VR, and keyboard interfaces."
            </p>
            <p>
              "Feel free to explore my work and get in touch—I'm always eager to collaborate on innovative projects."
            </p>
          </div>
        </div>

        {/* Contact Section */}
        <div>
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

            <div className="flex items-center">
              <Linkedin className="h-5 w-5 mr-3 text-zinc-400" />
              <a 
                href="https://www.linkedin.com/in/dominic-platten-197544218/" 
                target="_blank" 
                rel="noopener noreferrer" 
                className="text-zinc-300 hover:text-white"
              >
                Dominic Platten
              </a>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}