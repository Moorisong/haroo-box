import React from 'react';

interface NumberPickerConfigProps {
    totalStudents: number;
    setTotalStudents: (val: number) => void;
    pickCount: number;
    setPickCount: (val: number) => void;
    excludeInput: string;
    setExcludeInput: (val: string) => void;
    isAnimating: boolean;
}

const NumberPickerConfig: React.FC<NumberPickerConfigProps> = ({
    totalStudents, setTotalStudents, pickCount, setPickCount, excludeInput, setExcludeInput, isAnimating
}) => {
    return (
        <div style={{
            background: '#ffffff',
            padding: '1.2rem 1.5rem',
            borderRadius: '24px',
            boxShadow: '0 10px 30px rgba(0,0,0,0.04)',
            border: '1px solid #e2e2ea',
            marginBottom: '1.5rem'
        }}>
            <div style={{ display: 'flex', flexDirection: 'column', gap: '0.6rem' }}>
                {[
                    { label: '전체 인원', unit: '명', value: totalStudents, type: 'number', onChange: (v: any) => setTotalStudents(parseInt(v) || 0), min: 1 },
                    { label: '뽑을 인원', unit: '명', value: pickCount, type: 'number', onChange: (v: any) => setPickCount(parseInt(v) || 0), min: 1 },
                    { label: '제외 번호', unit: '', value: excludeInput, type: 'text', onChange: (v: any) => setExcludeInput(v), placeholder: '예: 5, 12' }
                ].map((field, i) => (
                    <div key={i} style={{
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'space-between',
                        padding: '0.2rem 0'
                    }}>
                        <label style={{
                            color: '#445',
                            fontWeight: '600',
                            fontSize: '1rem',
                            flex: '1'
                        }}>
                            {field.label}
                        </label>
                        <div style={{ display: 'flex', alignItems: 'center', gap: '0.8rem', flex: '1.5', justifyContent: 'flex-end' }}>
                            <input
                                type={field.type}
                                value={field.value}
                                onChange={(e) => field.onChange(e.target.value)}
                                placeholder={field.placeholder}
                                min={field.min}
                                disabled={isAnimating}
                                style={{
                                    padding: '0.5rem 0.8rem',
                                    fontSize: '1rem',
                                    width: field.type === 'number' ? '80px' : '100%',
                                    textAlign: field.type === 'number' ? 'center' : 'left',
                                    border: '1px solid #e2e2ea',
                                    borderRadius: '12px',
                                    outline: 'none',
                                    transition: 'all 0.2s ease',
                                    background: '#fcfcfe',
                                    fontWeight: '600',
                                    color: '#334'
                                }}
                                onFocus={(e) => {
                                    e.target.style.borderColor = '#4A90E2';
                                    e.target.style.background = '#fff';
                                }}
                                onBlur={(e) => {
                                    e.target.style.borderColor = '#f0f0f5';
                                    e.target.style.background = '#fcfcfe';
                                }}
                            />
                            {field.unit && <span style={{ color: '#889', fontWeight: '500', width: '20px' }}>{field.unit}</span>}
                        </div>
                    </div>
                ))}
            </div>
        </div>
    );
};

export default NumberPickerConfig;
