'use client';

interface Props {
  current: string;
  onChange: (locale: string) => void;
}

export default function LanguageSwitcher({ current, onChange }: Props) {
  return (
    <div className="mb-6 flex gap-2">
      <button
        onClick={() => onChange('en')}
        className={`px-3 py-1 rounded ${
          current === 'en' ? 'bg-blue-600 text-white' : 'bg-gray-200'
        }`}
      >
        EN
      </button>

      <button
        onClick={() => onChange('es')}
        className={`px-3 py-1 rounded ${
          current === 'es' ? 'bg-blue-600 text-white' : 'bg-gray-200'
        }`}
      >
        ES
      </button>
    </div>
  );
}
