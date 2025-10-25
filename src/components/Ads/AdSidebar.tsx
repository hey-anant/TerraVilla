import { ExternalLink } from 'lucide-react';

interface AdItem {
  id: string;
  title: string;
  image: string;
  link: string;
  description: string;
}

const adItems: AdItem[] = [
  {
    id: '1',
    title: 'Premium Cement',
    image: 'https://images.pexels.com/photos/585419/pexels-photo-585419.jpeg?auto=compress&cs=tinysrgb&w=400',
    link: '#',
    description: 'High-quality cement for construction'
  },
  {
    id: '2',
    title: 'Steel & Iron',
    image: 'https://images.pexels.com/photos/257736/pexels-photo-257736.jpeg?auto=compress&cs=tinysrgb&w=400',
    link: '#',
    description: 'TMT bars and structural steel'
  },
  {
    id: '3',
    title: 'Bricks Supply',
    image: 'https://images.pexels.com/photos/1216589/pexels-photo-1216589.jpeg?auto=compress&cs=tinysrgb&w=400',
    link: '#',
    description: 'Quality bricks at best prices'
  },
  {
    id: '4',
    title: 'River Sand',
    image: 'https://images.pexels.com/photos/533360/pexels-photo-533360.jpeg?auto=compress&cs=tinysrgb&w=400',
    link: '#',
    description: 'Washed river sand for construction'
  },
  {
    id: '5',
    title: 'Real Estate Loans',
    image: 'https://images.pexels.com/photos/48148/document-agreement-documents-sign-48148.jpeg?auto=compress&cs=tinysrgb&w=400',
    link: '#',
    description: 'Low interest home loans'
  },
];

export default function AdSidebar() {
  return (
    <div className="w-full h-full bg-white border-l border-slate-200 overflow-y-auto">
      <div className="sticky top-0 bg-slate-50 border-b border-slate-200 px-3 py-3">
        <h3 className="text-xs font-semibold text-slate-700 uppercase tracking-wide">
          Construction Materials
        </h3>
      </div>

      <div className="space-y-3 p-3">
        {adItems.map((ad) => (
          <a
            key={ad.id}
            href={ad.link}
            className="block bg-slate-50 rounded-lg overflow-hidden hover:shadow-md transition-all border border-slate-200 hover:border-emerald-300"
          >
            <div className="relative aspect-video">
              <img
                src={ad.image}
                alt={ad.title}
                className="w-full h-full object-cover"
              />
              <div className="absolute top-1 right-1 bg-white/90 px-1.5 py-0.5 rounded text-[10px] font-semibold text-emerald-600">
                Ad
              </div>
            </div>
            <div className="p-2">
              <div className="flex items-start justify-between gap-1">
                <div className="flex-1 min-w-0">
                  <h4 className="text-xs font-semibold text-slate-900 mb-0.5 truncate">
                    {ad.title}
                  </h4>
                  <p className="text-[10px] text-slate-600 line-clamp-2">
                    {ad.description}
                  </p>
                </div>
                <ExternalLink className="w-3 h-3 text-slate-400 flex-shrink-0 mt-0.5" />
              </div>
            </div>
          </a>
        ))}
      </div>

      <div className="border-t border-slate-200 p-3">
        <p className="text-[10px] text-slate-500 text-center">
          Advertise with us
        </p>
      </div>
    </div>
  );
}
