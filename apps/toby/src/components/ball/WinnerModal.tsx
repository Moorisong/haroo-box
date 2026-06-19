import React from 'react';

interface WinnerModalProps {
    winner: number | null;
    setWinner: (val: number | null) => void;
}

const WinnerModal: React.FC<WinnerModalProps> = ({ winner, setWinner }) => {
    if (winner === null) return null;

    return (
        <div style={{
            position: 'absolute',
            top: 0,
            left: 0,
            right: 0,
            bottom: 0,
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            background: 'rgba(0, 0, 0, 0.85)',
            backdropFilter: 'blur(5px)'
        }}>
            <div style={{
                background: '#1a1a2e',
                border: '2px solid #444',
                padding: '2.5rem 4rem',
                borderRadius: '24px',
                boxShadow: '0 8px 32px rgba(0,0,0,0.4)',
                textAlign: 'center',
                animation: 'popIn 0.3s ease'
            }}>
                <div style={{
                    fontSize: '1.2rem',
                    color: '#FFFF00',
                    textShadow: '0 0 15px #FFFF00',
                    marginBottom: '0.5rem',
                    letterSpacing: '3px'
                }}>
                    🏆 WINNER 🏆
                </div>
                <div style={{
                    fontSize: '7rem',
                    fontWeight: 'bold',
                    color: '#ffffff',
                    lineHeight: 1
                }}>
                    {winner}
                </div>
                <button
                    onClick={() => setWinner(null)}
                    style={{
                        marginTop: '1.5rem',
                        background: '#444',
                        border: '2px solid #666',
                        color: '#fff',
                        padding: '0.6rem 2rem',
                        fontSize: '1rem',
                        borderRadius: '8px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    확인
                </button>
            </div>
            <style>{`
                @keyframes popIn {
                    0% { transform: scale(0.8); opacity: 0; }
                    100% { transform: scale(1); opacity: 1; }
                }
            `}</style>
        </div>
    );
};

export default WinnerModal;
