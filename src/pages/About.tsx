import React from 'react';

export function About() {
  return (
    <div className="max-w-4xl mx-auto px-4 sm:px-6 lg:px-8 pt-24 pb-16">
      <h1 className="text-4xl font-light mb-12 text-white">About</h1>
      
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
        <p className="text-zinc-300">
          I believe in a collaborative approach to development, working closely with clients to understand their needs 
          and translate them into effective solutions. Whether it's designing game mechanics, optimizing performance, 
          or crafting user interfaces, I'm committed to delivering high-quality results that exceed expectations.
        </p>
      </div>
    </div>
  );
}