import { ChevronDown, Check } from 'lucide-react';
import { Dropdown } from '../../shared/components/Dropdown';

export interface DropdownFilterOption<T extends string = string> {
  label: string;
  value: T;
}

export interface DropdownFilterProps<T extends string = string> {
  label: string;
  value: T;
  options: (T | DropdownFilterOption<T>)[];
  onChange: (value: T) => void;
  allLabel?: string;
  className?: string;
}

export function DropdownFilter<T extends string = string>({
  label,
  value,
  options,
  onChange,
  allLabel,
  className = 'min-w-35',
}: DropdownFilterProps<T>) {
  return (
    <Dropdown
      trigger={
        <div
          className={`h-10 px-3.5 py-2 bg-white border border-slate-200 rounded-lg text-sm font-medium text-slate-700 flex items-center justify-between gap-3 shadow-2xs hover:bg-slate-50 transition-colors cursor-pointer ${className}`}
        >
          <span>
            {label}: {value}
          </span>
          <ChevronDown className="w-4 h-4 text-slate-500" />
        </div>
      }
    >
      {options.map((option) => {
        const optValue = typeof option === 'string' ? option : option.value;
        const optLabel =
          typeof option === 'string'
            ? option === 'All' && allLabel
              ? allLabel
              : option
            : option.label;
        const isSelected = value === optValue;

        return (
          <button
            key={optValue}
            type="button"
            onClick={() => onChange(optValue as T)}
            className="w-full text-left px-3.5 py-2 text-sm text-slate-700 hover:bg-slate-50 flex items-center justify-between transition-colors cursor-pointer"
          >
            <span>{optLabel}</span>
            {isSelected && <Check className="w-4 h-4 text-slate-900" />}
          </button>
        );
      })}
    </Dropdown>
  );
}

export default DropdownFilter;
