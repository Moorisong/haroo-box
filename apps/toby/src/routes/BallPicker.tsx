import React from 'react';
import Header from '../components/Header';
import MyorokBanner from '../components/MyorokBanner';
import KakaoAdfit, { ADFIT_UNITS, ADFIT_SIZES } from '../components/KakaoAdFit';
import { APP_TITLES } from '../constants/app';
import { useBallPicker } from '../hooks/useBallPicker';
import BallPickerControls from '../components/ball/BallPickerControls';
import WinnerModal from '../components/ball/WinnerModal';

const BallPicker: React.FC = () => {
    const {
        canvasRef, totalBalls, setTotalBalls, gameMode, handleModeChange,
        isPlaying, isPaused, setIsPaused, winner, setWinner,
        simulationSpeed, setSimulationSpeed, startSimulation
    } = useBallPicker();

    return (
        <div style={{
            minHeight: '100vh',
            background: 'linear-gradient(180deg, #f8faff 0%, #f0f4f8 100%)',
            fontFamily: "'Pretendard', -apple-system, BlinkMacSystemFont, system-ui, Roboto, sans-serif"
        }}>
            <Header />
            <div className="container" style={{ maxWidth: '900px', padding: '2rem 1.5rem' }}>
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
                        {APP_TITLES.BALL}
                    </h1>
                    <p style={{ color: '#667', marginTop: '0.6rem', fontSize: '1rem', fontWeight: '500' }}>
                        {gameMode === 1 ? '고정된 코스에서 레이싱으로 1등 뽑기' : '매번 새로운 랜덤 코스! 1등은 누구?'}
                    </p>
                </div>

                <BallPickerControls
                    gameMode={gameMode}
                    handleModeChange={handleModeChange}
                    isPlaying={isPlaying}
                    totalBalls={totalBalls}
                    setTotalBalls={setTotalBalls}
                    simulationSpeed={simulationSpeed}
                    setSimulationSpeed={setSimulationSpeed}
                    isPaused={isPaused}
                    setIsPaused={setIsPaused}
                    startSimulation={startSimulation}
                />

                <div style={{
                    textAlign: 'center',
                    color: '#99a',
                    fontSize: '0.9rem',
                    fontWeight: '500',
                    marginBottom: '1.5rem'
                }}>
                    <span style={{ color: gameMode === 1 ? '#4A90E2' : '#E24A90', marginRight: '6px' }}>•</span>
                    {gameMode === 1
                        ? '고정 맵: 항상 같은 장애물 배치로 공정한 레이스'
                        : '랜덤 맵: 매번 공이 어디로 튈지 모르는 짜릿함!'}
                </div>

                <div style={{
                    position: 'relative',
                    width: 'fit-content',
                    margin: '0 auto',
                    borderRadius: '16px',
                    overflow: 'hidden',
                    boxShadow: '0 4px 20px rgba(0,0,0,0.15)'
                }}>
                    <canvas
                        ref={canvasRef}
                        id="ball-canvas"
                        width="800"
                        height="600"
                        style={{
                            display: 'block',
                            border: '2px solid #ddd',
                            borderRadius: '16px',
                            backgroundColor: '#000'
                        }}
                    />

                    <WinnerModal winner={winner} setWinner={setWinner} />
                </div>

                <div style={{ marginTop: '2.5rem', marginBottom: '2rem', display: 'flex', justifyContent: 'center' }}>
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
                .speed-range {
                    -webkit-appearance: none;
                    width: 100px;
                    height: 4px;
                    background: #e2e2ea;
                    border-radius: 2px;
                    outline: none;
                    margin: 0;
                    cursor: pointer;
                }

                .speed-range::-webkit-slider-thumb {
                    -webkit-appearance: none;
                    width: 14px;
                    height: 14px;
                    background: #4A90E2;
                    border-radius: 50%;
                    cursor: pointer;
                    box-shadow: 0 2px 4px rgba(0,0,0,0.1);
                    border: none;
                    margin-top: -5px;
                }

                .speed-range::-moz-range-thumb {
                    width: 14px;
                    height: 14px;
                    background: #4A90E2;
                    border-radius: 50%;
                    cursor: pointer;
                    border: none;
                }

                .speed-range::-webkit-slider-runnable-track {
                    width: 100%;
                    height: 4px;
                    cursor: pointer;
                    background: #e2e2ea;
                    border-radius: 2px;
                    border: none;
                }
            `}</style>
        </div>
    );
};

export default BallPicker;
