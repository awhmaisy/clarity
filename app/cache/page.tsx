import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { pageMetadata } from "@/lib/metadata";

export const metadata: Metadata = pageMetadata(
  "Cache",
  "Stored lists, notes, and references.",
);

const typefaces = [
  {
    label: "Berkeley Mono",
    href: "https://berkeleygraphics.com/typefaces/berkeley-mono/",
  },
  {
    label: "Copernicus",
    href: "https://www.laborandwait.xyz/fonts/copernicus",
  },
  {
    label: "Cosmica Mono",
    href: "https://www.laborandwait.xyz/fonts/cosmica-mono",
  },
  {
    label: "GT Sectra",
    href: "https://www.grillitype.com/typeface/gt-sectra",
  },
  {
    label: "Söhne",
    href: "https://klim.co.nz/retail-fonts/soehne/",
  },
  {
    label: "IBM Plex",
    href: "https://www.ibm.com/plex/",
  }
];

const music = [
  "Dire Straits, Petshop Boys, Depeche Mode, Duran Duran, Fleetwood Mac",
  "Robert Miles, Enya, Télépopmusik, Imogen Heap, Aphex Twin",
  "Princess Chelsea, Chromatics, After, Pearly Drops, Oklou, Men I Trust",
  "i_o, Rezz, Rootkit, MUZZ, Subtronics, [IVY], Kanine, Anyma",
  "DJ_Dave, Ninajirachi, Snow Strippers, TDJ, Switch Angel",
  "Scrim and SSB, Night Lovell, BONES, City Morgue, ZillaKami",
];

const joyActivities = [
  "Horseback riding",
  "Podcasts/audiobooks (I'm notoriously aversive to anything but paperback)",
  "Enjoying a roll of film with dearest Contax T3",
  "Reading without a time limit",
  "Cut fruit and a long bath",
  "Developing my meditation routine",
];

export default function CachePage() {
  return (
    <div className="page">
      <SiteHeader active="/cache" />

      <main className="home-copy">
        <section className="home-section">
          <h2 className="section-label">Favorite typefaces</h2>
          <ul className="prose social-list">
            {typefaces.map(({ label, href }) => (
              <li key={label}>
                <a
                  href={href}
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  {label}
                </a>
              </li>
            ))}
          </ul>
        </section>

        <section className="home-section">
          <h2 className="section-label">Music sometimes</h2>
          <ul className="prose social-list">
            {music.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>

        <section className="home-section">
          <h2 className="section-label">High-joy-ROI activities</h2>
          <ul className="prose social-list">
            {joyActivities.map((item) => (
              <li key={item}>{item}</li>
            ))}
          </ul>
        </section>
      </main>
    </div>
  );
}
