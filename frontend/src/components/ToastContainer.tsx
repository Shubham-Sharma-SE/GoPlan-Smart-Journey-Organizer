import React from 'react';
import { useAppContext } from '../hooks/useAppContext';
import { X, CheckCircle, AlertTriangle, AlertCircle, Info } from 'lucide-react';

export const ToastContainer: React.FC = () => {
  const { toasts, dismissToast } = useAppContext();

  if (toasts.length === 0) return null;

  return (
    <div className="fixed top-4 right-4 z-50 flex flex-col gap-2 max-w-sm w-full">
      {toasts.map(toast => {
        let bgColor = 'bg-blue-50 border-blue-200 text-blue-800';
        let Icon = Info;
        
        switch (toast.type) {
          case 'success':
            bgColor = 'bg-emerald-50 border-emerald-200 text-emerald-800';
            Icon = CheckCircle;
            break;
          case 'error':
            bgColor = 'bg-rose-50 border-rose-200 text-rose-800';
            Icon = AlertCircle;
            break;
          case 'warning':
            bgColor = 'bg-amber-50 border-amber-200 text-amber-800';
            Icon = AlertTriangle;
            break;
          case 'info':
            bgColor = 'bg-sky-50 border-sky-200 text-sky-800';
            Icon = Info;
            break;
        }

        return (
          <div
            key={toast.id}
            className={`flex items-start gap-3 p-4 rounded-xl border shadow-lg transition-all duration-300 transform translate-y-0 animate-fade-in ${bgColor}`}
          >
            <Icon className="w-5 h-5 flex-shrink-0 mt-0.5" />
            <div className="flex-1 text-sm font-medium">{toast.message}</div>
            <button
              onClick={() => dismissToast(toast.id)}
              className="hover:opacity-75 flex-shrink-0"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        );
      })}
    </div>
  );
};
