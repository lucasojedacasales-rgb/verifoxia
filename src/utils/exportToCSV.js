/**
 * Exports an array of objects to a CSV file and triggers download.
 * @param {Array<Object>} rows - Array of flat objects
 * @param {string} filename - File name without extension
 */
export function exportToCSV(rows, filename) {
  if (!rows || !rows.length) return;

  const headers = Object.keys(rows[0]);
  const csvContent = [
    headers.join(","),
    ...rows.map((row) =>
      headers
        .map((h) => {
          const val = row[h] == null ? "" : String(row[h]);
          // Wrap in quotes if contains comma, quote, or newline
          return /[",\n]/.test(val) ? `"${val.replace(/"/g, '""')}"` : val;
        })
        .join(",")
    ),
  ].join("\n");

  const blob = new Blob(["\uFEFF" + csvContent], { type: "text/csv;charset=utf-8;" });
  const url = URL.createObjectURL(blob);
  const link = document.createElement("a");
  link.href = url;
  link.download = `${filename}.csv`;
  link.click();
  URL.revokeObjectURL(url);
}