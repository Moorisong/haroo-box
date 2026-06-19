import React, { useRef, useEffect, useCallback } from 'react';
import { Link } from 'react-router-dom';
import Header from '../components/Header';
import MyorokBanner from '../components/MyorokBanner';
import KakaoAdfit, { ADFIT_UNITS, ADFIT_SIZES } from '../components/KakaoAdFit';
import { toPng } from 'html-to-image';
import { APP_TITLES } from '../constants/app';
import { useSeatRandom } from '../hooks/useSeatRandom';
import SeatConfigPanel from '../components/seat/SeatConfigPanel';
import NameInputModal from '../components/seat/NameInputModal';
import SeatGrid from '../components/seat/SeatGrid';

const SeatRandom: React.FC = () => {
    const {
        pairRows, pairRowsInput, pairsPerRowDirect, pairsPerRowInput, mode, totalStudentsInput,
        names, nameInput, showNameInput, seats, showShuffleHint,
        handlePairRowsChange, handlePairRowsBlur, handlePairsPerRowChange, handlePairsPerRowBlur,
        handleTotalStudentsChange, handleTotalStudentsBlur, handleModeChange,
        setNameInput, setShowNameInput, handleNameInputSave, shuffleSeats, setShowShuffleHint,
        parseNames
    } = useSeatRandom();

    const gridRef = useRef<HTMLDivElement>(null);
    const scrollContainerRef = useRef<HTMLDivElement>(null);

    const centerScroll = useCallback(() => {
        if (scrollContainerRef.current) {
            const container = scrollContainerRef.current;
            const scrollWidth = container.scrollWidth;
            const clientWidth = container.clientWidth;
            if (scrollWidth > clientWidth) {
                container.scrollLeft = (scrollWidth - clientWidth) / 2;
            }
        }
    }, []);

    useEffect(() => {
        if (seats.length > 0) {
            centerScroll();
            const timer1 = setTimeout(centerScroll, 100);
            const timer2 = setTimeout(centerScroll, 500);
            return () => {
                clearTimeout(timer1);
                clearTimeout(timer2);
            };
        }
    }, [seats, centerScroll]);

    useEffect(() => {
        window.addEventListener('resize', centerScroll);
        return () => window.removeEventListener('resize', centerScroll);
    }, [centerScroll]);

    const handleExport = async () => {
        if (!gridRef.current) return;

        try {
            const dataUrl = await toPng(gridRef.current, {
                backgroundColor: '#ffffff',
                pixelRatio: 2
            });

            const link = document.createElement('a');
            link.download = `짝꿍배치_${new Date().toLocaleDateString()}.png`;
            link.href = dataUrl;
            link.click();
        } catch (e) {
            console.error(e);
            alert('이미지 저장 중 오류가 발생했습니다.');
        }
    };

    return (
        <div style={{ minHeight: '100vh', background: '#ffffff' }}>
            <Header />
            <div className="container" style={{ maxWidth: '1000px', paddingTop: '1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '2.5rem' }}>
                    <h1 style={{
                        fontSize: '2.5rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0,
                        letterSpacing: '-0.02em'
                    }}>
                        {APP_TITLES.SEAT}
                    </h1>
                    <p style={{ color: '#667', marginTop: '0.6rem', fontSize: '1rem', fontWeight: '500' }}>
                        학생들의 자리를 랜덤으로 배치합니다
                    </p>
                </div>

                <SeatConfigPanel
                    mode={mode}
                    handleModeChange={handleModeChange}
                    pairsPerRowInput={pairsPerRowInput}
                    handlePairsPerRowChange={handlePairsPerRowChange}
                    handlePairsPerRowBlur={handlePairsPerRowBlur}
                    pairRowsInput={pairRowsInput}
                    handlePairRowsChange={handlePairRowsChange}
                    handlePairRowsBlur={handlePairRowsBlur}
                    totalStudentsInput={totalStudentsInput}
                    handleTotalStudentsChange={handleTotalStudentsChange}
                    handleTotalStudentsBlur={handleTotalStudentsBlur}
                    namesLength={names.length}
                    setShowNameInput={setShowNameInput}
                />

                {showNameInput && (
                    <NameInputModal
                        nameInput={nameInput}
                        setNameInput={setNameInput}
                        parseNames={parseNames}
                        handleNameInputSave={handleNameInputSave}
                        setShowNameInput={setShowNameInput}
                    />
                )}

                <div style={{ display: 'flex', justifyContent: 'center', gap: '1rem', marginBottom: '1.5rem', flexWrap: 'wrap' }}>
                    <button
                        onClick={() => { shuffleSeats(); setShowShuffleHint(false); }}
                        disabled={mode === 'name' && names.length === 0}
                        className={showShuffleHint ? 'btn-pulse-hint' : ''}
                        style={{
                            background: (mode === 'name' && names.length === 0)
                                ? '#e0e0e0'
                                : 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                            border: 'none',
                            color: '#fff',
                            padding: '0 2.5rem',
                            fontSize: '1.1rem',
                            fontWeight: '800',
                            borderRadius: '16px',
                            boxShadow: (mode === 'name' && names.length === 0) ? 'none' : '0 8px 20px rgba(74,144,226,0.3)',
                            cursor: (mode === 'name' && names.length === 0) ? 'not-allowed' : 'pointer',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            minHeight: '52px'
                        }}
                        onMouseEnter={(e) => {
                            if (!(mode === 'name' && names.length === 0)) {
                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 12px 25px rgba(74,144,226,0.4)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!(mode === 'name' && names.length === 0)) {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(74,144,226,0.3)';
                            }
                        }}
                    >
                        짝궁 섞기
                    </button>
                    {seats.length > 0 && (
                        <button
                            onClick={handleExport}
                            style={{
                                background: 'linear-gradient(135deg, #50C878 0%, #3DA65E 100%)',
                                border: 'none',
                                color: '#fff',
                                padding: '0 2rem',
                                fontSize: '1rem',
                                fontWeight: '800',
                                borderRadius: '16px',
                                boxShadow: '0 8px 20px rgba(80,200,120,0.2)',
                                cursor: 'pointer',
                                transition: 'all 0.3s ease',
                                minHeight: '52px'
                            }}
                            onMouseEnter={(e) => {
                                e.currentTarget.style.transform = 'translateY(-2px)';
                                e.currentTarget.style.boxShadow = '0 12px 25px rgba(80,200,120,0.3)';
                            }}
                            onMouseLeave={(e) => {
                                e.currentTarget.style.transform = 'translateY(0)';
                                e.currentTarget.style.boxShadow = '0 8px 20px rgba(80,200,120,0.2)';
                            }}
                        >
                            이미지로 저장
                        </button>
                    )}
                </div>

                <div
                    className="seat-grid-scroll"
                    ref={scrollContainerRef}
                    style={{
                        display: 'flex',
                        justifyContent: 'flex-start',
                        padding: '0 1rem 1rem 1rem',
                        overflowX: 'auto',
                        width: '100%',
                        boxSizing: 'border-box'
                    }}
                >
                    <SeatGrid
                        ref={gridRef}
                        seats={seats}
                        mode={mode}
                        pairRows={pairRows}
                        pairsPerRow={pairsPerRowDirect}
                    />
                </div>

                <div style={{ marginTop: '1.5rem', textAlign: 'center', color: '#bbb', fontSize: '0.8rem' }}>
                    <Link to="/seat/settings" style={{ color: '#aaa', textDecoration: 'none' }}>Setting</Link>
                </div>

                <div style={{ marginTop: '3rem', marginBottom: '3rem', display: 'flex', justifyContent: 'center' }}>
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

            <style>{`
                @media (max-width: 600px) {
                    .seat-config-panel {
                        padding: 1.2rem 1rem !important;
                        gap: 1rem !important;
                        flex-direction: column !important;
                        align-items: center !important;
                        border-radius: 20px !important;
                        margin: 0 auto 1.5rem auto !important;
                        width: calc(100% - 2rem) !important;
                        box-sizing: border-box !important;
                    }
                    .seat-config-item {
                        width: 100% !important;
                        display: flex !important;
                        justify-content: center !important;
                        align-items: center !important;
                        min-height: 48px !important;
                        box-sizing: border-box !important;
                    }
                    .seat-config-item > button, 
                    .seat-config-item > div {
                        width: 100% !important;
                        max-width: 330px !important;
                        display: flex !important;
                        justify-content: center !important;
                        align-items: center !important;
                        white-space: nowrap !important;
                    }
                    .seat-config-item label,
                    .seat-config-item span {
                        white-space: nowrap !important;
                        flex-shrink: 0 !important;
                    }
                    .seat-config-item > div {
                        gap: 0.6rem !important;
                        padding: 0 1rem !important;
                    }
                    .btn-name-nudge::after {
                        width: 90% !important;
                        left: 50% !important;
                        transform: translateX(-50%) !important;
                        white-space: normal !important;
                        text-align: center !important;
                    }
                }
            `}</style>
        </div>
    );
};

export default SeatRandom;
