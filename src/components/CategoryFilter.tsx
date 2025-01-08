import React, { useRef, useEffect, useState } from 'react';
import { useCategories } from '../hooks/useCategories';
import { ChevronLeft, ChevronRight } from 'lucide-react';

interface CategoryFilterProps {
  selectedCategory: string;
  onCategoryChange: (category: string) => void;
}

export function CategoryFilter({ selectedCategory, onCategoryChange }: CategoryFilterProps) {
  const { categories, loading } = useCategories();
  const scrollContainerRef = useRef<HTMLDivElement>(null);
  const [showLeftArrow, setShowLeftArrow] = useState(false);
  const [showRightArrow, setShowRightArrow] = useState(false);

  const checkScroll = () => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const hasOverflow = container.scrollWidth > container.clientWidth;
    setShowLeftArrow(hasOverflow && container.scrollLeft > 0);
    setShowRightArrow(
      hasOverflow && container.scrollLeft < container.scrollWidth - container.clientWidth
    );
  };

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (!container) return;

    checkScroll();
    window.addEventListener('resize', checkScroll);
    container.addEventListener('scroll', checkScroll);

    return () => {
      window.removeEventListener('resize', checkScroll);
      container.removeEventListener('scroll', checkScroll);
    };
  }, [categories]);

  const scroll = (direction: 'left' | 'right') => {
    const container = scrollContainerRef.current;
    if (!container) return;

    const scrollAmount = container.clientWidth * 0.8;
    container.scrollBy({
      left: direction === 'left' ? -scrollAmount : scrollAmount,
      behavior: 'smooth'
    });
  };

  if (loading) return null;

  return (
    <div className="relative">
      {showLeftArrow && (
        <button
          onClick={() => scroll('left')}
          className="absolute left-0 top-1/2 -translate-y-1/2 z-10 bg-zinc-900/80 backdrop-blur-sm text-white p-2 rounded-full shadow-lg"
          aria-label="Scroll left"
        >
          <ChevronLeft className="w-4 h-4" />
        </button>
      )}
      
      <div 
        ref={scrollContainerRef}
        className="flex space-x-6 mb-12 overflow-x-auto scrollbar-hide pb-4 -mb-4 px-8"
      >
        <button
          onClick={() => onCategoryChange('all')}
          className={`${
            selectedCategory === 'all'
              ? 'text-white'
              : 'text-zinc-500 hover:text-white'
          } text-sm uppercase tracking-wider transition-colors duration-200 whitespace-nowrap flex-shrink-0`}
        >
          All
        </button>
        {categories.map((category) => (
          <button
            key={category.id}
            onClick={() => onCategoryChange(category.id)}
            className={`${
              selectedCategory === category.id
                ? 'text-white'
                : 'text-zinc-500 hover:text-white'
            } text-sm uppercase tracking-wider transition-colors duration-200 whitespace-nowrap flex-shrink-0`}
          >
            {category.name}
          </button>
        ))}
      </div>

      {showRightArrow && (
        <button
          onClick={() => scroll('right')}
          className="absolute right-0 top-1/2 -translate-y-1/2 z-10 bg-zinc-900/80 backdrop-blur-sm text-white p-2 rounded-full shadow-lg"
          aria-label="Scroll right"
        >
          <ChevronRight className="w-4 h-4" />
        </button>
      )}
    </div>
  );
}