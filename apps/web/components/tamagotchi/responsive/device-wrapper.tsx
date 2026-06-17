'use client';

import React, { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop' | 'landscape';

export function useDeviceState() {
  const [state, setState] = useState<{ device: DeviceType; isLandscape: boolean }>({
    device: 'desktop',
    isLandscape: false,
  });

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      const height = window.innerHeight;
      const isLandscape = width > height && width < 1024; // 데스크톱 미만의 기기에서 가로 비율인 경우

      let device: DeviceType = 'desktop';
      if (width < 768) {
        device = 'mobile';
      } else if (width >= 768 && width < 1024) {
        device = 'tablet';
      }

      setState({ device, isLandscape });
    };

    handleResize(); // 초기화
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return state;
}

interface DeviceWrapperProps {
  mobile: React.ReactNode;
  tablet: React.ReactNode;
  desktop: React.ReactNode;
  landscape: React.ReactNode;
}

export function DeviceWrapper({ mobile, tablet, desktop, landscape }: DeviceWrapperProps) {
  const { device, isLandscape } = useDeviceState();

  if (isLandscape) {
    return <div data-testid="device-landscape-view">{landscape}</div>;
  }
  if (device === 'mobile') {
    return <div data-testid="device-mobile-view">{mobile}</div>;
  }
  if (device === 'tablet') {
    return <div data-testid="device-tablet-view">{tablet}</div>;
  }
  return <div data-testid="device-desktop-view">{desktop}</div>;
}
