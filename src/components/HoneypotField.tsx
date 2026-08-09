import React from 'react';

interface HoneypotFieldProps {
  name?: string;
  value: string;
  onChange: (value: string) => void;
}

/**
 * Invisible spam trap: real users never see or fill this field (it's
 * positioned off-screen, not display:none, so screen readers skip it via
 * aria-hidden without confusing form autofill). Bots that blindly fill every
 * input trip it, and useLeadCapture silently no-ops on submit.
 */
export const HoneypotField: React.FC<HoneypotFieldProps> = ({
  name = 'company_website',
  value,
  onChange,
}) => (
  <div className="absolute left-[-9999px] top-auto h-0 w-0 overflow-hidden" aria-hidden="true">
    <label htmlFor={name}>Leave this field empty</label>
    <input
      id={name}
      name={name}
      type="text"
      tabIndex={-1}
      autoComplete="off"
      value={value}
      onChange={(e) => onChange(e.target.value)}
    />
  </div>
);

export default HoneypotField;
