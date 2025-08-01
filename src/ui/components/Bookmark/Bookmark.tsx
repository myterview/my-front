"use client";

import "./Bookmark.css";
import { ClassValue, neato } from "neato";
import { useState } from "react";

export default function Bookmark({
  active,
  mutate,
  width = 24,
  height = 32,
  strokeWidth = 1,
  className,
}: {
  active: boolean;
  mutate: () => void;
  width?: number;
  height?: number;
  strokeWidth?: number;
  className?: ClassValue;
}) {
  const [hovered, setHovered] = useState(false);
  const [animating, setAnimating] = useState(false);

  const handleClick = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    mutate();
    setAnimating(true);
    setTimeout(() => setAnimating(false), 500);
  };

  return (
    <div
      className={neato("bookmark-icon", className)}
      onClick={handleClick}
      onMouseEnter={() => setHovered(true)}
      onMouseLeave={() => setHovered(false)}
    >
      <svg
        viewBox="0 0 48 64"
        width={width}
        height={height}
        style={{ overflow: "visible" }}
      >
        <polygon
          className={`bookmark-fill${active ? " active" : ""}${animating ? " animating" : ""}${!active && hovered ? " hovered" : ""}`}
          points="8,8 40,8 40,56 24,44 8,56"
        />
        <polyline
          className={`bookmark-shape${active ? " active" : ""}${animating ? " animating" : ""}${!active && hovered ? " hovered" : ""}`}
          points="8,8 40,8 40,56 24,44 8,56 8,8"
          strokeWidth={strokeWidth}
        />
      </svg>
    </div>
  );
}
