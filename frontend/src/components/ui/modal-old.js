"use client"

import { useEffect } from "react"
import { X } from "lucide-react"

export default function Modal({ isOpen, onClose, title, children, size = "md", showCloseButton = true }) {
  const sizeClasses = {
    sm: "max-w-md",
    md: "max-w-lg",
    lg: "max-w-2xl",
    xl: "max-w-4xl",
  }

  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden"

      const handleEscape = (e) => {
        if (e.key === "Escape") {
          onClose()
        }
      }

      document.addEventListener("keydown", handleEscape)

      return () => {
        document.body.style.overflow = "unset"
        document.removeEventListener("keydown", handleEscape)
      }
    }
  }, [isOpen, onClose])

  if (!isOpen) return null

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto">
      <div className="fixed inset-0 bg-black/50 backdrop-blur-sm transition-opacity" onClick={onClose} />

      <div className="flex min-h-full items-center justify-center p-4">
        <div
          className={`relative w-full ${sizeClasses[size]} transform overflow-hidden rounded-2xl bg-white shadow-2xl transition-all animate-in fade-in-0 zoom-in-95 duration-300`}
          onClick={(e) => e.stopPropagation()}
        >
          <div className="flex items-center justify-between p-6 border-b border-gray-200">
            <h3 className="text-lg font-semibold text-gray-900 font-display">{title}</h3>
            {showCloseButton && (
              <button
                type="button"
                onClick={onClose}
                className="h-8 w-8 p-0 hover:bg-gray-100 rounded-full flex items-center justify-center transition-colors"
              >
                <X className="h-4 w-4" />
              </button>
            )}
          </div>

          <div className="p-6">{children}</div>
        </div>
      </div>
    </div>
  )
}
