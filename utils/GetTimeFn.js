export const getDateRange = (time) => {
  const now = new Date();
  let startDate;
  switch (time) {
    case "subWeek":
      startDate = new Date();
      startDate.setDate(now.getDate() - 7);
      break;
    case "subMonth":
      startDate = new Date();
      startDate.setMonth(now.getMonth() - 1);
      break;
    case "subYear":
      startDate = new Date();
      startDate.setFullYear(now.getFullYear() - 1);
      break;
    default:
      throw new Error("Invalid time range");
  }
  return { startDate, endDate: now };
};