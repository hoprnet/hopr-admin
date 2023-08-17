export default function Withdraw() {
  return (
    <svg
      className="MuiSvgIcon-root MuiSvgIcon-fontSizeMedium css-i4bv87-MuiSvgIcon-root"
      focusable="false"
      aria-hidden="true"
      viewBox="0 0 24 24"
      data-testid="HubIcon"
    >
      <defs>
        <mask id="WithdrawMask">
          <circle
            r="50"
            cx="0"
            cy="0"
            fill="white"
          />
          <circle
            r="5"
            cx="19"
            cy="19"
            fill="black"
          />
        </mask>
      </defs>
      <path
        mask="url(#WithdrawMask)"
        d="M18 4H6C3.79 4 2 5.79 2 8v8c0 2.21 1.79 4 4 4h12c2.21 0 4-1.79 4-4V8c0-2.21-1.79-4-4-4zm-1.86 9.77c-.24.2-.57.28-.88.2L4.15 11.25C4.45 10.52 5.16 10 6 10h12c.67 0 1.26.34 1.63.84l-3.49 2.93zM6 6h12c1.1 0 2 .9 2 2v.55c-.59-.34-1.27-.55-2-.55H6c-.73 0-1.41.21-2 .55V8c0-1.1.9-2 2-2z"
      />
      <path
        style={{ transform: 'scale(0.5) translate(28px, 28px)' }}
        d="M12 8V4l8 8-8 8v-4H4V8z"
      />
    </svg>
  );
}
