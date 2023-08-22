export function parseJiraIdFromString(inputString: string) {
  const regex = /\[(.*?)\]/; // Regular expression to match text within square brackets
  const match = regex.exec(inputString);

  if (match && match[1]) {
    return match[1]; // Extracted Jira ID
  }

  return null;
}
