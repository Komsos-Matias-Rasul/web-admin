export const ModalComponent = ({isOpen, onClose, children}) => {
  return (
    <div className={`
      fixed inset-0 flex justify-center z-100
      items-center transition-colors 
      ${isOpen ? "visible bg-dark-primary/40" : "invisible" }
    `}>
      <div className={`bg-white p-4 rounded-lg transition-opacity ${isOpen ? "opacity-100" : "opacity-0" }`}>
        {children}
      </div>
    </div>
  )
}