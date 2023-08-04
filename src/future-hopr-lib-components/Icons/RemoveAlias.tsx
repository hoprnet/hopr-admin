export default function RemoveAlias() {
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
                    <circle r="50" cx="0" cy="0" fill="white"/>
                    <circle r="7.5" cx="17.5" cy="17.5" fill="black"/>
                </mask>
            </defs>
            <path mask="url(#AddAliasMask)" d="M22 3H2C.9 3 0 3.9 0 5v14c0 1.1.9 2 2 2h20c1.1 0 1.99-.9 1.99-2L24 5c0-1.1-.9-2-2-2zM8 6c1.66 0 3 1.34 3 3s-1.34 3-3 3-3-1.34-3-3 1.34-3 3-3zm6 12H2v-1c0-2 4-3.1 6-3.1s6 1.1 6 3.1v1zm3.85-4h1.64L21 16l-1.99 1.99c-1.31-.98-2.28-2.38-2.73-3.99-.18-.64-.28-1.31-.28-2s.1-1.36.28-2c.45-1.62 1.42-3.01 2.73-3.99L21 8l-1.51 2h-1.64c-.22.63-.35 1.3-.35 2s.13 1.37.35 2z"></path>
            {/* <path 
                style={{transform: 'scale(0.65) translate(15px, 15px)'}} 
                d="M16 9v10H8V9h8m-1.5-6h-5l-1 1H5v2h14V4h-3.5l-1-1zM18 7H6v12c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7z"
            /> */}
            <path 
                style={{transform: 'scale(0.73) translate(12px, 12px)'}} 
                d="M14.12 10.47 12 12.59l-2.13-2.12-1.41 1.41L10.59 14l-2.12 2.12 1.41 1.41L12 15.41l2.12 2.12 1.41-1.41L13.41 14l2.12-2.12zM15.5 4l-1-1h-5l-1 1H5v2h14V4zM6 19c0 1.1.9 2 2 2h8c1.1 0 2-.9 2-2V7H6v12zM8 9h8v10H8V9z"
            />
        </svg>
    )
}