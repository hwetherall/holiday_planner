'use client';
import { useState, useRef, useEffect } from 'react';

interface PinInputProps {
  value: string;
  onChange: (value: string) => void;
  length?: number;
  className?: string;
}

export default function PinInput({ value, onChange, length = 4, className = '' }: PinInputProps) {
  const [focusedIndex, setFocusedIndex] = useState(0);
  const inputRefs = useRef<(HTMLInputElement | null)[]>([]);

  useEffect(() => {
    // Initialize refs array
    inputRefs.current = inputRefs.current.slice(0, length);
  }, [length]);

  const handleInputChange = (index: number, inputValue: string) => {
    if (inputValue.length > 1) {
      inputValue = inputValue.slice(-1); // Take only the last character
    }

    const newValue = value.split('');
    newValue[index] = inputValue;
    const result = newValue.join('').slice(0, length);
    
    onChange(result);

    // Move to next input if character was entered
    if (inputValue && index < length - 1) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleKeyDown = (index: number, e: React.KeyboardEvent<HTMLInputElement>) => {
    if (e.key === 'Backspace') {
      if (value[index] === '') {
        // Move to previous input if current is empty
        if (index > 0) {
          setFocusedIndex(index - 1);
          inputRefs.current[index - 1]?.focus();
        }
      } else {
        // Clear current input
        const newValue = value.split('');
        newValue[index] = '';
        onChange(newValue.join(''));
      }
    } else if (e.key === 'ArrowLeft' && index > 0) {
      setFocusedIndex(index - 1);
      inputRefs.current[index - 1]?.focus();
    } else if (e.key === 'ArrowRight' && index < length - 1) {
      setFocusedIndex(index + 1);
      inputRefs.current[index + 1]?.focus();
    }
  };

  const handleFocus = (index: number) => {
    setFocusedIndex(index);
  };

  const handleClick = (index: number) => {
    setFocusedIndex(index);
    inputRefs.current[index]?.focus();
  };

  return (
    <div className={`flex gap-3 justify-center ${className}`}>
      {Array.from({ length }, (_, index) => (
        <input
          key={index}
          ref={(el) => {
            inputRefs.current[index] = el;
          }}
          type="text"
          inputMode="numeric"
          pattern="[0-9]*"
          maxLength={1}
          value={value[index] || ''}
          onChange={(e) => handleInputChange(index, e.target.value)}
          onKeyDown={(e) => handleKeyDown(index, e)}
          onFocus={() => handleFocus(index)}
          onClick={() => handleClick(index)}
          className={`
            w-12 h-12 text-center text-xl font-semibold rounded-lg border-2 transition-all
            ${focusedIndex === index 
              ? 'border-emerald-500 bg-emerald-50' 
              : 'border-gray-300 bg-white hover:border-gray-400'
            }
            focus:outline-none focus:ring-2 focus:ring-emerald-500 focus:ring-opacity-50
          `}
        />
      ))}
    </div>
  );
}
