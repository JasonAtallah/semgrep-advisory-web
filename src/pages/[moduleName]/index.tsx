import { type GetStaticPropsContext } from 'next';
import Link from 'next/link';
import { DownIcon } from '~/components/icons/down';
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

  return { paths, fallback: false };
}

export default function Module({ module_ }: { module_: ModuleWithVersions }) {
  if (!module_) return <></>;

  return (
    <div className="flex flex-col gap-4">
      <div className="flex items-end">
        <h1 className="text-6xl">{module_.name}</h1>
        <div className="dropdown">
          <label tabIndex={0} className="btn-ghost btn flex gap-1 text-primary">
            <h3 className="text-3xl">Version</h3>
            <DownIcon />
          </label>
          <ul
            tabIndex={0}
            className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
          >
            {module_.Version.map(i => {
              return (
                <li key={i.id}>
                  <Link href={`/${module_.name}/${i.version}`}>
                    {i.version}
                  </Link>
                </li>
              );
            })}
          </ul>
        </div>
      </div>
    </div>
  );
}
