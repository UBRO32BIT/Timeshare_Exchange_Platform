export function convertDate(dateString: string) {
    const date = new Date(dateString);
    // Extracting day, month, and year from the date object
    const day = date.getDate();
    const month = date.getMonth() + 1; // Month is zero-indexed, so we add 1
    const year = date.getFullYear();

    // Padding day and month with leading zeros if necessary
    const formattedDay = day < 10 ? `0${day}` : day;
    const formattedMonth = month < 10 ? `0${month}` : month;

    // Formatted date in dd/mm/yyyy format
    const formattedDate = `${formattedDay}/${formattedMonth}/${year}`;
    return formattedDate;
}
export function convertDateTime(dateTimeString: string) {
    const dateObj = new Date(dateTimeString);
    const day = String(dateObj.getDate()).padStart(2, '0');
    const month = String(dateObj.getMonth() + 1).padStart(2, '0');
    const year = dateObj.getFullYear();

    const hours = String(dateObj.getHours()).padStart(2, '0');
    const minutes = String(dateObj.getMinutes()).padStart(2, '0');
    const seconds = String(dateObj.getSeconds()).padStart(2, '0');

    const formattedDate = `${day}/${month}/${year} ${hours}:${minutes}:${seconds}`;
    return formattedDate;
}
export function isValidDateRange(startDateString: string, endDateString: string) {
    const startDate = new Date(startDateString);
    const endDate = new Date(endDateString);
    return startDate < endDate;
}
export function formatMessageTime(timestamp: Date | string): string {
    const currentDate = new Date();
    const messageDate = new Date(timestamp);
    console.log(currentDate, messageDate);
    const timeDifferenceInSeconds = Math.abs(Math.floor((currentDate.getTime() - messageDate.getTime()) / 1000));
    if (timeDifferenceInSeconds < 60) {
        return 'Now';
    }
    if (timeDifferenceInSeconds > 60 && timeDifferenceInSeconds < 3600) {
        const minutes = Math.floor(timeDifferenceInSeconds / 60);
        return `${minutes} minute${minutes > 1 ? 's' : ''} ago`;
    }
    if (timeDifferenceInSeconds < 86400 && timeDifferenceInSeconds > 3600) {
        const hours = Math.floor(timeDifferenceInSeconds / 3600);
        return `${hours} hour${hours > 1 ? 's' : ''} ago`;
    }
    if (timeDifferenceInSeconds > 86400) {
        // If the message was sent yesterday or earlier, format as dd/mm/yyyy hh:mm
        const options: Intl.DateTimeFormatOptions = {
            day: '2-digit',
            month: '2-digit',
            year: 'numeric',
            hour: '2-digit',
            minute: '2-digit',
        };
        return messageDate.toLocaleDateString('en-US', options).toString();
    }
    return 'Invalid';
}
