const DialogCloseButton = ({
  onClick,
  className = "absolute top-1 right-1 rounded-xl bg-red-700 px-3 pt-0.5 pb-1 text-xl font-medium text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 focus:outline-none",
}: {
  onClick: () => void;
  className?: string;
}) => (
  <button type="button" onClick={onClick} className={className}>
    &times;
  </button>
);

export default DialogCloseButton;
