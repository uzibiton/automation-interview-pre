import React from 'react';
import { useTranslation } from 'react-i18next';

interface ConfirmationDialogProps {
  isOpen: boolean;
  title: string;
  message: string;
  confirmText?: string;
  cancelText?: string;
  onConfirm: () => void;
  onCancel: () => void;
  type?: 'danger' | 'warning' | 'info';
  children?: React.ReactNode;
}

function ConfirmationDialog({
  isOpen,
  title,
  message,
  confirmText,
  cancelText,
  onConfirm,
  onCancel,
  type = 'info',
  children,
}: ConfirmationDialogProps) {
  const { t: translation } = useTranslation();

  if (!isOpen) return null;

  const getConfirmButtonClass = () => {
    switch (type) {
      case 'danger':
        return 'btn btn-danger';
      case 'warning':
        return 'btn btn-warning';
      default:
        return 'btn btn-primary';
    }
  };

  return (
    <div className="modal-overlay" onClick={onCancel} data-testid="confirmation-dialog-overlay">
      <div className="modal-content confirmation-dialog" onClick={(e) => e.stopPropagation()} data-testid="confirmation-dialog">
        <div className="modal-header">
          <h3>{title}</h3>
          <button className="modal-close" onClick={onCancel} data-testid="confirmation-dialog-close-button">
            ✕
          </button>
        </div>
        <div className="confirmation-message">
          {message && <p>{message}</p>}
          {children}
        </div>
        <div className="modal-actions">
          <button type="button" className="btn btn-secondary" onClick={onCancel} data-testid="confirmation-dialog-cancel-button">
            {cancelText || translation('common.cancel')}
          </button>
          <button type="button" className={getConfirmButtonClass()} onClick={onConfirm} data-testid="confirmation-dialog-confirm-button">
            {confirmText || translation('common.confirm')}
          </button>
        </div>
      </div>
    </div>
  );
}

export default ConfirmationDialog;
