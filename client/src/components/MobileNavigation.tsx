import { Link, useLocation } from "wouter";

export default function MobileNavigation() {
  const [location] = useLocation();

  return (
    <div className="md:hidden bg-white border-t border-slate-200 fixed bottom-0 left-0 right-0 z-10">
      <div className="flex justify-around">
        <Link href="/tickets">
          <button className={`py-3 flex flex-col items-center justify-center ${location === '/tickets' || location === '/' ? 'text-teal-700' : 'text-slate-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="22 12 18 12 15 21 9 3 6 12 2 12" />
            </svg>
            <span className="text-xs mt-1">Tickets</span>
          </button>
        </Link>
        
        <Link href="/dashboard">
          <button className={`py-3 flex flex-col items-center justify-center ${location === '/dashboard' ? 'text-teal-700' : 'text-slate-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <line x1="18" y1="20" x2="18" y2="10" />
              <line x1="12" y1="20" x2="12" y2="4" />
              <line x1="6" y1="20" x2="6" y2="14" />
            </svg>
            <span className="text-xs mt-1">Dashboard</span>
          </button>
        </Link>
        
        <Link href="/new-ticket">
          <button className="py-3 flex flex-col items-center justify-center text-slate-500">
            <div className="bg-teal-700 text-white p-2 rounded-full">
              <svg xmlns="http://www.w3.org/2000/svg" className="h-4 w-4" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <line x1="12" y1="5" x2="12" y2="19" />
                <line x1="5" y1="12" x2="19" y2="12" />
              </svg>
            </div>
            <span className="text-xs mt-1">New</span>
          </button>
        </Link>
        
        <Link href="/knowledge-base">
          <button className={`py-3 flex flex-col items-center justify-center ${location === '/knowledge-base' ? 'text-teal-700' : 'text-slate-500'}`}>
            <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M4 19.5A2.5 2.5 0 0 1 6.5 17H20" />
              <path d="M6.5 2H20v20H6.5A2.5 2.5 0 0 1 4 19.5v-15A2.5 2.5 0 0 1 6.5 2z" />
            </svg>
            <span className="text-xs mt-1">Knowledge</span>
          </button>
        </Link>
        
        <button className="py-3 flex flex-col items-center justify-center text-slate-500">
          <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
            <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2" />
            <circle cx="12" cy="7" r="4" />
          </svg>
          <span className="text-xs mt-1">Profile</span>
        </button>
      </div>
    </div>
  );
}
