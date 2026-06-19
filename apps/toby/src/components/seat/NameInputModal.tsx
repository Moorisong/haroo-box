import React from 'react';

interface NameInputModalProps {
    nameInput: string;
    setNameInput: (val: string) => void;
    parseNames: (input: string) => string[];
    handleNameInputSave: () => void;
    setShowNameInput: (show: boolean) => void;
}

const NameInputModal: React.FC<NameInputModalProps> = ({
    nameInput, setNameInput, parseNames, handleNameInputSave, setShowNameInput
}) => {
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
                padding: '1.5rem',
                borderRadius: '16px',
                width: '90%',
                maxWidth: '400px'
            }}>
                <h3 style={{ margin: '0 0 0.5rem 0' }}>📝 학생 이름 입력</h3>
                <p style={{ color: '#666', fontSize: '0.85rem', margin: '0 0 1rem 0' }}>
                    줄바꿈, 쉼표, 띄어쓰기로 구분
                </p>
                <textarea
                    value={nameInput}
                    onChange={(e) => setNameInput(e.target.value)}
                    placeholder="예시:&#10;김철수&#10;이영희&#10;박민수"
                    style={{
                        width: '100%',
                        height: '200px',
                        padding: '0.8rem',
                        fontSize: '1rem',
                        border: '1px solid #ddd',
                        borderRadius: '8px',
                        resize: 'vertical',
                        fontFamily: 'inherit'
                    }}
                />
                <div style={{ marginTop: '0.5rem', fontSize: '0.85rem', color: '#888', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
                    <span>인식된 이름: {parseNames(nameInput).length}명</span>
                    <button
                        onClick={() => {
                            const testData = "김민준, 이서준, 박지후, 최도윤, 정예준, 강하준, 조준우, 윤시우, 장서연, 임지우, 한수아, 오예린, 신하윤, 서서현, 권지민, 황민서, 안윤서, 송채원, 유소연, 남유진, 백태윤, 노승우, 하준호, 배현우, 문다은, 성은서, 주시현, 류유나, 홍채윤, 전수빈, 고지안, 손연우, 차세아";
                            navigator.clipboard.writeText(testData);
                            alert('테스트 이름 33명 복사됨! 붙여넣기 하세요!');
                        }}
                        style={{ padding: '0.3rem 0.6rem', fontSize: '0.75rem', background: '#f5f5f5', border: '1px solid #ddd', borderRadius: '4px', cursor: 'pointer', color: '#666' }}
                    >
                        📋 테스트 데이터
                    </button>
                </div>
                <div style={{ display: 'flex', gap: '0.5rem', justifyContent: 'flex-end', marginTop: '1rem' }}>
                    <button
                        onClick={() => setShowNameInput(false)}
                        style={{ padding: '0.5rem 1rem', background: '#f0f0f0', border: '1px solid #ddd', borderRadius: '6px', cursor: 'pointer' }}
                    >
                        취소
                    </button>
                    <button
                        onClick={handleNameInputSave}
                        style={{ padding: '0.5rem 1.5rem', background: '#4A90E2', color: '#fff', border: 'none', borderRadius: '6px', cursor: 'pointer', fontWeight: '600' }}
                    >
                        저장
                    </button>
                </div>
            </div>
        </div>
    );
};

export default NameInputModal;
