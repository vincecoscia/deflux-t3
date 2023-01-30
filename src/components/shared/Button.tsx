import React from "react";
import { classNames } from './Utils'

interface ButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

interface PageButtonProps {
  children?: React.ReactNode;
  className?: string;
  onClick?: () => void;
  disabled?: boolean;
}

export const Button: React.FC<ButtonProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <button
      type="button"
      className={classNames(
        "relative inline-flex items-center px-4 py-2 border border-gray-300 text-sm font-medium rounded-md text-gray-700 bg-white hover:bg-gray-50",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}

export const PageButton: React.FC<PageButtonProps> = ({
  children,
  className,
  ...rest
}) => {
  return (
    <button
      type="button"
      className={classNames(
        "relative inline-flex items-center px-2 py-2 border border-gray-800 text-sm font-medium bg-gray-600 text-white hover:bg-gray-500",
        className
      )}
      {...rest}
    >
      {children}
    </button>
  );
}