import React from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import MyorokBanner from '../components/MyorokBanner';
import KakaoAdfit, { ADFIT_UNITS, ADFIT_SIZES } from '../components/KakaoAdFit';
import { useSeatSettings } from '../hooks/useSeatSettings';
import SeatSettingsGrid from '../components/seat/SeatSettingsGrid';
import SeatSettingsModal from '../components/seat/SeatSettingsModal';

const SeatSettings: React.FC = () => {
    const {
        pairRows, pairRowsInput, pairsPerRowInput, pairsPerRow,
        totalStudentsInput, studentCount, mode, names,
        fixedSeats, emptySeats, selectedSeat,
        handleModeChange, handleSeatClick, setFixedSeat, toggleEmptySeat,
        clearAllFixed, clearAllEmpty, getDisplayText, setSelectedSeat
    } = useSeatSettings();

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff' }}>
            <Header />
            <div className="container" style={{ maxWidth: '900px', paddingTop: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '1.5rem' }}>
                    <h1 style={{ fontSize: '2rem', color: '#333', margin: 0, fontWeight: '600' }}>
                        설정 페이지(빈 자리, 고정석)
                    </h1>
                    <p style={{ color: '#888', marginTop: '0.3rem', fontSize: '0.9rem' }}>
                        아래 좌석을 직접 클릭하여 설정하세요 (브라우저 탭을 닫으면 초기화)
                    </p>
                </div>

                <div style={{
                    display: 'flex',
                    justifyContent: 'center',
                    gap: '1rem',
                    marginBottom: '1.5rem',
                    flexWrap: 'wrap',
                    padding: '1rem 1.5rem',
                    background: 'rgba(0,0,0,0.02)',
                    borderRadius: '12px',
                    border: '1px solid rgba(0,0,0,0.06)'
                }}>
                    <div style={{ display: 'flex', gap: '0.3rem' }}>
                        <button
                            onClick={() => handleModeChange('number')}
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                background: mode === 'number' ? '#4A90E2' : '#f0f0f0',
                                color: mode === 'number' ? '#fff' : '#666',
                                border: mode === 'number' ? 'none' : '1px solid #ddd',
                                borderRadius: '8px 0 0 8px',
                                cursor: 'pointer'
                            }}
                        >
                            번호
                        </button>
                        <button
                            onClick={() => handleModeChange('name')}
                            style={{
                                padding: '0.5rem 1rem',
                                fontSize: '0.9rem',
                                fontWeight: '600',
                                background: mode === 'name' ? '#E24A90' : '#f0f0f0',
                                color: mode === 'name' ? '#fff' : '#666',
                                border: mode === 'name' ? 'none' : '1px solid #ddd',
                                borderRadius: '0 8px 8px 0',
                                cursor: 'pointer'
                            }}
                        >
                            이름
                        </button>
                    </div>

                    <div style={{ display: 'flex', alignItems: 'center', gap: '0.4rem', background: '#f5f5f5', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #eee', opacity: 0.5 }}>
                        <label style={{ color: '#555', fontWeight: '500', fontSize: '0.9rem' }}>배치</label>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={pairsPerRowInput}
                            readOnly
                            style={{ padding: '0.4rem', fontSize: '1rem', width: '38px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '6px', background: '#eee', cursor: 'not-allowed' }}
                        />
                        <span style={{ color: '#bbb', fontWeight: '500', fontSize: '1rem' }}>×</span>
                        <input
                            type="text"
                            inputMode="numeric"
                            value={pairRowsInput}
                            readOnly
                            style={{ padding: '0.4rem', fontSize: '1rem', width: '38px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '6px', background: '#eee', cursor: 'not-allowed' }}
                        />
                        <span style={{ color: '#bbb', fontSize: '0.75rem' }}>(열×줄)</span>
                    </div>

                    {mode === 'number' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f5f5f5', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #eee', opacity: 0.5 }}>
                            <label style={{ color: '#555', fontWeight: '500', fontSize: '0.9rem' }}>학생 수</label>
                            <input
                                type="text"
                                inputMode="numeric"
                                value={totalStudentsInput}
                                readOnly
                                style={{ padding: '0.4rem', fontSize: '1rem', width: '60px', textAlign: 'center', border: '1px solid #ddd', borderRadius: '6px', background: '#eee', cursor: 'not-allowed' }}
                            />
                        </div>
                    )}

                    {mode === 'name' && (
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.5rem', background: '#f5f5f5', padding: '0.5rem 1rem', borderRadius: '8px', border: '1px solid #eee', opacity: 0.5 }}>
                            <span style={{ fontSize: '0.9rem', fontWeight: '500', color: '#999' }}>
                                📝 이름 ({names.length}명)
                            </span>
                        </div>
                    )}
                </div>

                <div style={{
                    marginBottom: '1rem',
                    padding: '1rem',
                    background: '#f0f7ff',
                    borderRadius: '10px',
                    border: '1px solid #cce0ff',
                    display: 'flex',
                    flexDirection: 'column',
                    gap: '0.5rem'
                }}>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: '#0066cc' }}>
                            📌 고정석: {fixedSeats.size}개
                        </span>
                        {fixedSeats.size > 0 && (
                            <button
                                onClick={clearAllFixed}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.85rem',
                                    background: '#fff',
                                    color: '#d00',
                                    border: '1px solid #fcc',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                전체 해제
                            </button>
                        )}
                    </div>
                    <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                        <span style={{ fontWeight: '600', color: '#888' }}>
                            🚫 빈 자리: {emptySeats.size}개
                        </span>
                        {emptySeats.size > 0 && (
                            <button
                                onClick={clearAllEmpty}
                                style={{
                                    padding: '0.4rem 0.8rem',
                                    fontSize: '0.85rem',
                                    background: '#fff',
                                    color: '#d00',
                                    border: '1px solid #fcc',
                                    borderRadius: '6px',
                                    cursor: 'pointer'
                                }}
                            >
                                전체 해제
                            </button>
                        )}
                    </div>
                </div>

                <div style={{ textAlign: 'center', marginBottom: '1rem', color: '#666', fontSize: '0.9rem' }}>
                    👆 좌석 클릭 → 고정석 또는 빈 자리 설정
                </div>

                <SeatSettingsModal
                    selectedSeat={selectedSeat}
                    mode={mode}
                    names={names}
                    fixedSeats={fixedSeats}
                    emptySeats={emptySeats}
                    toggleEmptySeat={toggleEmptySeat}
                    setFixedSeat={setFixedSeat}
                    setSelectedSeat={setSelectedSeat}
                />

                <SeatSettingsGrid
                    pairRows={pairRows}
                    pairsPerRow={pairsPerRow}
                    mode={mode}
                    studentCount={studentCount}
                    fixedSeats={fixedSeats}
                    emptySeats={emptySeats}
                    handleSeatClick={handleSeatClick}
                    getDisplayText={getDisplayText}
                />

                <div style={{ marginTop: '2rem', textAlign: 'center' }}>
                    <Link
                        to="/seat"
                        style={{
                            display: 'inline-block',
                            padding: '0.8rem 2rem',
                            background: '#4A90E2',
                            color: '#fff',
                            textDecoration: 'none',
                            borderRadius: '10px',
                            fontWeight: '600',
                            fontSize: '1.1rem'
                        }}
                    >
                        저장 및 돌아가기
                    </Link>
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#999', fontSize: '0.85rem' }}>
                    ⚠️ 브라우저 탭을 닫으면 보든 설정 값이 초기화됩니다
                </div>

                <div style={{ marginTop: '3.5rem', marginBottom: '1.5rem', display: 'flex', justifyContent: 'center' }}>
                    <div style={{ width: '100%', maxWidth: '800px', display: 'flex', flexDirection: 'column', gap: '1.5rem', padding: '0 1rem' }}>
                        <KakaoAdfit
                            unit={ADFIT_UNITS.MAIN_BANNER}
                            width="100%"
                            height={ADFIT_SIZES.BANNER_320x100.height}
                        />
                        <div style={{ width: '100%', margin: '0' }}>
                            <MyorokBanner />
                        </div>
                    </div>
                </div>
            </div>

            <div style={{
                marginTop: '1rem',
                paddingBottom: 'calc(2rem + env(safe-area-inset-bottom))',
                color: '#aaa',
                fontSize: '0.85rem',
                textAlign: 'center'
            }}>
                Made with ❤️ for teachers
            </div>
        </div>
    );
};

export default SeatSettings;
