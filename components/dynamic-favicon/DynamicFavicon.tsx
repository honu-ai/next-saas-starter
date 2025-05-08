'use client';

import React, { useEffect } from 'react';
import contentJson from '../../content.json';

export type DynamicFaviconProps = {
  fontFamily?: string;
};

const DynamicFavicon: React.FC<DynamicFaviconProps> = ({ fontFamily }) => {
  useEffect(() => {
    try {
      const brandName = contentJson.metadata.brandName;
      if (!brandName) {
        console.error('Brand name not found in content.json');
        return;
      }

      const firstLetter = brandName.charAt(0);

      // Create an SVG element
      const svg = document.createElementNS('http://www.w3.org/2000/svg', 'svg');
      svg.setAttribute('width', '32');
      svg.setAttribute('height', '32');
      svg.setAttribute('viewBox', '0 0 32 32');

      // Get computed CSS variables from the document
      const styles = getComputedStyle(document.documentElement);
      const primaryColor =
        styles.getPropertyValue('--primary').trim() || '#0284c7';
      const primaryForeground =
        styles.getPropertyValue('--primary-foreground').trim() || '#ffffff';

      // Create the circular background
      const circle = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'circle',
      );
      circle.setAttribute('cx', '16');
      circle.setAttribute('cy', '16');
      circle.setAttribute('r', '16');
      circle.setAttribute('fill', primaryColor);
      svg.appendChild(circle);

      // Use the provided font family or fallback to the computed style
      const fontToUse =
        fontFamily ||
        window.getComputedStyle(document.body).fontFamily ||
        'ui-sans-serif, system-ui, sans-serif';

      // Create the text element
      const text = document.createElementNS(
        'http://www.w3.org/2000/svg',
        'text',
      );
      text.setAttribute('x', '16');
      text.setAttribute('y', '22'); // Adjusted for vertical centering
      text.setAttribute('text-anchor', 'middle');
      text.setAttribute('font-size', '20');
      text.setAttribute('font-weight', 'bold');
      text.setAttribute('font-family', fontToUse);
      text.setAttribute('fill', primaryForeground);
      text.textContent = firstLetter;
      svg.appendChild(text);

      // Convert SVG to a data URL
      const svgData = new XMLSerializer().serializeToString(svg);
      const svgBlob = new Blob([svgData], {
        type: 'image/svg+xml;charset=utf-8',
      });
      const svgUrl = URL.createObjectURL(svgBlob);

      // Create a link element for the favicon
      const link =
        document.querySelector("link[rel*='icon']") ||
        document.createElement('link');
      link.setAttribute('rel', 'icon');
      link.setAttribute('href', svgUrl);
      document.head.appendChild(link);

      // Clean up
      return () => {
        URL.revokeObjectURL(svgUrl);
      };
    } catch (error) {
      console.error('Error generating dynamic favicon:', error);
      // Fallback to the static favicon if there's an error
      const link = document.querySelector("link[rel*='icon']");
      if (link) {
        link.setAttribute('href', '/favicon.svg');
      }
    }
  }, [fontFamily]);

  return null; // This component doesn't render anything
};

export default DynamicFavicon;
