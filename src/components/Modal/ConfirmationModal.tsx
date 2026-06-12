import React from 'react';
import { AlertTriangle } from 'lucide-react';

interface ConfirmationModalProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
}

const ConfirmationModal: React.FC<ConfirmationModalProps> = ({
  isOpen,
  title,
  message,
  confirmText = 'Delete',
  cancelText = 'Cancel',
  onConfirm,
  onCancel,
  type = 'danger',
}) => {
  if (!isOpen) return null;

  const typeColorMap = {
    danger: {
      iconBg: 'bg-rose-100 dark:bg-rose-950 text-rose-600 dark:text-rose-400',
      buttonBg: 'bg-rose-600 hover:bg-rose-700 focus:ring-rose-500 text-white',
    },
    warning: {
      iconBg: 'bg-amber-100 dark:bg-amber-950 text-amber-600 dark:text-amber-400',
      buttonBg: 'bg-amber-600 hover:bg-amber-700 focus:ring-amber-500 text-white',
    },
    info: {
      iconBg: 'bg-blue-100 dark:bg-blue-950 text-blue-600 dark:text-blue-400',
      buttonBg: 'bg-blue-600 hover:bg-blue-700 focus:ring-blue-500 text-white',
    },
  };

  const colors = typeColorMap[type];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center overflow-y-auto px-4">
      {/* Backdrop */}
      <div 
        className="fixed inset-0 bg-slate-900/60 dark:bg-slate-950/80 backdrop-blur-xs transition-opacity" 
        onClick={onCancel}
      ></div>

      {/* Modal Content */}
      <div className="relative transform overflow-hidden rounded-2xl bg-white dark:bg-slate-900 p-6 text-left shadow-2xl transition-all sm:my-8 sm:w-full sm:max-w-lg border border-slate-200 dark:border-slate-800 animate-scale-up">
        <div className="sm:flex sm:items-start">
          <div className={`mx-auto flex h-12 w-12 shrink-0 items-center justify-center rounded-full sm:mx-0 sm:h-10 sm:w-10 ${colors.iconBg}`}>
            <AlertTriangle className="h-6 w-6" aria-hidden="true" />
          </div>
          
          <div className="mt-3 text-center sm:mt-0 sm:ml-4 sm:text-left">
            <h3 className="text-lg font-semibold leading-6 text-slate-900 dark:text-white">
              {title}
            </h3>
            <div className="mt-2">
              <p className="text-sm text-slate-500 dark:text-slate-400">
                {message}
              </p>
            </div>
          </div>
        </div>

        <div className="mt-6 sm:mt-4 sm:flex sm:flex-row-reverse gap-2">
          <button
            type="button"
            className={`inline-flex w-full justify-center rounded-xl px-4 py-2.5 text-sm font-semibold shadow-sm transition-colors sm:w-auto ${colors.buttonBg}`}
            onClick={onConfirm}
          >
            {confirmText}
          </button>
          
          <button
            type="button"
            className="mt-3 inline-flex w-full justify-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-800 px-4 py-2.5 text-sm font-semibold text-slate-700 dark:text-slate-300 hover:bg-slate-50 dark:hover:bg-slate-700/50 shadow-sm transition-colors sm:mt-0 sm:w-auto"
            onClick={onCancel}
          >
            {cancelText}
          </button>
        </div>
      </div>
    </div>
  );
};

export default ConfirmationModal;
