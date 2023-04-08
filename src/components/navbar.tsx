import Image from 'next/image';
import Link from 'next/link';

export const Navbar = () => {
  return (
    <div className="navbar flex justify-between bg-base-100 px-12">
      <Link href="/" className="flex gap-3">
        <Image width={48} height={48} src="/logo.png" alt="logo" />
        <span className="text-xl">Semgrep Advisory</span>
      </Link>
    </div>
  );
};
