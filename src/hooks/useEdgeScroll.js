import { useRef, useEffect, useCallback } from "react";

export const useEdgeScroll = (scrollRef, isDraggingTask) => {
  const autoScrollInterval = useRef(null);
  const edgeScrollSpeed = useRef(0);

  //oto kenar scroll fonksiyonu 
  const handleEdgeScroll = useCallback((e) => {
    if (!scrollRef.current || !isDraggingTask) return;

    const scrollContainer = scrollRef.current;
    const containerRect = scrollContainer.getBoundingClientRect();
    const pointerX = e.clientX || (e.touches && e.touches[0]?.clientX);

    if (!pointerX) return;

    // Kenar mesafesi 
    const edgeSize = 100;
    const scrollSpeed = 15;

    // Sol kenara yakın
    if (pointerX < containerRect.left + edgeSize) {
      const distance = containerRect.left + edgeSize - pointerX;
      edgeScrollSpeed.current = -(distance / edgeSize) * scrollSpeed;
    }
    // Sağ kenara yakın
    else if (pointerX > containerRect.right - edgeSize) {
      const distance = pointerX - (containerRect.right - edgeSize);
      edgeScrollSpeed.current = (distance / edgeSize) * scrollSpeed;
    }
    // Ortada
    else {
      edgeScrollSpeed.current = 0;
    }
  }, [scrollRef, isDraggingTask]);

  // Scroll animasyonu
  useEffect(() => {
    if (!isDraggingTask) {
      edgeScrollSpeed.current = 0;
      if (autoScrollInterval.current) {
        cancelAnimationFrame(autoScrollInterval.current);
        autoScrollInterval.current = null;
      }
      return;
    }

    const scroll = () => {
      if (scrollRef.current && Math.abs(edgeScrollSpeed.current) > 0.1) {
        scrollRef.current.scrollLeft += edgeScrollSpeed.current;
      }
      autoScrollInterval.current = requestAnimationFrame(scroll);
    };

    autoScrollInterval.current = requestAnimationFrame(scroll);

    return () => {
      if (autoScrollInterval.current) {
        cancelAnimationFrame(autoScrollInterval.current);
      }
    };
  }, [isDraggingTask, scrollRef]);

  // Mouse -touch move event listener
  useEffect(() => {
    if (isDraggingTask) {
      window.addEventListener('mousemove', handleEdgeScroll);
      window.addEventListener('touchmove', handleEdgeScroll);
    }

    return () => {
      window.removeEventListener('mousemove', handleEdgeScroll);
      window.removeEventListener('touchmove', handleEdgeScroll);
    };
  }, [isDraggingTask, handleEdgeScroll]);

  // cleanup
  useEffect(() => {
    return () => {
      if (autoScrollInterval.current) cancelAnimationFrame(autoScrollInterval.current);
    };
  }, []);

  return { handleEdgeScroll };
};