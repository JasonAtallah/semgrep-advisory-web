import { useDebouncedCallback } from 'use-debounce';
import { type ChangeEvent, useState } from 'react';
import Link from 'next/link';

interface Option {
  name: string;
  version: string;
}
type Options = Option[];

const ModuleSelect = ({
  options,
  isLoading,
  isError,
}: {
  options?: Options;
  isLoading: boolean;
  isError: boolean;
}) => {
  if (isLoading)
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <progress className="progress w-full"></progress>
        </div>
      </div>
    );

  if (isError)
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p>Search failed 🤯</p>
        </div>
      </div>
    );

  if (!options || !options.length)
    return (
      <div className="card bg-base-100 shadow-xl">
        <div className="card-body">
          <p>No results found 😞</p>
        </div>
      </div>
    );

  return (
    <div className="card bg-base-100 shadow-xl">
      <div className="card-body">
        {options?.map(option => (
          <Link href={`/${option.name}/${option.version}`} key={option.name}>
            <span className="text-3xl font-bold text-gray-800">
              {option.name}
            </span>
            <span>@{option.version}</span>
          </Link>
        ))}
      </div>
    </div>
  );
};

export const SearchBar = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [options, setOptions] = useState<Options | undefined>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isError, setIsError] = useState(false);

  const getOptions = async (value: string) => {
    try {
      setIsLoading(true);
      const res = await fetch(`/api/search?q=${value}`);
      const options = (await res.json()) as Options;
      return options;
    } catch (error) {
      setIsError(true);
      setIsLoading(false);
    } finally {
      setIsLoading(false);
    }
  };

  const debounced = useDebouncedCallback((value: string) => {
    getOptions(value)
      .then(options => setOptions(options))
      .catch(error => console.error(error));
  }, 10);

  const changeHandler = (e: ChangeEvent<HTMLInputElement>) => {
    const value = e.target.value.trim();
    if (!value) {
      setSearchTerm('');
      setOptions([]);
      return;
    }
    setIsLoading(true);
    setSearchTerm(value);
    debounced(value);
  };

  return (
    <div className="flex w-full max-w-lg flex-col gap-1">
      <div className="flex">
        <input
          type="text"
          placeholder="Find module"
          onChange={changeHandler}
          className="input-bordered input input-lg w-screen max-w-xl"
        />
      </div>
      {searchTerm && (
        <ModuleSelect
          options={options}
          isLoading={isLoading}
          isError={isError}
        />
      )}
    </div>
  );
};
