
import React from 'react';

const Checkbox = ({ checked, onChange, label, ...props }) => {
  return (
    <label className="flex items-center space-x-2 cursor-pointer">
      <input
        type="checkbox"
        checked={checked}
        onChange={onChange}
        className="w-4 h-4 text-blue-600 bg-gray-100 border-gray-300 rounded focus:ring-blue-500 focus:ring-2"
        {...props}
      />
      {label && <span className="text-sm font-medium text-gray-900">{label}</span>}
    </label>
  );
};

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
