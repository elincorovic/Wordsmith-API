import { slugify } from 'voca';

export function generateCategorySlug(title: string): string {
  const slug = slugify(title);
  return slug;
}
