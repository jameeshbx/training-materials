import React from "react";

interface CardProps {
  title?: string;
  children: React.ReactNode;
  className?: string;
}

export const Card: React.FC<CardProps> = ({
  title,
  children,
  className = "",
}) => {
  return (
    <div
      className={`bg-neutral-900 text-white shadow-lg rounded-xl p-8 m-6 border border-neutral-800 ${className}`}
    >
      {title && (
        <h2 className="text-xl font-semibold mb-4 text-white/90">{title}</h2>
      )}
      <div className="space-y-4">{children}</div>
    </div>
  );
};
