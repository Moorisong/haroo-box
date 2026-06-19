import React from 'react';
import { SeatMode } from '../../hooks/useSeatRandom';

interface SeatSettingsModalProps {
    selectedSeat: { row: number, pair: number, seat: number } | null;
    mode: SeatMode;
    names: string[];
    fixedSeats: Map<string, number>;
    emptySeats: Set<string>;
    toggleEmptySeat: () => void;
    setFixedSeat: (studentIdx: number) => void;
    setSelectedSeat: (seat: { row: number, pair: number, seat: number } | null) => void;
}

const SeatSettingsModal: React.FC<SeatSettingsModalProps> = ({
    selectedSeat, mode, names, fixedSeats, emptySeats, toggleEmptySeat, setFixedSeat, setSelectedSeat
}) => {
    if (!selectedSeat) return null;

    const posKey = `${selectedSeat.row}-${selectedSeat.pair}-${selectedSeat.seat}`;
    const isCurrentlyEmpty = emptySeats.has(posKey);

    return (
        <div style={{
            position: 'fixed',
            top: 0, left: 0, right: 0, bottom: 0,
            background: 'rgba(0,0,0,0.5)',
            display: 'flex',
            alignItems: 'center',
            justifyContent: 'center',
            zIndex: 1000
        }}>
            <div style={{
                background: '#fff',
                padding: '2rem',
                borderRadius: '16px',
                textAlign: 'center',
                minWidth: '320px'
            }}>
                <h3 style={{ margin: '0 0 1rem 0' }}>
                    {selectedSeat.row + 1}줄 {selectedSeat.pair + 1}번째 {selectedSeat.seat === 0 ? '왼쪽' : '오른쪽'}
                </h3>
                <p style={{ color: '#666', fontSize: '0.9rem', margin: '0 0 1rem 0' }}>
                    이 자리에 앉힐 학생을 선택하거나 빈 자리로 설정하세요
                </p>

                <button
                    onClick={toggleEmptySeat}
                    style={{
                        display: 'block',
                        width: '220px',
                        margin: '0 auto 1rem auto',
                        padding: '0.8rem 1rem',
                        fontSize: '1rem',
                        fontWeight: '600',
                        background: isCurrentlyEmpty ? '#888' : '#f5f5f5',
                        color: isCurrentlyEmpty ? '#fff' : '#666',
                        border: isCurrentlyEmpty ? '2px solid #888' : '2px dashed #ccc',
                        borderRadius: '10px',
                        cursor: 'pointer',
                        transition: 'all 0.2s'
                    }}
                >
                    {isCurrentlyEmpty ? '🚫 빈 자리 해제' : '🚫 빈 자리로 설정'}
                </button>

                <div style={{ borderTop: '1px solid #eee', paddingTop: '1rem', marginBottom: '1rem' }}>
                    <p style={{ color: '#999', fontSize: '0.8rem', margin: '0 0 0.5rem 0' }}>또는 고정석 설정</p>
                </div>

                {mode === 'name' ? (
                    <select
                        id="fixedSeatInput"
                        defaultValue={fixedSeats.get(`${selectedSeat.row}-${selectedSeat.pair}-${selectedSeat.seat}`) || ''}
                        autoFocus
                        style={{
                            padding: '1rem',
                            fontSize: '1.1rem',
                            width: '220px',
                            textAlign: 'center',
                            border: '2px solid #E24A90',
                            borderRadius: '8px',
                            marginBottom: '1rem',
                            cursor: 'pointer'
                        }}
                    >
                        <option value="">-- 선택 --</option>
                        {names.map((name, idx) => (
                            <option key={idx} value={idx + 1}>{name}</option>
                        ))}
                    </select>
                ) : (
                    <input
                        type="number"
                        id="fixedSeatInput"
                        placeholder="번호"
                        defaultValue={fixedSeats.get(`${selectedSeat.row}-${selectedSeat.pair}-${selectedSeat.seat}`) || ''}
                        autoFocus
                        style={{
                            padding: '1rem',
                            fontSize: '1.5rem',
                            width: '120px',
                            textAlign: 'center',
                            border: '2px solid #4A90E2',
                            borderRadius: '8px',
                            marginBottom: '1rem'
                        }}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter') {
                                setFixedSeat(parseInt((e.target as HTMLInputElement).value) || 0);
                            }
                            if (e.key === 'Escape') {
                                setSelectedSeat(null);
                            }
                        }}
                    />
                )}
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'center' }}>
                    <button
                        onClick={() => setFixedSeat(0)}
                        style={{ padding: '0.6rem 1rem', background: '#fee', color: '#c00', border: '1px solid #fcc', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        해제
                    </button>
                    <button
                        onClick={() => setSelectedSeat(null)}
                        style={{ padding: '0.6rem 1rem', background: '#f0f0f0', color: '#555', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        취소
                    </button>
                    <button
                        onClick={() => {
                            const input = document.getElementById('fixedSeatInput') as HTMLInputElement | HTMLSelectElement;
                            const val = parseInt(input.value) || 0;
                            setFixedSeat(val);
                        }}
                        style={{ padding: '0.6rem 1.2rem', background: '#4A90E2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                    >
                        고정
                    </button>
                </div>
            </div>
        </div>
    );
};

export default SeatSettingsModal;
