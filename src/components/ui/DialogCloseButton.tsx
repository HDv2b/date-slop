const DialogCloseButton = ({ onClick }: { onClick: () => void }) => (
  <button
    type="button"
    onClick={onClick}
    aria-label="Close"
    className="absolute top-1 right-1 inline-flex h-8 w-8 items-center justify-center rounded-xl bg-red-700 text-white hover:bg-red-800 focus:ring-4 focus:ring-red-300 focus:outline-none"
  >
    <svg
      viewBox="0 0 24 24"
      aria-hidden="true"
      fill="none"
      stroke="currentColor"
      strokeWidth={2.5}
      strokeLinecap="round"
      className="h-4 w-4"
    >
      <path d="M6 6l12 12M18 6L6 18" />
    </svg>
  </button>
);

export default DialogCloseButton;
