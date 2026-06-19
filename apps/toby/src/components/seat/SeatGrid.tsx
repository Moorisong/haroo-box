import React, { forwardRef } from 'react';
import { SeatData, SeatMode } from '../../hooks/useSeatRandom';

interface SeatGridProps {
    seats: (SeatData | null)[][];
    mode: SeatMode;
    pairRows: number;
    pairsPerRow: number;
}

const SeatGrid = forwardRef<HTMLDivElement, SeatGridProps>(({ seats, mode, pairRows, pairsPerRow }, ref) => {
    return (
        <div
            ref={ref}
            style={{
                display: 'inline-block',
                margin: '0 auto',
                textAlign: 'left',
                padding: '2rem 1.5rem',
                background: '#fafafa',
                borderRadius: '16px',
                border: '1px solid #eee',
                flexShrink: 0
            }}
        >
            <div style={{
                background: '#2d5a27',
                color: '#fff',
                padding: '0.8rem 3rem',
                borderRadius: '8px',
                textAlign: 'center',
                marginBottom: '1.5rem',
                fontSize: '1.1rem',
                fontWeight: '500'
            }}>
                📖 칠판
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.8rem' }}>
                {seats.length > 0 ? (
                    seats.map((row, rowIdx) => (
                        <div key={rowIdx} style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                            {Array.from({ length: Math.ceil(row.length / 2) }).map((_, pairIdx) => {
                                const left = row[pairIdx * 2];
                                const right = row[pairIdx * 2 + 1];
                                return (
                                    <div key={pairIdx} style={{
                                        display: 'flex',
                                        gap: '2px',
                                        background: '#e8e8e8',
                                        padding: '3px',
                                        borderRadius: '10px'
                                    }}>
                                        <div style={{
                                            minWidth: mode === 'name' ? '65px' : '50px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: left?.display === '🚫'
                                                ? 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 5px, #e0e0e0 5px, #e0e0e0 10px)'
                                                : left ? '#fff' : '#f0f0f0',
                                            border: left?.display === '🚫' ? '2px solid #aaa' : '1px solid #ddd',
                                            borderRadius: '8px 2px 2px 8px',
                                            fontSize: left?.display === '🚫' ? '1.2rem' : mode === 'name' ? '0.85rem' : '1.2rem',
                                            fontWeight: '600',
                                            color: left?.display === '🚫' ? '#999' : left ? '#333' : '#ccc',
                                            padding: '0 0.3rem',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {left?.display || ''}
                                        </div>
                                        <div style={{
                                            minWidth: mode === 'name' ? '65px' : '50px',
                                            height: '50px',
                                            display: 'flex',
                                            alignItems: 'center',
                                            justifyContent: 'center',
                                            background: right?.display === '🚫'
                                                ? 'repeating-linear-gradient(45deg, #f0f0f0, #f0f0f0 5px, #e0e0e0 5px, #e0e0e0 10px)'
                                                : right ? '#fff' : '#f0f0f0',
                                            border: right?.display === '🚫' ? '2px solid #aaa' : '1px solid #ddd',
                                            borderRadius: '2px 8px 8px 2px',
                                            fontSize: right?.display === '🚫' ? '1.2rem' : mode === 'name' ? '0.85rem' : '1.2rem',
                                            fontWeight: '600',
                                            color: right?.display === '🚫' ? '#999' : right ? '#333' : '#ccc',
                                            padding: '0 0.3rem',
                                            whiteSpace: 'nowrap',
                                            overflow: 'hidden',
                                            textOverflow: 'ellipsis'
                                        }}>
                                            {right?.display || ''}
                                        </div>
                                    </div>
                                );
                            })}
                        </div>
                    ))
                ) : (
                    Array.from({ length: pairRows }).map((_, rowIdx) => (
                        <div key={rowIdx} style={{ display: 'flex', justifyContent: 'center', gap: '1.5rem' }}>
                            {Array.from({ length: pairsPerRow || 3 }).map((_, pairIdx) => (
                                <div key={pairIdx} style={{
                                    display: 'flex',
                                    gap: '2px',
                                    background: '#e8e8e8',
                                    padding: '3px',
                                    borderRadius: '10px'
                                }}>
                                    <div style={{
                                        minWidth: '50px',
                                        height: '50px',
                                        background: '#f5f5f5',
                                        borderRadius: '8px 2px 2px 8px',
                                        border: '1px dashed #ddd'
                                    }} />
                                    <div style={{
                                        minWidth: '50px',
                                        height: '50px',
                                        background: '#f5f5f5',
                                        borderRadius: '2px 8px 8px 2px',
                                        border: '1px dashed #ddd'
                                    }} />
                                </div>
                            ))}
                        </div>
                    ))
                )}
            </div>
        </div>
    );
});

SeatGrid.displayName = 'SeatGrid';

export default SeatGrid;
