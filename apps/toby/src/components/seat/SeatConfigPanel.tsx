import React from 'react';
import { SeatMode } from '../../hooks/useSeatRandom';

interface SeatConfigPanelProps {
    mode: SeatMode;
    handleModeChange: (mode: SeatMode) => void;
    pairsPerRowInput: string;
    handlePairsPerRowChange: (val: string) => void;
    handlePairsPerRowBlur: () => void;
    pairRowsInput: string;
    handlePairRowsChange: (val: string) => void;
    handlePairRowsBlur: () => void;
    totalStudentsInput: string;
    handleTotalStudentsChange: (val: string) => void;
    handleTotalStudentsBlur: () => void;
    namesLength: number;
    setShowNameInput: (show: boolean) => void;
}

const SeatConfigPanel: React.FC<SeatConfigPanelProps> = ({
    mode, handleModeChange,
    pairsPerRowInput, handlePairsPerRowChange, handlePairsPerRowBlur,
    pairRowsInput, handlePairRowsChange, handlePairRowsBlur,
    totalStudentsInput, handleTotalStudentsChange, handleTotalStudentsBlur,
    namesLength, setShowNameInput
}) => {
    return (
        <div className="seat-config-panel" style={{
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
            <div className="seat-config-item" style={{
                display: 'flex',
                gap: '0.4rem',
                background: '#f8f9fa',
                padding: '0.4rem',
                borderRadius: '16px',
                border: '1px solid #eee'
            }}>
                <button
                    onClick={() => handleModeChange('number')}
                    style={{
                        padding: '0 1.2rem',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        background: mode === 'number' ? '#ffffff' : 'transparent',
                        color: mode === 'number' ? '#4A90E2' : '#889',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: mode === 'number' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        minHeight: '44px'
                    }}
                >
                    번호
                </button>
                <button
                    onClick={() => handleModeChange('name')}
                    style={{
                        padding: '0 1.2rem',
                        fontSize: '0.9rem',
                        fontWeight: '700',
                        background: mode === 'name' ? '#ffffff' : 'transparent',
                        color: mode === 'name' ? '#E24A90' : '#889',
                        border: 'none',
                        borderRadius: '12px',
                        boxShadow: mode === 'name' ? '0 2px 8px rgba(0,0,0,0.08)' : 'none',
                        cursor: 'pointer',
                        transition: 'all 0.2s ease',
                        minHeight: '44px'
                    }}
                >
                    이름
                </button>
            </div>

            <div className="seat-config-item" style={{
                display: 'flex',
                alignItems: 'center',
                gap: '0.8rem',
                padding: '0 1.2rem',
                borderRadius: '16px',
                border: '1px solid #e2e2ea',
                background: '#fcfcfe'
            }}>
                <label style={{ color: '#445', fontWeight: '600', fontSize: '0.95rem' }}>배치</label>
                <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem' }}>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={pairsPerRowInput}
                        onChange={(e) => handlePairsPerRowChange(e.target.value.replace(/[^0-9]/g, ''))}
                        onBlur={handlePairsPerRowBlur}
                        style={{
                            padding: '0.4rem',
                            fontSize: '1rem',
                            width: '40px',
                            textAlign: 'center',
                            border: '1px solid #e2e2ea',
                            borderRadius: '10px',
                            fontWeight: '700',
                            color: '#334',
                            background: '#fff',
                            outline: 'none'
                        }}
                    />
                    <span style={{ color: '#aaa', fontWeight: '600', fontSize: '1rem' }}>×</span>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={pairRowsInput}
                        onChange={(e) => handlePairRowsChange(e.target.value.replace(/[^0-9]/g, ''))}
                        onBlur={handlePairRowsBlur}
                        style={{
                            padding: '0.4rem',
                            fontSize: '1rem',
                            width: '40px',
                            textAlign: 'center',
                            border: '1px solid #e2e2ea',
                            borderRadius: '10px',
                            fontWeight: '700',
                            color: '#334',
                            background: '#fff',
                            outline: 'none'
                        }}
                    />
                </div>
                <span style={{ color: '#889', fontSize: '0.85rem', fontWeight: '500' }}>(열×줄)</span>
            </div>

            {mode === 'number' && (
                <div className="seat-config-item" style={{
                    display: 'flex',
                    alignItems: 'center',
                    gap: '0.8rem',
                    padding: '0 1.2rem',
                    borderRadius: '16px',
                    border: '1px solid #e2e2ea',
                    background: '#fcfcfe'
                }}>
                    <label style={{ color: '#445', fontWeight: '600', fontSize: '0.95rem' }}>학생 수</label>
                    <input
                        type="text"
                        inputMode="numeric"
                        value={totalStudentsInput}
                        onChange={(e) => handleTotalStudentsChange(e.target.value.replace(/[^0-9]/g, ''))}
                        onBlur={handleTotalStudentsBlur}
                        style={{
                            padding: '0.4rem',
                            fontSize: '1rem',
                            width: '55px',
                            textAlign: 'center',
                            border: '1px solid #e2e2ea',
                            borderRadius: '10px',
                            fontWeight: '700',
                            color: '#334',
                            background: '#fff',
                            outline: 'none'
                        }}
                    />
                </div>
            )}

            {mode === 'name' && (
                <div className="seat-config-item" style={{ display: 'flex' }}>
                    <button
                        onClick={() => setShowNameInput(true)}
                        className={namesLength === 0 ? 'btn-name-nudge' : ''}
                        style={{
                            padding: '0 1.2rem',
                            fontSize: '0.95rem',
                            fontWeight: '700',
                            background: '#ffffff',
                            color: '#E24A90',
                            border: '1px solid #E24A90',
                            borderRadius: '16px',
                            cursor: 'pointer',
                            transition: 'all 0.2s ease',
                            minHeight: '44px'
                        }}
                        onMouseEnter={(e) => {
                            e.currentTarget.style.background = '#fff0f6';
                        }}
                        onMouseLeave={(e) => {
                            e.currentTarget.style.background = '#ffffff';
                        }}
                    >
                        📝 이름 ({namesLength}명)
                    </button>
                </div>
            )}
        </div>
    );
};

export default SeatConfigPanel;
