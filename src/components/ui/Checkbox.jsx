
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

export default Checkbox;
