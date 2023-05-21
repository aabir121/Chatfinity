export const formatChatTimestamp = (timestamp) => {
    const date = new Date(timestamp);
    const now = new Date();
    const secondsSince = (now - date) / 1000;
    const daysSince = Math.floor(secondsSince / (24 * 60 * 60));

    if (daysSince === 0) {
        return date.toLocaleTimeString([], {hour: 'numeric', minute: 'numeric'});
    } else if (daysSince < 7) {
        return date.toLocaleDateString([], {weekday: 'short', hour: 'numeric', minute: 'numeric'});
    } else {
        return date.toLocaleDateString([], {year: 'numeric', month: 'short', day: 'numeric'});
    }
};

export const formatTimeAgo = (timestamp) => {
    const now = Date.now();
    const diff = now - Date.parse(timestamp);

    const minutes = Math.floor(diff / (1000 * 60));

    if (minutes < 1) {
        return "Just now";
    } else if (minutes === 1) {
        return "1 minute ago";
    } else if (minutes < 60) {
        return `${minutes} minutes ago`;
    } else if (minutes < 120) {
        return "1 hour ago";
    } else if (minutes < 1440) {
        const hours = Math.floor(minutes / 60);
        return `${hours} hours ago`;
    } else {
        const days = Math.floor(minutes / 1440);
        return `${days} days ago`;
    }
}