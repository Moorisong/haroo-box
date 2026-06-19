import { useState, useEffect, useCallback } from 'react';
import { loadFromStorage, saveToStorage, STORAGE_KEYS } from '../utils/storage';
import { pickRandomNumbers } from '../utils/random';

export const useNumberPicker = () => {
    const [totalStudents, setTotalStudents] = useState<number>(30);
    const [pickCount, setPickCount] = useState<number>(1);
    const [excludeInput, setExcludeInput] = useState<string>('');

    const [results, setResults] = useState<number[]>([]);
    const [isAnimating, setIsAnimating] = useState<boolean>(false);
    const [animationDoneCount, setAnimationDoneCount] = useState<number>(0);

    useEffect(() => {
        const savedTotal = loadFromStorage(STORAGE_KEYS.TOTAL_STUDENTS, 30);
        const savedCount = loadFromStorage(STORAGE_KEYS.PICK_COUNT, 1);
        const savedExclude = loadFromStorage(STORAGE_KEYS.EXCLUDE_LIST, []);

        setTotalStudents(savedTotal);
        setPickCount(savedCount);
        setExcludeInput(savedExclude.join(', '));
    }, []);

    useEffect(() => {
        saveToStorage(STORAGE_KEYS.TOTAL_STUDENTS, totalStudents);
        saveToStorage(STORAGE_KEYS.PICK_COUNT, pickCount);
        const excludeList = parseExcludeInput(excludeInput);
        saveToStorage(STORAGE_KEYS.EXCLUDE_LIST, excludeList);
    }, [totalStudents, pickCount, excludeInput]);

    const parseExcludeInput = useCallback((input: string): number[] => {
        return input
            .split(',')
            .map(s => parseInt(s.trim(), 10))
            .filter(n => !isNaN(n));
    }, []);

    const handleStart = useCallback(() => {
        if (isAnimating) return;

        const excludeList = parseExcludeInput(excludeInput);

        if (totalStudents < 1) {
            alert('전체 인원은 1명 이상이어야 합니다.');
            return;
        }
        if (pickCount < 1) {
            alert('뽑을 인원은 1명 이상이어야 합니다.');
            return;
        }
        const possibleCount = totalStudents - excludeList.filter(n => n <= totalStudents).length;
        if (pickCount > possibleCount) {
            alert(`뽑을 수 있는 인원이 부족합니다. (가능: ${possibleCount}명)`);
            return;
        }

        try {
            const newResults = pickRandomNumbers(totalStudents, pickCount, excludeList);
            setResults(newResults);
            setIsAnimating(true);
            setAnimationDoneCount(0);
        } catch (e) {
            alert('번호 추첨 중 오류가 발생했습니다.');
            console.error(e);
        }
    }, [isAnimating, excludeInput, totalStudents, pickCount, parseExcludeInput]);

    const handleAnimationComplete = useCallback(() => {
        setAnimationDoneCount(prev => prev + 1);
    }, []);

    useEffect(() => {
        if (isAnimating && animationDoneCount >= pickCount) {
            setIsAnimating(false);
        }
    }, [animationDoneCount, pickCount, isAnimating]);

    return {
        totalStudents, setTotalStudents,
        pickCount, setPickCount,
        excludeInput, setExcludeInput,
        results, isAnimating, animationDoneCount,
        handleStart, handleAnimationComplete
    };
};
