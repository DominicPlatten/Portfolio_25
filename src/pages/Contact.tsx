import React from 'react';
import { Mail, Phone, MapPin, Linkedin } from 'lucide-react';

export function Contact() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <h1 className="text-4xl font-light mb-12 text-white">About & Contact</h1>
      
      <div className="space-y-12">
        {/* About Section */}
        <div className="prose prose-lg prose-invert">
          <p className="text-zinc-300 mb-8">
            As a passionate game developer with expertise in Unreal Engine and Unity, I've dedicated my career to creating 
            immersive and engaging digital experiences. My journey began with studying game design, where I developed a strong 
            foundation in both the technical and creative aspects of game development.
          </p>

          <h2 className="text-2xl font-light mb-4 text-white">Experience</h2>
          <p className="text-zinc-300 mb-8">
            Over the years, I've had the privilege of working on more than 15 diverse applications, collaborating closely 
            with clients to bring their visions to life. My experience spans from concept development to final implementation, 
            with a particular focus on creating intuitive user experiences and polished user interfaces.
          </p>

          <h2 className="text-2xl font-light mb-4 text-white">Approach</h2>
          <p className="text-zinc-300 mb-12">
            I believe in a collaborative approach to development, working closely with clients to understand their needs 
            and translate them into effective solutions. Whether it's designing game mechanics, optimizing performance, 
            or crafting user interfaces, I'm committed to delivering high-quality results that exceed expectations.
          </p>
        </div>

        {/* Contact Section */}
        <div>
          <h2 className="text-2xl font-light mb-6 text-white">Contact</h2>
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