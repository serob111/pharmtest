import React from 'react';
import { IconMaterial } from '../../iconMaterial/IconMaterial';

interface CheckboxInputProps extends React.InputHTMLAttributes<HTMLInputElement> {
    label: string;
}

export default function CheckboxInput({ label, ...props }: CheckboxInputProps) {
    return (
        <label className="inline-flex items-center  gap-2 cursor-pointer select-none">
            <div className="relative">
                <input
                    type="checkbox"
                    className="peer appearance-none w-5 h-5 border border-gray-300 rounded-md
            checked:bg-blue-700 checked:border-blue-700
            transition-all cursor-pointer"
                    {...props}
                />
                <svg
                    className="w-3 h-3 text-white absolute top-1 left-1 pointer-events-none opacity-0 peer-checked:opacity-100"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="3"
                    strokeLinecap="round"
                    strokeLinejoin="round"
                >
                    <polyline points="20 6 9 17 4 12" />
                </svg>
            </div>

            <span className="text-[#4A5C82] font-normal text-sm">{label}</span>
        </label>
    );
}
