'use client';

import React, { useState, useEffect } from 'react';

export type DeviceType = 'mobile' | 'tablet' | 'desktop';

export function useDeviceType() {
  const [device, setDevice] = useState<DeviceType>('desktop');

  useEffect(() => {
    const handleResize = () => {
      const width = window.innerWidth;
      if (width < 768) {
        setDevice('mobile');
      } else if (width >= 768 && width < 1024) {
        setDevice('tablet');
      } else {
        setDevice('desktop');
      }
    };

    handleResize(); // 초기화
    window.addEventListener('resize', handleResize);
    return () => window.removeEventListener('resize', handleResize);
  }, []);

  return device;
}

interface DeviceWrapperProps {
  mobile: React.ReactNode;
  tablet: React.ReactNode;
  desktop: React.ReactNode;
}

export function DeviceWrapper({ mobile, tablet, desktop }: DeviceWrapperProps) {
  const device = useDeviceType();

  if (device === 'mobile') {
    return <div data-testid="device-mobile-view">{mobile}</div>;
  }
  if (device === 'tablet') {
    return <div data-testid="device-tablet-view">{tablet}</div>;
  }
  return <div data-testid="device-desktop-view">{desktop}</div>;
}
