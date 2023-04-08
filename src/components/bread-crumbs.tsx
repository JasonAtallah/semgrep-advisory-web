import { CubeIcon } from './icons/cube';
import { ShieldExclamationIcon } from './icons/shield-exclamation';
import { ShieldCheckIcon } from './icons/shield-check';
import { HomeIcon } from './icons/home';
import { useRouter } from 'next/router';
import { useContext } from 'react';
import { AppContext } from '~/pages/_app';
import Link from 'next/link';

export const BreadCrumbs = () => {
  const router = useRouter();
  const { moduleName, version } = router.query;
  const { hasVulnerabilites } = useContext(AppContext);

  return (
    <div className="breadcrumbs text-sm">
      <ul>
        <li>
          <Link href="/">
            <HomeIcon />
          </Link>
        </li>
        {moduleName && (
          <li>
            <Link href={`/${String(moduleName)}`}>
              <CubeIcon />
              {moduleName}
            </Link>
          </li>
        )}
        {version && (
          <li>
            {hasVulnerabilites ? (
              <ShieldExclamationIcon />
            ) : (
              <ShieldCheckIcon />
            )}
            <span>{version}</span>
          </li>
        )}
      </ul>
    </div>
  );
};
