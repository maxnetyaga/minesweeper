export const waitForOpenConnection = (
    socket,
    maxNumberOfAttempts,
    intervalTime
) => {
    return new Promise((resolve, reject) => {
        let currentAttempt = 0;
        const interval = setInterval(() => {
            if (currentAttempt > maxNumberOfAttempts - 1) {
                clearInterval(interval);
                reject(new Error("Maximum number of attempts exceeded"));
            } else if (socket.readyState === socket.OPEN) {
                clearInterval(interval);
                resolve();
            }
            currentAttempt++;
        }, intervalTime);
    });
};

// request templates

export const getStartEvent = (fieldSize, gameDifficulty, initCellId) => {
    return {
        action: "start",
        fieldSize: fieldSize,
        gameDifficulty: gameDifficulty.toUpperCase(),
        cellId: initCellId,
    };
};

export const getPlayEvent = (cellId, playAction) => {
    return {
        action: playAction,
        cellId: cellId,
    };
};
