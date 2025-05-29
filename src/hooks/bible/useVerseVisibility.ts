
import { useEffect, useRef, useCallback } from 'react';

interface UseVerseVisibilityProps {
  onVerseVisible: (verseNumber: number) => void;
  threshold?: number;
}

/**
 * Hook to detect which verse is currently visible on screen
 * Uses Intersection Observer API to track verse visibility
 */
export const useVerseVisibility = ({ 
  onVerseVisible, 
  threshold = 0.5 
}: UseVerseVisibilityProps) => {
  const observerRef = useRef<IntersectionObserver | null>(null);
  const visibleVersesRef = useRef<Set<number>>(new Set());

  const observeVerse = useCallback((element: HTMLElement, verseNumber: number) => {
    if (!observerRef.current) {
      observerRef.current = new IntersectionObserver(
        (entries) => {
          entries.forEach((entry) => {
            const verseNum = parseInt(entry.target.getAttribute('data-verse-number') || '0');
            
            if (entry.isIntersecting) {
              visibleVersesRef.current.add(verseNum);
            } else {
              visibleVersesRef.current.delete(verseNum);
            }
            
            // Get the most visible verse (closest to center of screen)
            if (visibleVersesRef.current.size > 0) {
              const visibleVerses = Array.from(visibleVersesRef.current);
              const centerVerse = visibleVerses.sort((a, b) => {
                const aElement = document.querySelector(`[data-verse-number="${a}"]`);
                const bElement = document.querySelector(`[data-verse-number="${b}"]`);
                
                if (!aElement || !bElement) return 0;
                
                const aRect = aElement.getBoundingClientRect();
                const bRect = bElement.getBoundingClientRect();
                const viewportCenter = window.innerHeight / 2;
                
                const aDistance = Math.abs(aRect.top + aRect.height / 2 - viewportCenter);
                const bDistance = Math.abs(bRect.top + bRect.height / 2 - viewportCenter);
                
                return aDistance - bDistance;
              })[0];
              
              onVerseVisible(centerVerse);
            }
          });
        },
        {
          threshold,
          rootMargin: '-20% 0px -20% 0px' // Only consider verses in the middle 60% of the viewport
        }
      );
    }

    element.setAttribute('data-verse-number', verseNumber.toString());
    observerRef.current.observe(element);
  }, [onVerseVisible, threshold]);

  const unobserveVerse = useCallback((element: HTMLElement) => {
    if (observerRef.current) {
      observerRef.current.unobserve(element);
    }
  }, []);

  useEffect(() => {
    return () => {
      if (observerRef.current) {
        observerRef.current.disconnect();
      }
    };
  }, []);

  return { observeVerse, unobserveVerse };
};
