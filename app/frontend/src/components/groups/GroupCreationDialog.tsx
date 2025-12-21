import React, { useState, useEffect, useCallback } from 'react';
import { useTranslation } from 'react-i18next';
import { useGroupStore } from '../../stores/useGroupStore';
import { CreateGroupDto } from '../../types/Group';

interface GroupCreationDialogProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess?: (groupId: string) => void;
}

interface FormErrors {
  name?: string;
  description?: string;
}

function GroupCreationDialog({ isOpen, onClose, onSuccess }: GroupCreationDialogProps) {
  const { t: translation } = useTranslation();
  const { createGroup, loading, error: storeError, clearError } = useGroupStore();

  const [formData, setFormData] = useState<CreateGroupDto>({
    name: '',
    description: '',
  });

  const [errors, setErrors] = useState<FormErrors>({});
  const [touched, setTouched] = useState<{ name: boolean; description: boolean }>({
    name: false,
    description: false,
  });
  const [successMessage, setSuccessMessage] = useState<string | null>(null);
  const [prevIsOpen, setPrevIsOpen] = useState(false);

  // Reset form when dialog opens (using derived state pattern)
  if (isOpen && !prevIsOpen) {
    setFormData({ name: '', description: '' });
    setErrors({});
    setTouched({ name: false, description: false });
    setSuccessMessage(null);
    clearError();
    setPrevIsOpen(true);
  } else if (!isOpen && prevIsOpen) {
    setPrevIsOpen(false);
  }

  // Validate name field
  const validateName = useCallback(
    (name: string): string | undefined => {
      const trimmedName = name.trim();
      if (!trimmedName) {
        return translation('groups.errors.nameRequired');
      }
      if (trimmedName.length < 3) {
        return translation('groups.errors.nameTooShort');
      }
      if (trimmedName.length > 100) {
        return translation('groups.errors.nameTooLong');
      }
      return undefined;
    },
    [translation],
  );

  // Validate description field
  const validateDescription = useCallback(
    (description?: string): string | undefined => {
      if (description && description.length > 500) {
        return translation('groups.errors.descriptionTooLong');
      }
      return undefined;
    },
    [translation],
  );

  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData((prev) => ({ ...prev, [name]: value }));

    // Validate on change if field was already touched
    if (touched[name as keyof typeof touched]) {
      const newErrors = { ...errors };
      if (name === 'name') {
        const error = validateName(value);
        if (error) {
          newErrors.name = error;
        } else {
          delete newErrors.name;
        }
      } else if (name === 'description') {
        const error = validateDescription(value);
        if (error) {
          newErrors.description = error;
        } else {
          delete newErrors.description;
        }
      }
      setErrors(newErrors);
    }
  };

  const handleBlur = (field: 'name' | 'description') => {
    setTouched((prev) => ({ ...prev, [field]: true }));

    // Validate on blur
    const newErrors = { ...errors };
    if (field === 'name') {
      const error = validateName(formData.name);
      if (error) {
        newErrors.name = error;
      } else {
        delete newErrors.name;
      }
    } else if (field === 'description') {
      const error = validateDescription(formData.description);
      if (error) {
        newErrors.description = error;
      } else {
        delete newErrors.description;
      }
    }
    setErrors(newErrors);
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Mark all fields as touched
    setTouched({ name: true, description: true });

    // Validate all fields
    const nameError = validateName(formData.name);
    const descError = validateDescription(formData.description);

    if (nameError || descError) {
      setErrors({
        name: nameError,
        description: descError,
      });
      return;
    }

    try {
      const newGroup = await createGroup({
        name: formData.name.trim(),
        description: formData.description?.trim() || undefined,
      });

      // Show success message
      setSuccessMessage(translation('groups.createSuccess'));

      // Call onSuccess callback with the new group ID
      if (onSuccess) {
        onSuccess(newGroup.id);
      }

      // Close dialog after a brief delay to show success message
      setTimeout(() => {
        onClose();
      }, 1500);
    } catch (error) {
      // Error is already set in the store
      console.error('Failed to create group:', error);
    }
  };

  const handleClose = () => {
    if (!loading) {
      onClose();
    }
  };

  if (!isOpen) return null;

  return (
    <div className="modal-overlay" onClick={handleClose}>
      <div className="modal-content" onClick={(e) => e.stopPropagation()}>
        <div className="modal-header">
          <h3>{translation('groups.createGroupTitle')}</h3>
          <button
            className="modal-close"
            onClick={handleClose}
            disabled={loading}
            aria-label={translation('common.cancel')}
          >
            ✕
          </button>
        </div>

        <form onSubmit={handleSubmit}>
          {/* Success message */}
          {successMessage && (
            <div className="alert alert-success" role="alert">
              {successMessage}
            </div>
          )}

          {/* Error message from store */}
          {storeError && (
            <div className="alert alert-error" role="alert">
              {storeError}
            </div>
          )}

          {/* Group Name field */}
          <div className="form-group">
            <label htmlFor="groupName">
              {translation('groups.nameLabel')} <span className="required">*</span>
            </label>
            <input
              id="groupName"
              name="name"
              type="text"
              className={`form-control ${errors.name && touched.name ? 'error' : ''}`}
              value={formData.name}
              onChange={handleChange}
              onBlur={() => handleBlur('name')}
              disabled={loading}
              placeholder={translation('groups.namePlaceholder')}
              aria-required="true"
              aria-invalid={!!errors.name && touched.name}
              aria-describedby={errors.name && touched.name ? 'nameError' : undefined}
            />
            {errors.name && touched.name && (
              <span id="nameError" className="error-message" role="alert">
                {errors.name}
              </span>
            )}
            <span className="help-text">{translation('groups.nameHelp')}</span>
          </div>

          {/* Description field */}
          <div className="form-group">
            <label htmlFor="groupDescription">{translation('groups.descriptionLabel')}</label>
            <textarea
              id="groupDescription"
              name="description"
              className={`form-control ${errors.description && touched.description ? 'error' : ''}`}
              value={formData.description}
              onChange={handleChange}
              onBlur={() => handleBlur('description')}
              disabled={loading}
              placeholder={translation('groups.descriptionPlaceholder')}
              rows={4}
              aria-invalid={!!errors.description && touched.description}
              aria-describedby={errors.description && touched.description ? 'descError' : undefined}
            />
            {errors.description && touched.description && (
              <span id="descError" className="error-message" role="alert">
                {errors.description}
              </span>
            )}
            <span className="help-text">{translation('groups.descriptionHelp')}</span>
          </div>

          {/* Actions */}
          <div className="modal-actions">
            <button
              type="button"
              className="btn btn-secondary"
              onClick={handleClose}
              disabled={loading}
            >
              {translation('common.cancel')}
            </button>
            <button
              type="submit"
              className="btn btn-primary"
              disabled={loading || Object.keys(errors).length > 0}
            >
              {loading ? translation('groups.creating') : translation('groups.createGroup')}
            </button>
          </div>
        </form>
      </div>
    </div>
  );
}

export default GroupCreationDialog;
