/**
 * Converts an array of objects to a CSV-formatted string.
 * @param data The array of objects to convert.
 * @returns The CSV-formatted string.
 */
export const exportToCsv = <T extends object>(data: T[], filename: string) => {
  const csvContent = 'data:text/csv;charset=utf-8,' + convertArrayToCsv(data);
  const encodedUri = encodeURI(csvContent);
  const link = document.createElement('a');
  link.setAttribute('href', encodedUri);
  link.setAttribute('download', filename);
  document.body.appendChild(link);
  link.click();
};

/**
 * Exports an array of objects to a CSV file for download.
 * @param data The array of objects to export.
 * @param filename The desired filename for the exported CSV file.
 */
function convertArrayToCsv<T extends object>(data: T[]) {
  const header = Object.keys(data[0]).join(',');
  const rows = data.map((obj) => Object.values(obj).join(','));
  return [header, ...rows].join('\n');
}

export function truncateEthereumAddress(address: string) {
  // Captures 0x + 4 characters, then the last 4 characters.
  if (!address) return;

  const truncateRegex = /^(0x[a-zA-Z0-9]{4})[a-zA-Z0-9]+([a-zA-Z0-9]{4})$/;

  const match = address.match(truncateRegex);
  if (!match) return address;
  return `${match[1]}…${match[2]}`;
}

export function truncateHOPRPeerId(peerId: string) {
  if (!peerId) return;

  // Check if the peerId starts with "16Uiu2" and has a total length of 53 characters.
  if (!peerId.startsWith('16Uiu2') || peerId.length !== 53) return peerId;

  // Get the last 8 characters of the peerId.
  const last8Characters = peerId.slice(-8);

  return `16Uiu2…${last8Characters}`;
}
