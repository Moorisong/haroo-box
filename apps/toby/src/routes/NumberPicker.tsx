import React from 'react';
import Header from '../components/Header';
import MyorokBanner from '../components/MyorokBanner';
import KakaoAdfit, { ADFIT_UNITS, ADFIT_SIZES } from '../components/KakaoAdFit';
import { APP_TITLES } from '../constants/app';
import { useNumberPicker } from '../hooks/useNumberPicker';
import NumberPickerConfig from '../components/number/NumberPickerConfig';
import NumberPickerResults from '../components/number/NumberPickerResults';

const NumberPicker: React.FC = () => {
    const {
        totalStudents, setTotalStudents,
        pickCount, setPickCount,
        excludeInput, setExcludeInput,
        results, isAnimating, animationDoneCount,
        handleStart, handleAnimationComplete
    } = useNumberPicker();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #f8faff 0%, #f0f4f8 100%)',
            fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif"
        }}>
            <Header />
            <div className="container" style={{ maxWidth: '900px', padding: '2rem 1.5rem' }}>
                <div style={{ textAlign: 'center', marginBottom: '3rem' }}>
                    <h1 style={{
                        fontSize: '2.2rem',
                        fontWeight: '800',
                        background: 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                        WebkitBackgroundClip: 'text',
                        WebkitTextFillColor: 'transparent',
                        margin: 0,
                        letterSpacing: '-0.02em'
                    }}>
                        {APP_TITLES.NUMBER}
                    </h1>
                    <p style={{ color: '#667', marginTop: '0.6rem', fontSize: '1rem', fontWeight: '500' }}>
                        정정당당! 랜덤으로 번호를 추첨합니다
                    </p>
                </div>

                <NumberPickerConfig
                    totalStudents={totalStudents}
                    setTotalStudents={setTotalStudents}
                    pickCount={pickCount}
                    setPickCount={setPickCount}
                    excludeInput={excludeInput}
                    setExcludeInput={setExcludeInput}
                    isAnimating={isAnimating}
                />

                <NumberPickerResults
                    results={results}
                    isAnimating={isAnimating}
                    handleAnimationComplete={handleAnimationComplete}
                />

                <div style={{ textAlign: 'center' }}>
                    <button
                        onClick={handleStart}
                        disabled={isAnimating}
                        style={{
                            fontSize: '1.15rem',
                            padding: '1rem 4rem',
                            background: isAnimating
                                ? '#e0e0e0'
                                : 'linear-gradient(135deg, #4A90E2 0%, #357ABD 100%)',
                            color: '#fff',
                            border: 'none',
                            borderRadius: '16px',
                            cursor: isAnimating ? 'not-allowed' : 'pointer',
                            fontWeight: '700',
                            transition: 'all 0.3s cubic-bezier(0.175, 0.885, 0.32, 1.275)',
                            boxShadow: isAnimating ? 'none' : '0 8px 25px rgba(74,144,226,0.25)',
                            transform: isAnimating ? 'scale(0.98)' : 'scale(1)'
                        }}
                        onMouseEnter={(e) => {
                            if (!isAnimating) {
                                e.currentTarget.style.transform = 'translateY(-2px) scale(1.02)';
                                e.currentTarget.style.boxShadow = '0 12px 30px rgba(74,144,226,0.35)';
                            }
                        }}
                        onMouseLeave={(e) => {
                            if (!isAnimating) {
                                e.currentTarget.style.transform = 'translateY(0) scale(1)';
                                e.currentTarget.style.boxShadow = '0 8px 25px rgba(74,144,226,0.25)';
                            }
                        }}
                    >
                        {isAnimating ? (
                            <div style={{ display: 'flex', alignItems: 'center', gap: '8px' }}>
                                <span className="spinner">⏳</span> 추첨 중...
                            </div>
                        ) : '추첨 시작하기'}
                    </button>
                </div>

                <div style={{
                    marginTop: '2.5rem',
                    textAlign: 'center',
                    color: '#99a',
                    fontSize: '0.9rem',
                    fontWeight: '500'
                }}>
                    <span style={{ color: '#4A90E2', marginRight: '4px' }}>•</span>
                    설정값은 브라우저에 자동으로 안전하게 보관됩니다
                </div>

                <div style={{ marginTop: '3.5rem', marginBottom: '2.5rem', display: 'flex', justifyContent: 'center' }}>
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

export default NumberPicker;
