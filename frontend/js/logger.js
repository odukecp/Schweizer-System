const originalConsoleLog = console.log.bind(console);
const originalConsoleError = console.error.bind(console);

// Robust logging function
function sendLogToServer(message) {
    const data = { message };
    const blob = new Blob([JSON.stringify(data)], { type: 'application/json' });

    if (navigator.sendBeacon) {
        navigator.sendBeacon('http://localhost:3000/api/log', blob);
    } else {
        fetch('http://localhost:3000/api/log', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify(data),
            keepalive: true,
            credentials: 'omit',
        }).catch(originalConsoleError);
    }
}

// Override console methods to capture and forward logs
console.log = function (...args) {
    // Format the log message including file and line number if available
    const formattedMessage = args
        .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
        .join(' ');
    sendLogToServer(`[LOG] ${formattedMessage}`);
    originalConsoleLog.apply(console, args); // Use apply to preserve the original context and arguments
};

console.error = function (...args) {
    // Format the error message including file and line number if available
    const formattedMessage = args
        .map((arg) => (typeof arg === 'object' ? JSON.stringify(arg) : String(arg)))
        .join(' ');
    sendLogToServer(`[ERROR] ${formattedMessage}`);
    originalConsoleError.apply(console, args); // Use apply to preserve the original context and arguments
};

// Catch global errors
window.onerror = function (message, source, lineno, colno, error) {
    const errorMessage = `[GLOBAL ERROR] ${message} (at ${source}:${lineno}:${colno})`;
    sendLogToServer(errorMessage);
    return true;
};

// Catch resource errors
window.addEventListener(
    'error',
    (event) => {
        const errorMessage = `[RESOURCE ERROR] ${event.message} (from ${event.filename}:${event.lineno}:${event.colno})`;
        sendLogToServer(errorMessage);
    },
    true,
); // Pass `true` to capture errors during event dispatch

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    let errorMessage = `[UNHANDLED PROMISE REJECTION]`;
    if (event.reason instanceof Error) {
        errorMessage += ` ${event.reason.message}`;
    } else {
        errorMessage += ` ${event.reason}`;
    }
    sendLogToServer(errorMessage);
});
