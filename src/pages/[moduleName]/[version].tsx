import type { Version } from '@prisma/client';
import { type GetStaticPropsContext } from 'next';
import Link from 'next/link';
import { useEffect, useMemo } from 'react';
import { DownIcon } from '~/components/icons/down';
import { env } from '~/env.mjs';
import { prisma } from '~/server/db';
import type {
  ModuleWithVersionAndCurVersion,
  ModuleWithCurVersion,
  NpmAuditLevel,
  SemgrepLevel,
} from '~/types';

const hasAnyVulnerabilities = (versionInfo: Version) => {
  // easier to destructure metadata than all the vulnerability fields
  // eslint-disable-next-line @typescript-eslint/no-unused-vars
  const { id, moduleId, version, ...vulnerabilities } = versionInfo;
  return Object.values(vulnerabilities).some(v => v && v > 0);
};

export async function getStaticProps({ params }: GetStaticPropsContext) {
  const moduleName = params?.moduleName as string;
  const version = params?.version as string;

  const module_ = await prisma.module.findFirst({
    where: { name: moduleName },
    include: {
      Version: { orderBy: { version: 'desc' } },
    },
  });

  const curVersion = module_?.Version.find(i => i.version === version);

  return {
    props: {
      module_: { ...module_, curVersion },
    },
    revalidate: Number(env.PAGE_REGENERATION_INTERVAL),
  };
}

export async function getStaticPaths() {
  const modules = await prisma.module.findMany({
    include: {
      Version: true,
    },
  });

  const paths = modules
    .map(module_ => {
      const versions = module_.Version.map(version => version.version);
      return versions.map(version => ({
        params: { moduleName: module_.name, version },
      }));
    })
    .flat();

  return { paths, fallback: false };
}

const ModuleHeader = ({
  module_,
}: {
  module_: ModuleWithVersionAndCurVersion;
}) => {
  if (!module_) return <></>;

  return (
    <div className="flex items-end">
      <Link href={`/${module_.name}`}>
        <h1 className="text-6xl">{module_.name}</h1>
      </Link>
      <div className="dropdown">
        <label tabIndex={0} className="btn-ghost btn flex gap-1 text-primary">
          <h3 className="text-3xl">@{module_?.curVersion?.version}</h3>
          <DownIcon />
        </label>
        <ul
          tabIndex={0}
          className="dropdown-content menu rounded-box w-52 bg-base-100 p-2 shadow"
        >
          {module_.Version.filter(i => i.id !== module_.curVersion.id).map(
            i => {
              return (
                <li key={i.id}>
                  <Link href={`/${module_.name}/${i.version}`}>
                    {i.version}
                  </Link>
                </li>
              );
            }
          )}
        </ul>
      </div>
    </div>
  );
};

interface Result {
  key: NpmAuditLevel | SemgrepLevel;
  cur: number;
  prev: number;
}

type Results = Result[];

const ResultsCard = ({ results }: { results: Results }) => {
  return (
    <div className="stats stats-vertical shadow lg:stats-horizontal">
      {results.map(({ key, cur, prev }) => {
        const isUp = cur > prev;
        const isDown = cur < prev;
        const change = isUp
          ? `Up ${cur - prev}`
          : isDown
          ? `Down ${prev - cur}`
          : 'No change';

        return (
          <div key={key} className="stat">
            <div className="stat-title">{key}</div>
            <div className="stat-value">{cur}</div>
            <span
              className={`text-xs ${isUp ? 'text-red-500' : ''} ${
                isDown ? 'text-green-500' : ''
              }`}
            >
              {change}
            </span>
          </div>
        );
      })}
    </div>
  );
};

const ResultsCards = ({
  module_,
}: {
  module_: ModuleWithVersionAndCurVersion;
}) => {
  const curVersion = useMemo(() => module_.curVersion, [module_]);
  const prevVersion = useMemo(() => {
    const curIdx = module_.Version.findIndex(i => i.id === curVersion.id);
    return module_.Version[curIdx + 1];
  }, [curVersion, module_]);

  const generateResults = (
    keys: NpmAuditLevel[] | SemgrepLevel[],
    curVersion: Version,
    prevVersion: Version | undefined
  ): Results =>
    keys.map(key => {
      const auditKey = `npmAudit${key}` as keyof Version;

      const cur = (curVersion[auditKey] as number) || 0;
      const prev = (prevVersion?.[auditKey] as number) || 0;

      return { key, cur, prev };
    });

  const npmAuditResults = useMemo(() => {
    const keys: NpmAuditLevel[] = ['Low', 'Moderate', 'High', 'Critical'];
    const results = generateResults(keys, curVersion, prevVersion);
    return results;
  }, [curVersion, prevVersion]);

  const semgrepResults = useMemo(() => {
    const keys: SemgrepLevel[] = ['Low', 'Medium', 'High'];
    const results = generateResults(keys, curVersion, prevVersion);
    return results;
  }, [curVersion, prevVersion]);

  if (!module_.curVersion) return <></>;

  return (
    <div className="flex flex-row flex-wrap gap-4 lg:flex-col">
      <div>
        <h3 className="ml-2 text-xl font-bold text-npm-red">NPM Audit</h3>
        <ResultsCard results={npmAuditResults} />
      </div>
      <div>
        <h3 className="ml-2 text-xl text-semgrep-green">Semgrep</h3>
        <ResultsCard results={semgrepResults} />
      </div>
    </div>
  );
};

interface Props {
  module_: ModuleWithVersionAndCurVersion;
}

export default function ModuleVersion({ module_ }: Props) {
  useEffect(() => {
    const curVersion = module_?.curVersion;
    if (!curVersion) return;
    const hasVulnerabilites = hasAnyVulnerabilities(curVersion);
    // TODO: Update the context with the vulnerability status
  }, [module_]);

  return (
    <div className="flex flex-col gap-12">
      <ModuleHeader module_={module_} />
      <ResultsCards module_={module_} />
    </div>
  );
}
