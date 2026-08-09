import React from 'react';
import { Link } from 'react-router-dom';

interface ConsentCheckboxProps {
  id: string;
  checked: boolean;
  onChange: (checked: boolean) => void;
}

export const ConsentCheckbox: React.FC<ConsentCheckboxProps> = ({ id, checked, onChange }) => (
  <label htmlFor={id} className="flex items-start gap-3 text-sm text-white/60">
    <input
      id={id}
      type="checkbox"
      required
      checked={checked}
      onChange={(e) => onChange(e.target.checked)}
      className="mt-0.5 h-4 w-4 shrink-0 rounded border-white/20 bg-white/[0.04] text-violet accent-violet focus:ring-violet"
    />
    <span>
      I agree to the{' '}
      <Link to="/privacy" target="_blank" rel="noopener noreferrer" className="text-cyan underline-offset-4 hover:underline">
        Privacy Policy
      </Link>
      .
    </span>
  </label>
);

export default ConsentCheckbox;
