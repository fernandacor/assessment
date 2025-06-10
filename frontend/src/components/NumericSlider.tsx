'use client';

import React from 'react';

interface NumericSliderProps {
  label: string;
  min: number;
  max: number;
  step?: number;
  value: number;
  onChange: (value: number) => void;
}

const NumericSlider: React.FC<NumericSliderProps> = ({
  label,
  min,
  max,
  step = 1,
  value,
  onChange,
}) => {
  return (
    
// Numeric Slider Component
    <div className="w-full max-w-md mx-auto py-6">
      <label className="block text-[#355C7D] text-lg font-medium mb-2">{label}</label>
      <input
        type="range"
        className="w-full accent-[#355C7D] bg-[#C5CAE9] rounded-lg h-2 focus:outline-none focus:ring-2 focus:ring-[#C5CAE9] focus:ring-opacity-50"
        min={min}
        max={max}
        step={step}
        value={value}
        onChange={(e) => onChange(Number(e.target.value))}
      />
      <div className="text-[#355C7D] text-center mt-2 text-xl font-semibold">
        {value}
      </div>
    </div>
  );
};

export default NumericSlider;