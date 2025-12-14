import { useRef, useEffect, useCallback, useState } from "react";

export const useScrollNavigation = (columnsLength) => {
  const scrollRef = useRef(null);
  const itemsRef = useRef([]);
  const isManualScroll = useRef(false);
  const scrollTimeout = useRef(null);
  const [activeColumnIndex, setActiveColumnIndex] = useState(0);

  // Gözlemci – aktif sütunu belirleme
  useEffect(() => {
    const observer = new IntersectionObserver(
      (entries) => {
        if (isManualScroll.current) return;

        entries.forEach((entry) => {
          if (entry.isIntersecting) {
            const index = itemsRef.current.indexOf(entry.target);
            if (index !== -1) {
              setActiveColumnIndex(index);
            }
          }
        });
      },
      {
        root: scrollRef.current,
        threshold: 0.6,
      }
    );

    itemsRef.current.forEach((el) => {
      if (el) observer.observe(el);
    });

    return () => observer.disconnect();
  }, [columnsLength]);

  // Sütuna gitme fonksiyonu 
  const navigateToColumn = useCallback((index) => {
    if (!scrollRef.current || !itemsRef.current[index]) return;

    isManualScroll.current = true;
    setActiveColumnIndex(index);

    // Hedef sütun elemanını al
    const targetElement = itemsRef.current[index];
    const container = scrollRef.current;

    // Elemanın container içindeki pozisyonunu hesapla
    const elementLeft = targetElement.offsetLeft;
    const containerWidth = container.offsetWidth;
    const elementWidth = targetElement.offsetWidth;

    // Elemanı ortaya getir 
    const scrollPosition = elementLeft - (containerWidth / 2) + (elementWidth / 2);

    // Kaydırma işlemi
    container.scrollTo({
      left: Math.max(0, scrollPosition),
      behavior: 'smooth'
    });

    // Manuel kaydırma işlemi sona erdiğinde işaretleme
    if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    scrollTimeout.current = setTimeout(() => {
      isManualScroll.current = false;
    }, 600);
  }, []);

  // cleanup
  useEffect(() => {
    return () => {
      if (scrollTimeout.current) clearTimeout(scrollTimeout.current);
    };
  }, []);

  return {
    scrollRef,
    itemsRef,
    activeColumnIndex,
    navigateToColumn
  };
};