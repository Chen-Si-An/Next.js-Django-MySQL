import { ChangeEvent, FormEvent, FC } from 'react';
import { MagnifyingGlassIcon } from '@heroicons/react/24/outline';

interface SearchProps {
  placeholder: string;
  value: string;
  onChange: (event: ChangeEvent<HTMLInputElement>) => void;
  onSubmit: (event: FormEvent<HTMLFormElement>) => void;
}

const Search: FC<SearchProps> = ({ placeholder, value, onChange, onSubmit }) => {
  return (
    <form onSubmit={onSubmit} className="relative flex flex-1 flex-shrink-0">
      <label htmlFor="search" className="sr-only">
        Search
      </label>
      <input
        className="peer block w-full rounded-md border border-gray-200 py-[9px] pl-10 text-sm outline-2 placeholder:text-gray-500"
        placeholder={placeholder}
        value={value}
        onChange={onChange}
      />
      <button type="submit" className="absolute left-3 top-1/2 h-[18px] w-[18px] -translate-y-1/2">
        <MagnifyingGlassIcon className="text-gray-500 peer-focus:text-gray-900" />
      </button>
    </form>
  );
}

export default Search;