import { slugify } from 'voca';

export function generateBookSlug(title: string): string {
  const max: number = 999_999;
  const min: number = 100_000;
  const slug = slugify(
    Math.round(Math.random() * (max - min + 1)) + min + title,
  );
  return slug;
}
