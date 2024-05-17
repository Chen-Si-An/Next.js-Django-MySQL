import { GlobeAltIcon } from '@heroicons/react/24/outline';
import { lusitana } from '@/app/ui/fonts';

export default function AcmeLogo() {
  return (
    <div className={`${lusitana.className} flex flex-row items-center leading-none text-white`}>
      <div className="flex h-20 shrink-0 items-end rounded-lg p-4 md:h-52">
        <p className="text-[44px]">Accom <br />Seek</p>
      </div>
    </div>
  );
}
