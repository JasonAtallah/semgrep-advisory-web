import type { NextApiRequest, NextApiResponse } from 'next';
import { z } from 'zod';
import { prisma } from '~/server/db';

const bodySchema = z.object({
  version: z.string(),
  moduleName: z.string(),
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
    const { moduleName, ...data } = bodySchema.parse(req.body);

    const existingModule = await prisma.module.findUnique({
      where: { name: moduleName },
    });

    let module_;
    if (existingModule) {
      module_ = existingModule;
    } else {
      module_ = await prisma.module.create({ data: { name: moduleName } });
    }

    const newVersion = await prisma.version.create({
      data: { ...data, moduleId: module_.id },
    });

    res.status(200).json(newVersion);
  } catch (error) {
    if (error instanceof z.ZodError) {
      return res.status(400).json({ error: error.issues });
    }

    return res.status(500).json({ message: 'Something went wrong' });
  }
}
