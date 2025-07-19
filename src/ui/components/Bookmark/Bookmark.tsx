"use client"

import React, { MouseEvent, useState } from "react";
import './Bookmark.css';

interface BookmarkIconProps {
  width?: number;
  height?: number;
  strokeWidth?: number;
}

const Bookmark: React.FC<BookmarkIconProps> = ({ width = 24, height = 32, strokeWidth = 1 }) => {
  const [active, setActive] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: MouseEvent<HTMLButtonElement>) => {
    e.preventDefault(); // Prevent default action if needed
    setActive((prev) => {
      setAnimating(true);
      setTimeout(() => setAnimating(false), 500);
      return !prev;
    });
  };

  const [hovered, setHovered] = useState(false);

  return (
    <button
      className="bookmark-icon"
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg viewBox="0 0 48 64" width={width} height={height} style={{ overflow: "visible"}}>
        <polygon
          className={`bookmark-fill${active ? ' active' : ''}${animating ? ' animating' : ''}${!active && hovered ? ' hovered' : ''}`}
          points="8,8 40,8 40,56 24,44 8,56"
        />
        <polyline
          className={`bookmark-shape${active ? ' active' : ''}${animating ? ' animating' : ''}${!active && hovered ? ' hovered' : ''}`}
          points="8,8 40,8 40,56 24,44 8,56 8,8"
          strokeWidth={strokeWidth}
        />
      </svg>
    </button>
  );
};

export default Bookmark;
