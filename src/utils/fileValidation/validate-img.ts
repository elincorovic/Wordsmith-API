import { BadRequestException } from '@nestjs/common';

export function validateImg(img: Express.Multer.File): boolean {
  const MIME_TYPES = ['image/jpeg', 'image/jpg', 'image/png'];

  if (!img) throw new BadRequestException('No image file was uploaded');
  if (!MIME_TYPES.includes(img.mimetype))
    throw new BadRequestException('Image must be of type: jpeg, jpg or png');

  return true;
}
