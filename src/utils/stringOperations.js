export function replaceSpacesWithDashes(str) {
  return str.replace(/ /g, '-');
}

export function replaceDashesWithSpaces(str) {
  return str.replace(/-/g, ' ');
}

export function replaceNewLinesWithBreaks(str) {
  return str.replace(/\n/g, '<br>');
}

export function generateUUID() {
  return ([1e7] + -1e3 + -4e3 + -8e3 + -1e11).replace(/[018]/g, (c) =>
    (c ^ (crypto.getRandomValues(new Uint8Array(1))[0] & (15 >> (c / 4)))).toString(16)
  );
}

export function formatName(name) {
  return name.charAt(0).toUpperCase() + name.slice(1).toLowerCase();
}
