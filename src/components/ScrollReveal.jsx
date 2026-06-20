import React, { useEffect, useRef, useState } from 'react';

const ScrollReveal = ({ children, type = "section", className = "", delay = 0 }) => {
  const ref = useRef(null);
  const [isIntersecting, setIsIntersecting] = useState(false);

  useEffect(() => {
    const observer = new IntersectionObserver(
      ([entry]) => {
        if (entry.isIntersecting) {
          setIsIntersecting(true);
          observer.unobserve(entry.target);
          
          // Trigger resize for scroll-based chicken animation (if section type)
          if (type === "section") {
            setTimeout(() => {
              window.dispatchEvent(new Event('resize'));
            }, 150);
          }
        }
      },
      {
        threshold: type === "section" ? 0.05 : 0.1,
        rootMargin: "0px 0px -40px 0px"
      }
    );

    if (ref.current) {
      observer.observe(ref.current);
    }

    return () => {
      if (ref.current) {
        observer.unobserve(ref.current);
      }
    };
  }, [type]);

  const baseClass = type === "section" ? "section-reveal" : "text-reveal";

  return (
    <div
      ref={ref}
      className={`${baseClass} ${isIntersecting ? 'revealed' : ''} ${className}`}
      style={{ transitionDelay: `${delay}ms` }}
    >
      {children}
    </div>
  );
};

export default ScrollReveal;
