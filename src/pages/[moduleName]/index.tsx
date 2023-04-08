import { type GetStaticPropsContext } from 'next';
import { env } from '~/env.mjs';
import { prisma } from '~/server/db';
import type { ModuleWithVersions } from '~/types';

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const moduleName = params?.moduleName as string;

  const module_ = await prisma.module.findFirst({
    where: { name: moduleName },
    include: { Version: true },
  });

  return {
    props: {
      module_,
    },
    revalidate: Number(env.PAGE_REGENERATION_INTERVAL),
  };
}

export async function getStaticPaths() {
  const modules = await prisma.module.findMany();

  const paths = modules.map(module_ => {
    return { params: { moduleName: module_.name } };
  });

  console.log('paths', paths);
  return { paths, fallback: false };
}

export default function Module({ module_ }: { module_: ModuleWithVersions }) {
  if (!module_) return <></>;

  return (
    <div className="flex flex-col gap-4">
      <h1 className="text-6xl">{module_.name}</h1>
    </div>
  );
}
