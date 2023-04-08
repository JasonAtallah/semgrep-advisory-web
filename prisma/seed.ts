import { PrismaClient } from '@prisma/client';

const prisma = new PrismaClient();

const getRandomInt = (low = 0, high = 5) => {
  return Math.floor(Math.random() * (high - low + 1)) + low;
};

async function createModuleAndVersions(name: string, versions: string[]) {
  const module_ = await prisma.module.create({
    data: {
      name,
    },
  });

  const versionRecords = versions.map(version => ({
    version,
    moduleId: module_.id,
    npmAuditCritical: getRandomInt(),
    npmAuditHigh: getRandomInt(),
    npmAuditModerate: getRandomInt(),
    npmAuditLow: getRandomInt(),
    semgrepHigh: getRandomInt(),
    semgrepMedium: getRandomInt(),
    semgrepLow: getRandomInt(),
  }));

  await prisma.version.createMany({ data: versionRecords });
  return module;
}

async function main() {
  await Promise.all([
    createModuleAndVersions('express', [
      '5.0.0-beta.1',
      '4.18.2',
      '4.18.1',
      '4.18.0',
      '4.17.3',
    ]),
    createModuleAndVersions('lodash', ['4.17.21', '4.17.20', '4.17.19']),
    createModuleAndVersions('next', ['13.3.1-canary.3', '13.3.0', '12.3.4']),
  ]);
}

main()
  .then(async () => {
    await prisma.$disconnect();
  })
  .catch(async e => {
    console.error(e);
    await prisma.$disconnect();
    process.exit(1);
  });
