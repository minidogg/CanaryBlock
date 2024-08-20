// TODO: Make a simplified RegExp engine for better performance (hopefully)

export function escapeRegex(string) {
    return string.replace(/[.*+?^${}()|[\]\\]/g, '\\$&'); // Escape all special characters
}
  