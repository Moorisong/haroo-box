import React from 'react';
import { SeatMode } from '../../hooks/useSeatRandom';

interface SeatSettingsGridProps {
    pairRows: number;
    pairsPerRow: number;
    mode: SeatMode;
    studentCount: number;
    fixedSeats: Map<string, number>;
    emptySeats: Set<string>;
    handleSeatClick: (row: number, pair: number, seat: number) => void;
    getDisplayText: (idx: number) => string;
}

const SeatSettingsGrid: React.FC<SeatSettingsGridProps> = ({
    pairRows, pairsPerRow, mode, studentCount, fixedSeats, emptySeats, handleSeatClick, getDisplayText
}) => {
    return (
        <div className="seat-grid-scroll">
            <div style={{ display: 'flex', justifyContent: 'center' }}>
                <div style={{
                    display: 'inline-block',
                    padding: '1.5rem',
                    background: '#fafafa',
                    borderRadius: '16px',
                    border: '1px solid #eee'
                }}>
                    <div style={{
                        background: '#2d5a27',
                        color: '#fff',
                        padding: '0.6rem 2rem',
                        borderRadius: '8px',
                        textAlign: 'center',
                        marginBottom: '1rem',
                        fontSize: '0.95rem'
                    }}>
                        📖 칠판
                    </div>

                    <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                        {Array.from({ length: pairRows }).map((_, rowIdx) => (
                            <div key={rowIdx} style={{ display: 'flex', justifyContent: 'center', gap: '1.2rem' }}>
                                {Array.from({ length: pairsPerRow }).map((_, pairIdx) => {
                                    const leftSeatNum = rowIdx * pairsPerRow * 2 + pairIdx * 2 + 1;
                                    const rightSeatNum = leftSeatNum + 1;
                                    const leftKey = `${rowIdx}-${pairIdx}-0`;
                                    const rightKey = `${rowIdx}-${pairIdx}-1`;
                                    const leftFixed = fixedSeats.get(leftKey);
                                    const rightFixed = fixedSeats.get(rightKey);
                                    const leftEmpty = emptySeats.has(leftKey);
                                    const rightEmpty = emptySeats.has(rightKey);
                                    const leftValid = leftSeatNum <= studentCount;
                                    const rightValid = rightSeatNum <= studentCount;

                                    return (
                                        <div key={pairIdx} style={{
                                            display: 'flex',
                                            gap: '2px',
                                            background: '#e0e0e0',
                                            padding: '3px',
                                            borderRadius: '10px'
                                        }}>
                                            <div
                                                onClick={() => handleSeatClick(rowIdx, pairIdx, 0)}
                                                style={{
                                                    minWidth: mode === 'name' ? '60px' : '48px',
                                                    height: '48px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: leftEmpty
                                                        ? 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 5px, #e0e0e0 5px, #e0e0e0 10px)'
                                                        : leftFixed ? '#e8f4ff' : (leftValid ? '#fff' : '#f5f5f5'),
                                                    border: leftEmpty ? '2px solid #aaa' : leftFixed ? '2px solid #4A90E2' : '1px solid #ddd',
                                                    borderRadius: '8px 2px 2px 8px',
                                                    fontSize: leftEmpty ? '1.2rem' : mode === 'name' ? '0.75rem' : (leftFixed ? '1rem' : '0.75rem'),
                                                    fontWeight: leftFixed ? '600' : '400',
                                                    color: leftEmpty ? '#999' : leftFixed ? '#0066cc' : (leftValid ? '#999' : '#ccc'),
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    padding: '0 0.2rem',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {leftEmpty ? '🚫' : leftFixed ? getDisplayText(leftFixed) : ''}
                                            </div>
                                            <div
                                                onClick={() => handleSeatClick(rowIdx, pairIdx, 1)}
                                                style={{
                                                    minWidth: mode === 'name' ? '60px' : '48px',
                                                    height: '48px',
                                                    display: 'flex',
                                                    alignItems: 'center',
                                                    justifyContent: 'center',
                                                    background: rightEmpty
                                                        ? 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 5px, #e0e0e0 5px, #e0e0e0 10px)'
                                                        : rightFixed ? '#e8f4ff' : (rightValid ? '#fff' : '#f5f5f5'),
                                                    border: rightEmpty ? '2px solid #aaa' : rightFixed ? '2px solid #4A90E2' : '1px solid #ddd',
                                                    borderRadius: '2px 8px 8px 2px',
                                                    fontSize: rightEmpty ? '1.2rem' : mode === 'name' ? '0.75rem' : (rightFixed ? '1rem' : '0.75rem'),
                                                    fontWeight: rightFixed ? '600' : '400',
                                                    color: rightEmpty ? '#999' : rightFixed ? '#0066cc' : (rightValid ? '#999' : '#ccc'),
                                                    cursor: 'pointer',
                                                    transition: 'all 0.2s',
                                                    padding: '0 0.2rem',
                                                    whiteSpace: 'nowrap',
                                                    overflow: 'hidden',
                                                    textOverflow: 'ellipsis'
                                                }}
                                            >
                                                {rightEmpty ? '🚫' : rightFixed ? getDisplayText(rightFixed) : ''}
                                            </div>
                                        </div>
                                    );
                                })}
                            </div>
                        ))}
                    </div>
                </div>
            </div>
        </div>
    );
};

export default SeatSettingsGrid;
