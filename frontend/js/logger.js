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

// Override console methods
console.log = function (...args) {
    sendLogToServer(`[LOG] ${args.join(' ')}`);
    originalConsoleLog(...args);
};

console.error = function (...args) {
    sendLogToServer(`[ERROR] ${args.join(' ')}`);
    originalConsoleError(...args);
};

// Catch global errors
window.onerror = function (message, source, lineno, colno, error) {
    const errorMessage = `[GLOBAL ERROR] ${message} (at ${source}:${lineno}:${colno})`;
    sendLogToServer(errorMessage);
    return true;
};

// Catch resource errors
window.addEventListener('error', (event) => {
    const errorMessage = `[RESOURCE ERROR] ${event.message} (from ${event.filename}:${event.lineno}:${event.colno})`;
    sendLogToServer(errorMessage);
});

// Catch unhandled promise rejections
window.addEventListener('unhandledrejection', (event) => {
    const errorMessage = `[UNHANDLED PROMISE REJECTION] ${event.reason}`;
    sendLogToServer(errorMessage);
});
