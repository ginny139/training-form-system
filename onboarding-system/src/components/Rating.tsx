import React, { useState } from 'react';
import { Star } from 'lucide-react';

interface RatingProps {
  value: number;
  onChange?: (value: number) => void;
  readonly?: boolean;
  size?: 'sm' | 'md' | 'lg';
}

export const Rating: React.FC<RatingProps> = ({
  value,
  onChange,
  readonly = false,
  size = 'md',
}) => {
  const [hoverValue, setHoverValue] = useState(0);

  const sizeStyles = {
    sm: 'w-4 h-4',
    md: 'w-6 h-6',
    lg: 'w-8 h-8',
  };

  const handleClick = (rating: number) => {
    if (!readonly && onChange) {
      onChange(rating);
    }
  };

  const handleMouseEnter = (rating: number) => {
    if (!readonly) {
      setHoverValue(rating);
    }
  };

  const handleMouseLeave = () => {
    setHoverValue(0);
  };

  return (
    <div className="flex items-center gap-1">
      {[1, 2, 3, 4, 5].map((rating) => {
        const isFilled = hoverValue ? rating <= hoverValue : rating <= value;
        return (
          <button
            key={rating}
            type="button"
            onClick={() => handleClick(rating)}
            onMouseEnter={() => handleMouseEnter(rating)}
            onMouseLeave={handleMouseLeave}
            disabled={readonly}
            className={`
              ${readonly ? 'cursor-default' : 'cursor-pointer hover:scale-110'}
              transition-transform duration-200
            `}
          >
            <Star
              className={`
                ${sizeStyles[size]}
                ${isFilled ? 'fill-[#FFB800] text-[#FFB800]' : 'text-[#DEE2E6]'}
                transition-colors duration-200
              `}
            />
          </button>
        );
      })}
    </div>
  );
};