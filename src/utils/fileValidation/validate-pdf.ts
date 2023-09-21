import { BadRequestException } from '@nestjs/common';

export function validatePdf(pdf: Express.Multer.File): boolean {
  if (!pdf) throw new BadRequestException('No pdf file was uploaded');
  if (pdf.mimetype != 'application/pdf')
    throw new BadRequestException('Pdf upload must be of type pdf');

  return true;
}
