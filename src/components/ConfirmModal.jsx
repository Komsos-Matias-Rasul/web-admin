'use client'

import { useEffect } from "react"
import { ModalComponent } from "./ModalComponent"

const VARIANT_CLASSES = {
  primary: "bg-blue-primary hover:bg-blue-400 active:bg-blue-600 disabled:bg-blue-primary/30",
  danger: "bg-rose-500 hover:bg-rose-400 active:bg-rose-600 disabled:bg-rose-500/30",
}

/**
 * Reusable confirmation dialog.
 *
 * @param {object} props
 * @param {boolean} props.isOpen
 * @param {() => void} props.onCancel - Called on "Batalkan" or Escape (ignored while loading).
 * @param {() => void} props.onConfirm
 * @param {string} props.title
 * @param {import("react").ReactNode} [props.message]
 * @param {string} [props.confirmLabel]
 * @param {string} [props.cancelLabel]
 * @param {"primary" | "danger"} [props.variant]
 * @param {boolean} [props.isLoading]
 */
export const ConfirmModal = ({
  isOpen,
  onCancel,
  onConfirm,
  title,
  message,
  confirmLabel = "Lanjutkan",
  cancelLabel = "Batalkan",
  variant = "primary",
  isLoading = false,
}) => {
  useEffect(() => {
    if (!isOpen) return
    const onKeyDown = (e) => {
      if (e.key === "Escape" && !isLoading) onCancel()
    }
    window.addEventListener("keydown", onKeyDown)
    return () => window.removeEventListener("keydown", onKeyDown)
  }, [isOpen, isLoading, onCancel])

  const onSubmit = (e) => {
    e.preventDefault()
    if (!isLoading) onConfirm()
  }

  return (
    <ModalComponent isOpen={isOpen} onBackdropClick={() => !isLoading && onCancel()}>
      <form
        onSubmit={onSubmit}
        className="w-96 text-left"
        role="alertdialog"
        aria-modal="true"
        aria-labelledby="confirm-modal-title"
      >
        <p id="confirm-modal-title" className="text-dark-primary text-lg font-semibold">{title}</p>
        {message && <div className="text-dark-primary/75 mt-4 whitespace-normal">{message}</div>}
        <div className="flex w-full justify-end gap-2 mt-4">
          <button
            className="text-dark-primary/75 font-bold hover:bg-neutral-200 active:bg-neutral-300 px-4 py-2 rounded-lg transition-colors cursor-pointer min-w-28 disabled:text-dark-primary/30 disabled:bg-transparent disabled:cursor-not-allowed"
            type="button"
            onClick={onCancel}
            disabled={isLoading}
          >
            {cancelLabel}
          </button>
          <button
            className={`text-white font-bold px-4 py-2 rounded-lg transition-colors cursor-pointer min-w-28 disabled:cursor-not-allowed ${VARIANT_CLASSES[variant] ?? VARIANT_CLASSES.primary}`}
            type="submit"
            disabled={isLoading}
          >
            {isLoading ? <div className="flex justify-center items-center w-full"><span className="loader"></span></div> : confirmLabel}
          </button>
        </div>
      </form>
    </ModalComponent>
  )
}

