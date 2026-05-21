type DatePattern = "dd MMM, yyyy" | "dd MMMM yyyy";

const dateFormat = (
  date: Date | string,
  pattern: DatePattern = "dd MMM, yyyy",
  locale: string = "en-US",
): string => {
  const dateObj = new Date(date);

  if (isNaN(dateObj.getTime())) {
    throw new Error("Invalid date provided");
  }

  const day = new Intl.DateTimeFormat(locale, {
    day: "2-digit",
  }).format(dateObj);

  const monthShort = new Intl.DateTimeFormat(locale, {
    month: "short",
  }).format(dateObj);

  const monthLong = new Intl.DateTimeFormat(locale, {
    month: "long",
  }).format(dateObj);

  const year = new Intl.DateTimeFormat(locale, {
    year: "numeric",
  }).format(dateObj);

  if (pattern === "dd MMM, yyyy") {
    return `${day} ${monthShort}, ${year}`;
  }

  if (pattern === "dd MMMM yyyy") {
    return `${day} ${monthLong} ${year}`;
  }

  throw new Error(`Unsupported pattern: ${pattern}`);
};

export default dateFormat;
