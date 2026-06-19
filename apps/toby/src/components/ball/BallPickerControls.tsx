import React from 'react';

interface BallPickerControlsProps {
    gameMode: 1 | 2;
    handleModeChange: (mode: 1 | 2) => void;
    isPlaying: boolean;
    totalBalls: number;
    setTotalBalls: (val: number) => void;
    simulationSpeed: number;
    setSimulationSpeed: (val: number) => void;
    isPaused: boolean;
    setIsPaused: (val: boolean) => void;
    startSimulation: () => void;
}

const BallPickerControls: React.FC<BallPickerControlsProps> = ({
    gameMode, handleModeChange, isPlaying, totalBalls, setTotalBalls,
    simulationSpeed, setSimulationSpeed, isPaused, setIsPaused, startSimulation
}) => {
    return (
        <div style={{
            display: 'flex',
            justifyContent: 'center',
            alignItems: 'stretch',
            gap: '1rem',
            marginBottom: '1.5rem',
            padding: '1.2rem',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            border: '1px solid #e2e2ea',
            flexWrap: 'wrap'
        }}>
            <div style={{
                display: 'flex',
                gap: '0.4rem',
                background: '#f8f9fa',
                padding: '0.4rem',
                borderRadius: '16px',
                border: '1px solid #eee'
            }}>
                <button
                    onClick={() => handleModeChange(1)}
                    disabled={isPlaying}
                    style={{
                        background: gameMode === 1 ? '#ffffff' : 'transparent',
                        color: gameMode === 1 ? '#4A90E2' : '#889',
                        padding: '0 1.2rem',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: gameMode === 1 ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                        cursor: isPlaying ? 'not-allowed' : 'pointer',
                        opacity: isPlaying && gameMode !== 1 ? 0.5 : 1,
                        transition: 'all 0.2s ease',
                        minHeight: '44px'
                    }}
                >
                    고정 맵
                </button>
                <button
                    onClick={() => handleModeChange(2)}
                    disabled={isPlaying}
                    style={{
                        background: gameMode === 2 ? '#ffffff' : 'transparent',
                        color: gameMode === 2 ? '#E24A90' : '#889',
                        padding: '0 1.2rem',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: gameMode === 2 ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                        cursor: isPlaying ? 'not-allowed' : 'pointer',
                        opacity: isPlaying && gameMode !== 2 ? 0.5 : 1,
                        transition: 'all 0.2s ease',
                        minHeight: '44px'
                    }}
                >
                    랜덤 맵
                </button>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0 1.2rem',
                borderRadius: '16px',
                border: '1px solid #e2e2ea',
                background: '#fcfcfe'
            }}>
                <span style={{ color: '#445', fontWeight: '600', fontSize: '0.95rem' }}>공 개수</span>
                <input
                    type="number"
                    value={totalBalls}
                    onChange={(e) => setTotalBalls(parseInt(e.target.value) || 0)}
                    style={{
                        width: '70px',
                        padding: '0.4rem',
                        fontSize: '1rem',
                        fontWeight: '700',
                        textAlign: 'center',
                        background: 'transparent',
                        border: 'none',
                        color: '#334',
                        outline: 'none'
                    }}
                    min="1"
                    max="50"
                    disabled={isPlaying}
                />
                <span style={{ color: '#889', fontWeight: '500', fontSize: '0.95rem' }}>개</span>
            </div>

            <div style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.6rem',
                padding: '0 0.5rem',
                borderRadius: '16px',
                background: 'transparent',
            }}>
                <span style={{ color: '#445', fontWeight: '600', fontSize: '0.95rem', whiteSpace: 'nowrap' }}>⚡ 속도</span>
                <input
                    type="range"
                    min="0.5"
                    max="2"
                    step="0.25"
                    value={simulationSpeed}
                    onChange={(e) => setSimulationSpeed(parseFloat(e.target.value))}
                    className="speed-range"
                />
                <span style={{
                    color: '#4A90E2',
                    fontWeight: '700',
                    fontSize: '0.95rem',
                    minWidth: '45px',
                    textAlign: 'left'
                }}>
                    {simulationSpeed.toFixed(2)}x
                </span>
            </div>

            <button
                onClick={() => {
                    if (!isPlaying) {
                        startSimulation();
                    } else {
                        setIsPaused(!isPaused);
                    }
                }}
                style={{
                    background: !isPlaying
                        ? 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)'
                        : isPaused
                            ? 'linear-gradient(135deg, #FFB74D 0%, #F57C00 100%)'
                            : 'linear-gradient(135deg, #666 0%, #444 100%)',
                    border: 'none',
                    color: '#fff',
                    padding: '0 2.5rem',
                    fontSize: '1.1rem',
                    fontWeight: '800',
                    borderRadius: '16px',
                    boxShadow: '0 8px 20px rgba(0,0,0,0.15)',
                    cursor: 'pointer',
                    transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                    minHeight: '52px'
                }}
                onMouseEnter={(e) => {
                    e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                    e.currentTarget.style.boxShadow = '0 12px 25px rgba(0,0,0,0.2)';
                }}
                onMouseLeave={(e) => {
                    e.currentTarget.style.transform = 'translateY(0) scale(1)';
                    e.currentTarget.style.boxShadow = '0 8px 20px rgba(0,0,0,0.15)';
                }}
            >
                {!isPlaying ? '시작하기' : isPaused ? '다시 시작' : '일시정지'}
            </button>
        </div>
    );
};

export default BallPickerControls;
