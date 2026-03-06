import type React from "react"

export const LoadSpinner = () => (
    <div style={loaderStyle}>
        <div className='spinner'></div>
        <style>{`
            .spinner {
                border: 4px solid #f3f3f3;
                border-top: 4px solid #3498db;
                border-radius: 50%;
                width: 30px;
                height: 30px;
                animation: spin 1s linear infinite;
            }
            @keyframes spin {
                0% { transform: rotate(0deg); }
                100% {transform: rotate(360deg); }
            }
        `}</style>
    </div>
)

const loaderStyle: React.CSSProperties = {
    position: 'fixed',
    top: '20px',
    right: '20px',
    zIndex: 1000,
}