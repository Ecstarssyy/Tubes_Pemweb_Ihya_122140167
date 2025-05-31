// src/components/Button.jsx
import React from 'react';

function Button({ children, onClick, variant = 'primary', type = 'button', className = '', size = 'md', disabled = false, icon: IconComponent, iconPosition = 'left' }) {
  let baseStyle = "font-semibold rounded-lg focus:outline-none focus:ring-2 focus:ring-opacity-75 transition-all duration-300 transform active:scale-95 inline-flex items-center justify-center";
  let variantStyle = "";
  let sizeStyle = "";

  // Menggunakan warna dari tailwind.config.js
  if (variant === 'primary') {
    variantStyle = "bg-brand-action text-white hover:bg-brand-action-hover focus:ring-brand-action shadow-custom-light hover:shadow-custom-strong";
  } else if (variant === 'secondary') {
    variantStyle = "bg-transparent text-brand-action hover:bg-gray-100 focus:ring-brand-action border border-brand-action shadow-custom-light hover:shadow-custom-strong";
  } else if (variant === 'dark') {
    variantStyle = "bg-brand-dark text-white hover:bg-opacity-80 focus:ring-brand-dark shadow-custom-light hover:shadow-custom-strong";
  } else if (variant === 'light') {
    variantStyle = "bg-brand-bg text-brand-dark hover:bg-brand-light focus:ring-brand-medium border border-brand-light shadow-custom-light hover:shadow-custom-strong";
  } else if (variant === 'danger') {
    variantStyle = "bg-red-600 text-white hover:bg-red-700 focus:ring-red-500 shadow-custom-light hover:shadow-custom-strong";
  } else if (variant === 'ghost') {
    variantStyle = "bg-transparent text-brand-action hover:bg-gray-100 focus:ring-brand-action";
  }


  if (size === 'sm') {
    sizeStyle = "px-3 py-1.5 text-sm";
    if (IconComponent) sizeStyle += " space-x-1.5";
  } else if (size === 'lg') {
    sizeStyle = "px-8 py-3 text-lg";
     if (IconComponent) sizeStyle += " space-x-2.5";
  } else { // md (default)
    sizeStyle = "px-5 py-2.5 text-base";
     if (IconComponent) sizeStyle += " space-x-2";
  }
  
  if (disabled) {
    baseStyle += " opacity-50 cursor-not-allowed";
  }

  const iconSize = size === 'sm' ? 16 : (size === 'lg' ? 20 : 18);

  return (
    <button
      type={type}
      onClick={onClick}
      disabled={disabled}
      className={`${baseStyle} ${variantStyle} ${sizeStyle} ${className}`}
    >
      {IconComponent && iconPosition === 'left' && <IconComponent size={iconSize} />}
      {children}
      {IconComponent && iconPosition === 'right' && <IconComponent size={iconSize} />}
    </button>
  );
}

export default Button;