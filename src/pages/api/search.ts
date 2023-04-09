import type { NextApiRequest, NextApiResponse } from 'next';
import { prisma } from '~/server/db';

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  try {
    const query = String(req.query.q);
    const modules = await prisma.module.findMany({
      where: {
        name: { startsWith: query },
      },
      include: {
        Version: {
          select: { version: true },
          orderBy: { version: 'desc' },
          take: 1,
        },
      },
      take: 5,
    });

    const flattenedModules = modules.map(module => {
      const { name, Version } = module;
      const version = Version[0]?.version || '';
      return { name, version };
    });

    res.status(200).json(flattenedModules);
  } catch (error) {
    res.status(500).json({ message: 'Something went wrong' });
  }
}
