import React, { useRef, useState } from 'react';
import { Camera, Upload, X, Check, Image as ImageIcon } from 'lucide-react';

interface PhotoUploadFieldProps {
  label: string;
  value: string;
  onChange: (url: string) => void;
  entityType?: 'student' | 'teacher' | 'staff';
  helperText?: string;
  className?: string;
}

// Curated high quality avatars for quick 1-click selection if user prefers presets
const STUDENT_PRESETS = [
  { label: 'Student 1', url: 'https://images.unsplash.com/photo-1544717305-2782549b5136?w=150&auto=format&fit=crop&q=80' },
  { label: 'Student 2', url: 'https://images.unsplash.com/photo-1517841905240-472988babdf9?w=150&auto=format&fit=crop&q=80' },
  { label: 'Student 3', url: 'https://images.unsplash.com/photo-1539571696357-5a69c17a67c6?w=150&auto=format&fit=crop&q=80' },
  { label: 'Student 4', url: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=150&auto=format&fit=crop&q=80' },
  { label: 'Student 5', url: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=150&auto=format&fit=crop&q=80' },
];

const STAFF_PRESETS = [
  { label: 'Faculty 1', url: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=150&auto=format&fit=crop&q=80' },
  { label: 'Faculty 2', url: 'https://images.unsplash.com/photo-1580894732444-8ecded7900cd?w=150&auto=format&fit=crop&q=80' },
  { label: 'Admin 1', url: 'https://images.unsplash.com/photo-1472099645785-5658abf4ff4e?w=150&auto=format&fit=crop&q=80' },
  { label: 'Staff 1', url: 'https://images.unsplash.com/photo-1500648767791-00dcc994a43e?w=150&auto=format&fit=crop&q=80' },
  { label: 'Staff 2', url: 'https://images.unsplash.com/photo-1544005313-94ddf0286df2?w=150&auto=format&fit=crop&q=80' },
];

export const PhotoUploadField: React.FC<PhotoUploadFieldProps> = ({
  label,
  value,
  onChange,
  entityType = 'student',
  helperText = '(Optional / गैर-अनिवार्य)',
  className = '',
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [showPresets, setShowPresets] = useState(false);
  const presets = entityType === 'student' ? STUDENT_PRESETS : STAFF_PRESETS;

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      const reader = new FileReader();
      reader.onload = () => {
        if (typeof reader.result === 'string') {
          onChange(reader.result);
        }
      };
      reader.readAsDataURL(file);
    }
  };

  return (
    <div className={`space-y-1.5 ${className}`}>
      <div className="flex items-center justify-between">
        <label className="block text-xs font-bold text-slate-700">
          {label} <span className="text-slate-400 font-normal text-[11px]">{helperText}</span>
        </label>
        {value && (
          <button
            type="button"
            onClick={() => {
              onChange('');
              if (fileInputRef.current) fileInputRef.current.value = '';
            }}
            className="text-[11px] text-rose-600 hover:text-rose-700 font-medium flex items-center space-x-0.5 cursor-pointer"
          >
            <X className="w-3 h-3" />
            <span>Remove</span>
          </button>
        )}
      </div>

      <div className="flex items-center space-x-3 p-2.5 rounded-xl border border-slate-200 bg-slate-50/70">
        {/* Photo Preview Circle */}
        <div className="relative group shrink-0">
          {value ? (
            <img
              src={value}
              alt="Preview"
              className="w-12 h-12 rounded-full object-cover border-2 border-emerald-500 shadow-xs"
            />
          ) : (
            <div className="w-12 h-12 rounded-full bg-slate-200 border-2 border-dashed border-slate-300 flex items-center justify-center text-slate-400">
              <Camera className="w-5 h-5" />
            </div>
          )}
          <button
            type="button"
            onClick={() => fileInputRef.current?.click()}
            className="absolute -bottom-1 -right-1 p-1 rounded-full bg-blue-600 text-white shadow-xs hover:bg-blue-700 transition cursor-pointer"
            title="Upload from device"
          >
            <Upload className="w-3 h-3" />
          </button>
        </div>

        {/* Action Buttons */}
        <div className="flex-1 space-y-1">
          <div className="flex items-center space-x-2">
            <input
              ref={fileInputRef}
              type="file"
              accept="image/*"
              className="hidden"
              onChange={handleFileChange}
            />
            <button
              type="button"
              onClick={() => fileInputRef.current?.click()}
              className="px-2.5 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-semibold shadow-2xs transition flex items-center space-x-1 cursor-pointer"
            >
              <Upload className="w-3.5 h-3.5 text-blue-600" />
              <span>Choose Photo</span>
            </button>

            <button
              type="button"
              onClick={() => setShowPresets(!showPresets)}
              className="px-2 py-1.5 rounded-lg bg-white border border-slate-300 hover:bg-slate-100 text-slate-700 text-xs font-medium transition flex items-center space-x-1 cursor-pointer"
            >
              <ImageIcon className="w-3.5 h-3.5 text-amber-500" />
              <span>Presets</span>
            </button>
          </div>

          <p className="text-[10px] text-slate-400">
            Select an image file (JPG, PNG) or choose from preset photos.
          </p>
        </div>
      </div>

      {/* Preset selector popout */}
      {showPresets && (
        <div className="p-2 bg-white rounded-lg border border-slate-200 shadow-sm space-y-1.5 animate-fade-in">
          <div className="flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-600">Click to choose a preset photo:</span>
            <button
              type="button"
              onClick={() => setShowPresets(false)}
              className="text-[10px] text-slate-400 hover:text-slate-600"
            >
              Close
            </button>
          </div>
          <div className="flex items-center space-x-2 overflow-x-auto py-1">
            {presets.map((preset, idx) => (
              <button
                key={idx}
                type="button"
                onClick={() => {
                  onChange(preset.url);
                  setShowPresets(false);
                }}
                className={`relative shrink-0 rounded-full p-0.5 border-2 transition cursor-pointer ${
                  value === preset.url ? 'border-emerald-600 ring-2 ring-emerald-300' : 'border-transparent hover:border-slate-300'
                }`}
                title={preset.label}
              >
                <img
                  src={preset.url}
                  alt={preset.label}
                  className="w-9 h-9 rounded-full object-cover"
                />
                {value === preset.url && (
                  <span className="absolute bottom-0 right-0 bg-emerald-600 text-white rounded-full p-0.5">
                    <Check className="w-2.5 h-2.5" />
                  </span>
                )}
              </button>
            ))}
          </div>
        </div>
      )}
    </div>
  );
};
