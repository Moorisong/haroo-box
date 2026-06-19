import { useState, useEffect, useCallback } from 'react';
import { SeatMode } from './useSeatRandom';

const STORAGE_KEY_PAIRS = 'TRT_SEAT_PAIRS';
const STORAGE_KEY_COLS = 'TRT_SEAT_COLS';
const STORAGE_KEY_TOTAL = 'TRT_SEAT_TOTAL';
const STORAGE_KEY_MODE = 'TRT_SEAT_MODE';
const STORAGE_KEY_NAMES = 'TRT_SEAT_NAMES';
const SESSION_KEY_FIXED = 'TRT_SEAT_FIXED_SESSION';
const SESSION_KEY_EMPTY = 'TRT_SEAT_EMPTY_SESSION';

export const useSeatSettings = () => {
    const [pairRows, setPairRows] = useState<number>(5);
    const [pairRowsInput, setPairRowsInput] = useState<string>('5');
    const [pairsPerRowDirect, setPairsPerRowDirect] = useState<number>(3);
    const [pairsPerRowInput, setPairsPerRowInput] = useState<string>('3');
    const [totalStudents, setTotalStudents] = useState<number>(30);
    const [totalStudentsInput, setTotalStudentsInput] = useState<string>('30');
    const [mode, setMode] = useState<SeatMode>('number');
    const [names, setNames] = useState<string[]>([]);
    const [fixedSeats, setFixedSeats] = useState<Map<string, number>>(new Map());
    const [emptySeats, setEmptySeats] = useState<Set<string>>(new Set());
    const [selectedSeat, setSelectedSeat] = useState<{ row: number, pair: number, seat: number } | null>(null);

    const studentCount = mode === 'name' ? names.length : totalStudents;
    const pairsPerRow = pairsPerRowDirect;

    useEffect(() => {
        const savedPairs = localStorage.getItem(STORAGE_KEY_PAIRS);
        const savedCols = localStorage.getItem(STORAGE_KEY_COLS);
        const savedTotal = localStorage.getItem(STORAGE_KEY_TOTAL);
        const savedMode = localStorage.getItem(STORAGE_KEY_MODE);
        const savedNames = localStorage.getItem(STORAGE_KEY_NAMES);
        const savedFixed = sessionStorage.getItem(SESSION_KEY_FIXED);
        const savedEmpty = sessionStorage.getItem(SESSION_KEY_EMPTY);

        if (savedPairs) { const v = parseInt(savedPairs); setPairRows(v); setPairRowsInput(String(v)); }
        if (savedCols) { const v = parseInt(savedCols); setPairsPerRowDirect(v); setPairsPerRowInput(String(v)); }
        if (savedTotal) { const v = parseInt(savedTotal); setTotalStudents(v); setTotalStudentsInput(String(v)); }
        if (savedMode) setMode(savedMode as SeatMode);
        if (savedNames) {
            const parsed = JSON.parse(savedNames);
            setNames(parsed);
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
        totalStudents?: number;
        mode?: SeatMode;
        names?: string[];
        fixedSeats?: Map<string, number>;
        emptySeats?: Set<string>;
    }) => {
        if (data.pairRows !== undefined) localStorage.setItem(STORAGE_KEY_PAIRS, data.pairRows.toString());
        if (data.totalStudents !== undefined) localStorage.setItem(STORAGE_KEY_TOTAL, data.totalStudents.toString());
        if (data.mode !== undefined) localStorage.setItem(STORAGE_KEY_MODE, data.mode);
        if (data.names !== undefined) localStorage.setItem(STORAGE_KEY_NAMES, JSON.stringify(data.names));
        if (data.fixedSeats !== undefined) {
            const fixedObj = Object.fromEntries(data.fixedSeats);
            sessionStorage.setItem(SESSION_KEY_FIXED, JSON.stringify(fixedObj));
        }
        if (data.emptySeats !== undefined) {
            sessionStorage.setItem(SESSION_KEY_EMPTY, JSON.stringify([...data.emptySeats]));
        }
    }, []);

    const handleModeChange = (newMode: SeatMode) => {
        setMode(newMode);
        saveToStorage({ mode: newMode });
    };

    const handleSeatClick = (row: number, pair: number, seat: number) => {
        setSelectedSeat({ row, pair, seat });
    };

    const setFixedSeat = (studentIdx: number) => {
        if (!selectedSeat) return;

        const posKey = `${selectedSeat.row}-${selectedSeat.pair}-${selectedSeat.seat}`;
        const newFixed = new Map(fixedSeats);

        const newEmpty = new Set(emptySeats);
        newEmpty.delete(posKey);

        if (studentIdx <= 0 || studentIdx > studentCount) {
            newFixed.delete(posKey);
        } else {
            for (const [pos, num] of newFixed) {
                if (num === studentIdx && pos !== posKey) {
                    newFixed.delete(pos);
                }
            }
            newFixed.set(posKey, studentIdx);
        }

        setFixedSeats(newFixed);
        setEmptySeats(newEmpty);
        setSelectedSeat(null);
        saveToStorage({ fixedSeats: newFixed, emptySeats: newEmpty });
    };

    const toggleEmptySeat = () => {
        if (!selectedSeat) return;

        const posKey = `${selectedSeat.row}-${selectedSeat.pair}-${selectedSeat.seat}`;
        const newEmpty = new Set(emptySeats);
        const newFixed = new Map(fixedSeats);

        if (newEmpty.has(posKey)) {
            newEmpty.delete(posKey);
        } else {
            newEmpty.add(posKey);
            newFixed.delete(posKey);
        }

        setEmptySeats(newEmpty);
        setFixedSeats(newFixed);
        setSelectedSeat(null);
        saveToStorage({ emptySeats: newEmpty, fixedSeats: newFixed });
    };

    const clearAllFixed = () => {
        if (confirm('모든 고정석을 해제하시겠습니까?')) {
            const emptyMap = new Map<string, number>();
            setFixedSeats(emptyMap);
            saveToStorage({ fixedSeats: emptyMap });
        }
    };

    const clearAllEmpty = () => {
        if (confirm('모든 빈 자리를 해제하시겠습니까?')) {
            const emptySet = new Set<string>();
            setEmptySeats(emptySet);
            saveToStorage({ emptySeats: emptySet });
        }
    };

    const getDisplayText = useCallback((idx: number): string => {
        if (mode === 'name' && names[idx - 1]) {
            return names[idx - 1];
        }
        return String(idx);
    }, [mode, names]);

    return {
        pairRows, pairRowsInput, pairsPerRowDirect, pairsPerRowInput, pairsPerRow,
        totalStudents, totalStudentsInput, studentCount, mode, names,
        fixedSeats, emptySeats, selectedSeat,
        handleModeChange, handleSeatClick, setFixedSeat, toggleEmptySeat,
        clearAllFixed, clearAllEmpty, getDisplayText, setSelectedSeat
    };
};
