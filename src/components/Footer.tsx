import React from 'react';
import { ShieldCheck, ExternalLink } from 'lucide-react';
import { Language } from '../types';

interface FooterProps {
  lang: Language;
}

export const Footer: React.FC<FooterProps> = ({ lang }) => {
  return (
    <footer className="bg-sunny-navyDark text-slate-400 text-xs py-12 border-t border-slate-800">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 pb-10 border-b border-slate-800">
          
          {/* Brand Col */}
          <div className="md:col-span-2 space-y-3">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-lg bg-white/10 flex items-center justify-center text-sunny-gold">
                <ShieldCheck className="w-5 h-5" />
              </div>
              <span className="font-extrabold text-white text-base tracking-tight">
                KJRI <span className="text-sunny-gold">FRANKFURT</span>
              </span>
            </div>
            <p className="text-slate-400 text-xs leading-relaxed max-w-sm">
              {lang === 'en'
                ? 'Consulate General of the Republic of Indonesia in Frankfurt am Main. Serving Indonesian citizens across Hessen, Baden-Württemberg, Bayern, Nordrhein-Westfalen, Rheinland-Pfalz, and Saarland.'
                : 'Konsulat Jenderal Republik Indonesia di Frankfurt am Main. Melayani masyarakat Indonesia di wilayah kerja Hessen, Baden-Württemberg, Bayern, Nordrhein-Westfalen, Rheinland-Pfalz, dan Saarland.'}
            </p>
          </div>

          {/* Official References */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              {lang === 'en' ? 'Official Portals' : 'Portal Resmi'}
            </h4>
            <ul className="space-y-2">
              <li>
                <a
                  href="https://kemlu.go.id"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Kementerian Luar Negeri RI</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  // href="https://peduliwni.kemlu.go.id"
                  href="#"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Portal Peduli WNI</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
              <li>
                <a
                  href="https://www.imigrasi.go.id/wni/ganti-paspor"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="hover:text-white flex items-center gap-1.5 transition-colors"
                >
                  <span>Ditjen Imigrasi RI</span>
                  <ExternalLink className="w-3 h-3 text-slate-500" />
                </a>
              </li>
            </ul>
          </div>

          {/* Consular Chancery */}
          <div>
            <h4 className="font-bold text-white uppercase tracking-wider text-[11px] mb-3">
              {lang === 'en' ? 'Diplomatic Chancery' : 'Alamat Perwakilan'}
            </h4>
            <address className="not-italic text-slate-400 leading-relaxed text-xs">
              Zeppelinallee 23<br />
              60325 Frankfurt am Main<br />
              Germany / Jerman<br />
              <span className="text-sunny-gold font-mono block mt-1">+49 162 412 9044</span>
            </address>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-8 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px]">
          <div>
            © {new Date().getFullYear()} KJRI Frankfurt am Main. All rights reserved.
          </div>
          <div className="flex items-center gap-1 text-slate-500">
            <span>Designed for Indonesian Consular Services in Germany</span>
          </div>
        </div>

      </div>
    </footer>
  );
};
