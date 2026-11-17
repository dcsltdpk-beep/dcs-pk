import React from 'react';

interface LoaderProps {
  size?: 'sm' | 'md' | 'lg';
  text?: string;
  inline?: boolean;
}

export default function Loader({ size = 'md', text, inline = false }: LoaderProps) {
  const pixelSize = size === 'sm' ? 22 : size === 'lg' ? 48 : 34;

  const content = (
    <div
      className={`dcs-spinner-wrap ${inline ? 'dcs-spinner-inline' : 'dcs-spinner-block'}`}
      role="status"
      aria-label={text || 'Loading'}
    >
      <div
        className="dcs-cyber-spinner"
        style={{ width: `${pixelSize}px`, height: `${pixelSize}px` }}
      />
      {text && <span className="dcs-spinner-text">{text}</span>}
    </div>
  );

  return content;
}
