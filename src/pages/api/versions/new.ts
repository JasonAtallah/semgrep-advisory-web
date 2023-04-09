import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '~/server/db';

const bodySchema = z.object({
  version: z.string(),
  moduleId: z.string().cuid2(),
  npmAuditCritical: z.number().int().nonnegative(),
  npmAuditHigh: z.number().int().nonnegative(),
  npmAuditModerate: z.number().int().nonnegative(),
  npmAuditLow: z.number().int().nonnegative(),
  semgrepHigh: z.number().int().nonnegative(),
  semgrepMedium: z.number().int().nonnegative(),
  semgrepLow: z.number().int().nonnegative(),
});

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    res.status(405).send({ message: 'Only POST requests allowed' });
    return;
  }

  try {
    const data = bodySchema.parse(req.body);
    const newVersion = await prisma.version.create({ data });
    res.status(200).json(newVersion);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }

    return res.status(500).json({ message: 'Something went wrong' });
  }
}
