// Generate a slug/ID from a wrestler name
export const generateWrestlerId = (name) => {
  if (!name) return '';

  return name
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, '') // Remove special characters except spaces and hyphens
    .trim()
    .replace(/\s+/g, '_') // Replace spaces with underscores
    .replace(/-+/g, '_') // Replace hyphens with underscores
    .replace(/_+/g, '_'); // Replace multiple underscores with single
};
