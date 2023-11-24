export function replaceSpacesWithDashes(str) {
  return str.replace(/ /g, '-');
}

export function replaceDashesWithSpaces(str) {
  return str.replace(/-/g, ' ');
}

export function replaceNewLinesWithBreaks(str) {
  return str.replace(/\n/g, '<br>');
}
