import Image from 'next/image';
import { SearchBar } from '~/components/search-bar';

export default function Home() {
  return (
    <div className="mt-16 flex flex-col items-center justify-center gap-8">
      <div className="flex flex-col items-center gap-1">
        <Image
          width={128}
          height={128}
          src="/logo.png"
          className="animate-pulse"
          alt="logo"
        />
        <h1 className="text-3xl text-gray-700 opacity-80">Semgrep Advisory</h1>
        <h1 className="text-lg text-gray-500 opacity-80">
          Discover how secure the modules your are using really are
        </h1>
      </div>

      <SearchBar />
    </div>
  );
}
