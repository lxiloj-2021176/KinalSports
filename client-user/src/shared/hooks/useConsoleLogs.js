// client-user/src/shared/hooks/useConsoleLogs.js

import { useState, useEffect } from 'react';

const MAX_LOGS = 50;

export const useConsoleLogs = (enabled = __DEV__) => {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (!enabled) return;

    const originalLog = console.log;
    const originalError = console.error;
    const originalWarn = console.warn;

    const addLog = (message, color = '#999', data = null) => {
      const timestamp = new Date().toLocaleTimeString();
      setLogs((prevLogs) => {
        const newLogs = [
          ...prevLogs,
          { timestamp, message, color, data },
        ];
        return newLogs.slice(-MAX_LOGS);
      });
    };

    console.log = (...args) => {
      originalLog(...args);
      const message = args.join(' ');
      addLog(message, '#4CAF50');
    };

    console.error = (...args) => {
      originalError(...args);
      const message = args.join(' ');
      addLog(message, '#F44336');
    };

    console.warn = (...args) => {
      originalWarn(...args);
      const message = args.join(' ');
      addLog(message, '#FF9800');
    };

    return () => {
      console.log = originalLog;
      console.error = originalError;
      console.warn = originalWarn;
    };
  }, [enabled]);

  const clearLogs = () => setLogs([]);

  return { logs, clearLogs };
};
