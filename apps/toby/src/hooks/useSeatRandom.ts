import { useState, useEffect, useCallback } from 'react';

export interface SeatData {
    display: string;
}

export type SeatMode = 'number' | 'name';

const STORAGE_KEY_PAIRS = 'TRT_SEAT_PAIRS';
const STORAGE_KEY_COLS = 'TRT_SEAT_COLS';
const STORAGE_KEY_MODE = 'TRT_SEAT_MODE';
const STORAGE_KEY_NAMES = 'TRT_SEAT_NAMES';
const STORAGE_KEY_TOTAL = 'TRT_SEAT_TOTAL';
const SESSION_KEY_FIXED = 'TRT_SEAT_FIXED_SESSION';
const SESSION_KEY_EMPTY = 'TRT_SEAT_EMPTY_SESSION';

export const useSeatRandom = () => {
    const [pairRows, setPairRows] = useState<number>(5);
    const [pairRowsInput, setPairRowsInput] = useState<string>('5');
    const [pairsPerRowDirect, setPairsPerRowDirect] = useState<number>(3);
    const [pairsPerRowInput, setPairsPerRowInput] = useState<string>('3');
    const [mode, setMode] = useState<SeatMode>('number');
    const [totalStudents, setTotalStudents] = useState<number>(30);
    const [totalStudentsInput, setTotalStudentsInput] = useState<string>('30');
    const [names, setNames] = useState<string[]>([]);
    const [nameInput, setNameInput] = useState<string>('');
    const [showNameInput, setShowNameInput] = useState<boolean>(false);
    const [seats, setSeats] = useState<(SeatData | null)[][]>([]);
    const [fixedSeats, setFixedSeats] = useState<Map<string, number>>(new Map());
    const [emptySeats, setEmptySeats] = useState<Set<string>>(new Set());
    const [showShuffleHint, setShowShuffleHint] = useState<boolean>(false);

    useEffect(() => {
        const savedPairs = localStorage.getItem(STORAGE_KEY_PAIRS);
        const savedCols = localStorage.getItem(STORAGE_KEY_COLS);
        const savedMode = localStorage.getItem(STORAGE_KEY_MODE);
        const savedTotal = localStorage.getItem(STORAGE_KEY_TOTAL);
        const savedNames = localStorage.getItem(STORAGE_KEY_NAMES);
        const savedFixed = sessionStorage.getItem(SESSION_KEY_FIXED);
        const savedEmpty = sessionStorage.getItem(SESSION_KEY_EMPTY);

        if (savedPairs) { const v = parseInt(savedPairs); setPairRows(v); setPairRowsInput(String(v)); }
        if (savedCols) { const v = parseInt(savedCols); setPairsPerRowDirect(v); setPairsPerRowInput(String(v)); }
        if (savedMode) setMode(savedMode as SeatMode);
        if (savedTotal) { const v = parseInt(savedTotal); setTotalStudents(v); setTotalStudentsInput(String(v)); }
        if (savedNames) {
            const parsed = JSON.parse(savedNames);
            setNames(parsed);
            setNameInput(parsed.join('\n'));
        }
        if (savedFixed) {
            const parsed = JSON.parse(savedFixed);
            setFixedSeats(new Map(Object.entries(parsed).map(([k, v]) => [k, v as number])));
        }
        if (savedEmpty) {
            const parsed: string[] = JSON.parse(savedEmpty);
            setEmptySeats(new Set(parsed));
        }
    }, []);

    const saveToStorage = useCallback((data: {
        pairRows?: number;
        pairsPerRowDirect?: number;
        totalStudents?: number;
        mode?: SeatMode;
        names?: string[];
    }) => {
        if (data.pairRows !== undefined) localStorage.setItem(STORAGE_KEY_PAIRS, data.pairRows.toString());
        if (data.pairsPerRowDirect !== undefined) localStorage.setItem(STORAGE_KEY_COLS, data.pairsPerRowDirect.toString());
        if (data.totalStudents !== undefined) localStorage.setItem(STORAGE_KEY_TOTAL, data.totalStudents.toString());
        if (data.mode !== undefined) localStorage.setItem(STORAGE_KEY_MODE, data.mode);
        if (data.names !== undefined) localStorage.setItem(STORAGE_KEY_NAMES, JSON.stringify(data.names));
    }, []);

    const parseNames = useCallback((input: string): string[] => {
        return input
            .split(/[\n,，\t\s]+/)
            .map(s => s.trim())
            .filter(s => s.length > 0);
    }, []);

    const handlePairRowsChange = (inputStr: string) => {
        setPairRowsInput(inputStr);
        const parsed = parseInt(inputStr, 10);
        if (!isNaN(parsed)) {
            const newVal = Math.max(1, Math.min(20, parsed));
            setPairRows(newVal);
            saveToStorage({ pairRows: newVal });
        }
    };

    const handlePairRowsBlur = () => {
        const clamped = Math.max(1, Math.min(20, parseInt(pairRowsInput, 10) || 1));
        setPairRows(clamped);
        setPairRowsInput(String(clamped));
        saveToStorage({ pairRows: clamped });
    };

    const handlePairsPerRowChange = (inputStr: string) => {
        setPairsPerRowInput(inputStr);
        const parsed = parseInt(inputStr, 10);
        if (!isNaN(parsed)) {
            const newVal = Math.max(1, Math.min(20, parsed));
            setPairsPerRowDirect(newVal);
            saveToStorage({ pairsPerRowDirect: newVal });
        }
    };

    const handlePairsPerRowBlur = () => {
        const clamped = Math.max(1, Math.min(20, parseInt(pairsPerRowInput, 10) || 1));
        setPairsPerRowDirect(clamped);
        setPairsPerRowInput(String(clamped));
        saveToStorage({ pairsPerRowDirect: clamped });
    };

    const handleTotalStudentsChange = (inputStr: string) => {
        setTotalStudentsInput(inputStr);
        const parsed = parseInt(inputStr, 10);
        if (!isNaN(parsed)) {
            const newVal = Math.max(1, parsed);
            setTotalStudents(newVal);
            saveToStorage({ totalStudents: newVal });
        }
    };

    const handleTotalStudentsBlur = () => {
        const clamped = Math.max(1, parseInt(totalStudentsInput, 10) || 1);
        setTotalStudents(clamped);
        setTotalStudentsInput(String(clamped));
        saveToStorage({ totalStudents: clamped });
    };

    const handleModeChange = (newMode: SeatMode) => {
        setMode(newMode);
        saveToStorage({ mode: newMode });
    };

    const handleNameInputSave = () => {
        const parsed = parseNames(nameInput);

        const hasSettings = fixedSeats.size > 0 || emptySeats.size > 0;
        if (hasSettings) {
            const confirmed = confirm('이름 목록을 변경하면 고정석 등 모든 세팅 값이 초기화됩니다.\n변경하시겠습니까?');
            if (!confirmed) return;

            const emptyMap = new Map<string, number>();
            const emptySet = new Set<string>();
            setFixedSeats(emptyMap);
            setEmptySeats(emptySet);
            sessionStorage.removeItem(SESSION_KEY_FIXED);
            sessionStorage.removeItem(SESSION_KEY_EMPTY);
        }

        setNames(parsed);
        setTotalStudents(parsed.length);
        setShowNameInput(false);
        saveToStorage({ names: parsed, totalStudents: parsed.length });
        if (parsed.length > 0) setShowShuffleHint(true);
    };

    const getStudentDisplay = useCallback((index: number): string => {
        if (mode === 'name' && names[index]) {
            return names[index];
        }
        return String(index + 1);
    }, [mode, names]);

    const studentCount = mode === 'name' ? names.length : totalStudents;
    const pairsPerRow = pairsPerRowDirect;

    const shuffleSeats = useCallback(() => {
        const studentList = mode === 'name' ? [...names] : Array.from({ length: totalStudents }, (_, i) => String(i + 1));

        if (studentCount === 0) {
            if (mode === 'name') alert('등록된 학생 이름이 없습니다. 이름을 먼저 입력해주세요!');
            else alert('학생 인원 설정이 잘못되었습니다.');
            return;
        }
        const count = studentCount;

        const fixedStudentIndices = new Set<number>();
        fixedSeats.forEach((studentIdx) => {
            if (studentIdx > 0 && studentIdx <= count) {
                fixedStudentIndices.add(studentIdx - 1);
            }
        });

        const shuffledStudents: string[] = [];
        for (let i = 0; i < count; i++) {
            if (!fixedStudentIndices.has(i)) {
                shuffledStudents.push(studentList[i]);
            }
        }

        for (let i = shuffledStudents.length - 1; i > 0; i--) {
            const j = Math.floor(Math.random() * (i + 1));
            [shuffledStudents[i], shuffledStudents[j]] = [shuffledStudents[j], shuffledStudents[i]];
        }

        const pairs: (SeatData | null)[][] = [];
        let shuffleIndex = 0;

        for (let row = 0; row < pairRows; row++) {
            const rowPairs: (SeatData | null)[] = [];
            for (let p = 0; p < pairsPerRow; p++) {
                for (let seat = 0; seat < 2; seat++) {
                    const posKey = `${row}-${p}-${seat}`;

                    if (emptySeats.has(posKey)) {
                        rowPairs.push({ display: '🚫' });
                        continue;
                    }

                    const fixedStudentIdx = fixedSeats.get(posKey);

                    if (fixedStudentIdx && fixedStudentIdx > 0 && fixedStudentIdx <= count) {
                        rowPairs.push({ display: getStudentDisplay(fixedStudentIdx - 1) });
                    } else if (shuffleIndex < shuffledStudents.length) {
                        rowPairs.push({ display: shuffledStudents[shuffleIndex] });
                        shuffleIndex++;
                    } else {
                        rowPairs.push(null);
                    }
                }
            }
            pairs.push(rowPairs);
        }

        setSeats(pairs);
    }, [mode, names, totalStudents, studentCount, fixedSeats, emptySeats, pairRows, pairsPerRow, getStudentDisplay]);

    useEffect(() => {
        if (seats.length > 0) {
            shuffleSeats();
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [pairRows, pairsPerRowDirect]);

    return {
        pairRows, pairRowsInput, pairsPerRowDirect, pairsPerRowInput, mode, totalStudents, totalStudentsInput,
        names, nameInput, showNameInput, seats, showShuffleHint,
        handlePairRowsChange, handlePairRowsBlur, handlePairsPerRowChange, handlePairsPerRowBlur,
        handleTotalStudentsChange, handleTotalStudentsBlur, handleModeChange,
        setNameInput, setShowNameInput, handleNameInputSave, shuffleSeats, setShowShuffleHint,
        parseNames
    };
};
