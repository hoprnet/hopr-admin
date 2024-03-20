export default function RemoveMessages() {
  return (
    <svg
      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="HubIcon"
    >
      <defs>
        <mask id="AddAliasMask">
          <circle
            r="50"
            cx="0"
            cy="0"
            fill="white"
          />
          <circle
            r="8"
            cx="18"
            cy="16.5"
            fill="black"
          />
        </mask>
      </defs>
      <path
        mask="url(#AddAliasMask)"
        d="M20 4H4c-1.1 0-2 .9-2 2v12c0 1.1.9 2 2 2h9v-2H4V8l8 5 8-5v5h2V6c0-1.1-.9-2-2-2zm-8 7L4 6h16l-8 5zm7 4 4 4-4 4v-3h-4v-2h4v-3z">
      </path>
      <path
        style={{ transform: 'scale(0.73) translate(12px, 12px)' }}
        d="M14.12 10.47 12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"
      />
    </svg>
  );
}
