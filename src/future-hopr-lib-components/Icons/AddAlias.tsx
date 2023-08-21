export default function AddAlias() {
  return (
    <svg
      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium"
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
            r="7.5"
            cx="17.5"
            cy="17.5"
            fill="black"
          />
        </mask>
      </defs>
      <path
        mask="url(#AddAliasMask)"
        d="M22 3H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm3.85-4h1.64L21 16l-1.99 1.99c-1.31-.98-2.28-2.38-2.73-3.99-.18-.64-.28-1.31-.28-2s.1-1.36.28-2c.45-1.62 1.42-3.01 2.73-3.99L21 8l-1.51 2h-1.64c-.22.63-.35 1.3-.35 2s.13 1.37.35 2z"
      ></path>
      <path
        style={{ transform: 'scale(0.65) translate(15px, 15px)' }}
        d="M13 7h-2v4H7v2h4v4h2v-4h4v-2h-4V7zm-1-5C6.48 2 2 6.48 2 12s4.48 10 10 10 10-4.48 10-10S17.52 2 12 2zm0 18c-4.41 0-8-3.59-8-8s3.59-8 8-8 8 3.59 8 8-3.59 8-8 8z"
      />
    </svg>
  );
}
