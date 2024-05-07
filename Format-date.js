
function Format(luxon , created_at) {
    const date = luxon.fromJSDate(created_at);
  
    // Get the day, month, and year components
    const day = date.day;
    const month = date.toFormat('LLL'); // Format the month as a short name, e.g., "Oct"
    const year = date.year;
    
    let daySuffix = '';
    if (day === 1 || day === 21 || day === 31) {
      daySuffix = 'st';
    } else if (day === 2 || day === 22) {
      daySuffix = 'nd';
    } else if (day === 3 || day === 23) {
      daySuffix = 'rd';
    } else {
      daySuffix = 'th';
    }
  
    return `${month} ${day}${daySuffix}, ${year}`;
}
module.exports = Format;
