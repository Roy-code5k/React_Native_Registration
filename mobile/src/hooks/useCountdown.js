import { useState, useEffect } from 'react';

export const useCountdown = (targetDate) => {
  const calculateTimeLeft = () => {
    if (!targetDate) {
      return {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        isExpired: true,
        formattedString: '00d : 00h : 00m : 00s',
      };
    }

    const difference = new Date(targetDate).getTime() - Date.now();

    if (difference <= 0) {
      return {
        days: '00',
        hours: '00',
        minutes: '00',
        seconds: '00',
        isExpired: true,
        formattedString: '00d : 00h : 00m : 00s',
      };
    }

    const d = Math.floor(difference / (1000 * 60 * 60 * 24));
    const h = Math.floor((difference / (1000 * 60 * 60)) % 24);
    const m = Math.floor((difference / 1000 / 60) % 60);
    const s = Math.floor((difference / 1000) % 60);

    const pad = (num) => String(num).padStart(2, '0');

    const days = pad(d);
    const hours = pad(h);
    const minutes = pad(m);
    const seconds = pad(s);

    return {
      days,
      hours,
      minutes,
      seconds,
      isExpired: false,
      formattedString: `${days}d : ${hours}h : ${minutes}m : ${seconds}s`,
    };
  };

  const [timeLeft, setTimeLeft] = useState(calculateTimeLeft());

  useEffect(() => {
    setTimeLeft(calculateTimeLeft());

    const timer = setInterval(() => {
      const nextTime = calculateTimeLeft();
      setTimeLeft(nextTime);
      if (nextTime.isExpired) {
        clearInterval(timer);
      }
    }, 1000);

    return () => clearInterval(timer);
  }, [targetDate]);

  return timeLeft;
};

export default useCountdown;
