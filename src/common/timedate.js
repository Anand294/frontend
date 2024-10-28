// Helper function to format ISO date strings
const formatDate = (isoDate) => {
    const date = new Date(isoDate);
    return new Intl.DateTimeFormat('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric'
    }).format(date);
};

// Helper function to get the start and end of the current week
const getWeekRange = () => {
    const today = new Date();
    const dayOfWeek = today.getDay();
    const startOfWeek = new Date(today);
    const endOfWeek = new Date(today);

    // Calculate Monday (start of the week)
    startOfWeek.setDate(today.getDate() - (dayOfWeek - 1));
    startOfWeek.setHours(0, 0, 0, 0);

    // Calculate Sunday (end of the week)
    endOfWeek.setDate(today.getDate() + (7 - dayOfWeek));
    endOfWeek.setHours(23, 59, 59, 999);

    return {
        start: startOfWeek,
        end: endOfWeek
    };
};

// Helper function to check if current date is within the week range
const isCurrentWeek = (weekStartTime, weekEndTime) => {
    const today = new Date();
    const start = new Date(weekStartTime);
    const end = new Date(weekEndTime);
    return today >= start && today <= end;
};
const formatDateRange = (weekstarttime, weekendtime) => {
    let startDate = new Date(weekstarttime);
    const endDate = new Date(weekendtime);

    // If start date is Sunday (day 0), shift to Monday
    if (startDate.getDay() === 0) {
        startDate.setDate(startDate.getDate() + 1); // Move to the next day (Monday)
    }

    const startMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(startDate);
    const endMonth = new Intl.DateTimeFormat('en-US', { month: 'short' }).format(endDate);
    const startDay = startDate.getDate();
    const endDay = endDate.getDate();
    const startYear = startDate.getFullYear();
    const endYear = endDate.getFullYear();

    let formattedDate;

    if (startYear === endYear) {
        // Same year
        if (startMonth === endMonth) {
            // Same month
            formattedDate = `${startMonth} ${startDay} - ${endDay} ${startYear}`;
        } else {
            // Different months in the same year
            formattedDate = `${startMonth} ${startDay} - ${endMonth} ${endDay} ${startYear}`;
        }
    } else {
        // Different years
        formattedDate = `${startMonth} ${startDay} ${startYear} - ${endMonth} ${endDay} ${endYear}`;
    }

    return formattedDate;
};
const getNextMonday = (date) => {
    const day = date.getDay();
    const diff = (day === 0 ? 1 : 8 - day); // If Sunday, next Monday is the next day, otherwise calculate diff
    const nextMonday = new Date(date);
    nextMonday.setDate(date.getDate() + diff);
    return nextMonday;
};

// Function to get the week range (Monday to Sunday) from start date till now
const getWeeklyRanges = () => {
    const startDate=new Date('2023-01-01');
    const weekRanges = [];
    let currentStartDate = getNextMonday(startDate);  // Get first Monday after or on Jan 1, 2023
    const now = new Date(); // Current date

    while (currentStartDate <= now) {
        const currentEndDate = new Date(currentStartDate);
        currentEndDate.setDate(currentStartDate.getDate() + 6); // Sunday of the same week

        weekRanges.push(formatDateRange(currentStartDate, currentEndDate));

        // Move to the next week
        currentStartDate.setDate(currentStartDate.getDate() + 7);
    }

    return weekRanges;
};
export {
    formatDate,
    isCurrentWeek,
    getWeekRange,
    formatDateRange,
    getWeeklyRanges
}