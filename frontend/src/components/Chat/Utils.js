export const formatChatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const secondsSince = (now - date) / 1000;
    const daysSince = Math.floor(secondsSince / (24 * 60 * 60));

    if (daysSince === 0) {
        return date.toLocaleTimeString([], { hour: 'numeric', minute: 'numeric' });
    } else if (daysSince < 7) {
        return date.toLocaleDateString([], { weekday: 'short', hour: 'numeric', minute: 'numeric' });
    } else {
        return date.toLocaleDateString([], { year: 'numeric', month: 'short', day: 'numeric' });
    }
};