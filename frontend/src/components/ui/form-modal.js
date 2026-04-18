"use client"

import Modal from "./modal"
import { Button } from "./button"

export default function FormModal({
  isOpen,
  onClose,
  title,
  children,
  onSubmit,
  onCancel,
  submitLabel = "Enregistrer",
  cancelLabel = "Annuler",
  isLoading = false,
  size = "md",
}) {
  const handleSubmit = (e) => {
    e.preventDefault()
    if (window.patientFormSubmit) {
      window.patientFormSubmit()
    }
    onSubmit?.(e)
  }

  const handleCancel = () => {
    onCancel?.() || onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} title={title} size={size} showCloseButton={false}>
      <form onSubmit={handleSubmit} className="space-y-6">
        {children}

        {/* Actions */}
        <div className="flex justify-end space-x-3 pt-4 border-t border-gray-200">
          <Button type="button" variant="outline" onClick={handleCancel} disabled={isLoading}>
            {cancelLabel}
          </Button>
          <Button type="submit" disabled={isLoading} className="bg-primary hover:bg-primary/90">
            {isLoading ? "Enregistrement..." : submitLabel}
          </Button>
        </div>
      </form>
    </Modal>
  )
}
