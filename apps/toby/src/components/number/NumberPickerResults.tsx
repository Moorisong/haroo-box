import React from 'react';
import NumberSlot from '../NumberSlot';

interface NumberPickerResultsProps {
    results: number[];
    isAnimating: boolean;
    handleAnimationComplete: () => void;
}

const NumberPickerResults: React.FC<NumberPickerResultsProps> = ({
    results, isAnimating, handleAnimationComplete
}) => {
    return (
        <div style={{
            minHeight: '220px',
            marginBottom: '2.5rem',
            padding: '2.5rem',
            background: '#ffffff',
            borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            border: '1px solid #e2e2ea',
            display: 'flex',
            flexDirection: 'column',
            justifyContent: 'center',
            alignItems: 'center',
            position: 'relative',
            overflow: 'hidden'
        }}>
            <div style={{
                position: 'absolute',
                opacity: 0.03,
                fontSize: '10rem',
                fontWeight: '900',
                color: '#4A90E2',
                pointerEvents: 'none',
                zIndex: 0
            }}>
                ?
            </div>

            <div style={{
                display: 'flex',
                justifyContent: 'center',
                flexWrap: 'wrap',
                gap: '1rem',
                width: '100%',
                zIndex: 1
            }}>
                {results.length > 0 ? (
                    results.map((num, idx) => (
                        <NumberSlot
                            key={`${isAnimating ? 'anim' : 'static'}-${idx}`}
                            targetNumber={num}
                            isAnimating={isAnimating}
                            index={idx}
                            onAnimationComplete={handleAnimationComplete}
                        />
                    ))
                ) : (
                    <div style={{
                        textAlign: 'center',
                        color: '#bbc',
                        fontWeight: '500'
                    }}>
                        <div style={{ fontSize: '3rem', marginBottom: '0.5rem' }}>🎯</div>
                        <div style={{ fontSize: '1.1rem' }}>아래 버튼을 눌러 추첨을 시작하세요</div>
                    </div>
                )}
            </div>
        </div>
    );
};

export default NumberPickerResults;
