const normalizeDate = (dateString) => {
    try {
      const date = new Date(dateString);
      if (!isNaN(date.getTime())) {
        return date.toISOString(); // Normalize to ISO 8601 format
      }
    } catch (error) {
      console.error(`Failed to parse date: ${dateString}`, error);
    }
    return null; // Return null if parsing fails
  };