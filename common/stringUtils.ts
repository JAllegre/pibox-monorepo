/**
 * Flattens a string by removing accents and diacritics in order to make a case-insensitive comparison.
 * @param str - The input string.
 * @returns The flattened string.
 */
export function flatString(str?: string): string {
  if (!str) {
    return "";
  }
  return str
    .toLocaleLowerCase()
    .normalize("NFD")
    .replace(/\p{Diacritic}/gu, "");
}

/**
 * Checks if a string matches a search text.
 * @param searchText - The search text.
 * @param str - The string to be checked.
 * @returns A boolean indicating whether the string matches the search text.
 */
export function matchSearch(searchText: string, str: string): boolean {
  return !searchText || flatString(str).includes(flatString(searchText));
}
