
import React from 'react';

const Checkbox = ({ id, checked, onChange, label, className = "" }) => {
  return (
    <div className={`flex items-center space-x-2 ${className}`}>
      <input
        type="checkbox"
        id={id}
        checked={checked}
        onChange={onChange}
        className="h-4 w-4 text-accent border-border rounded focus:ring-accent"
      />
      {label && (
        <label htmlFor={id} className="text-sm text-foreground cursor-pointer">
          {label}
        </label>
      )}
    </div>
  );
};

export { Checkbox };
export default Checkbox;
