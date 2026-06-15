import Link from "next/link";
import { HomePhotoToggle } from "@/components/home-photo-toggle";
import { SiteHeader } from "@/components/site-header";
import { site } from "@/lib/site";

export default function Home() {
  return (
    <div className="page page--home">
      <SiteHeader active="/" />

      <main className="home">
        <div className="home-copy">
          <div className="home-body prose">
            <p>
              Grand rising! I&rsquo;m a narrative architect and persona designer. I develop <br /> the stories and marketing behind consumer brands and technology companies, and have worked in social media for the past 11 years.
            </p>
            <p>
              I dropped out of 3rd grade to homeschool
              in El Segundo at{" "}
              <a
                href="https://www.davincischools.org/impact/transforming-education/"
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Da Vinci <br /> Innovation Academy
              </a>
              , where I researched nanotechnology and <br />oncology at{" "}
              <a
                href="https://stemcell.ucla.edu/"
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                UCLA BSC
              </a>{" "}
              and product/graphic design at{" "}
              <a
                href="https://www.artcenter.edu/"
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                ArtCenter
              </a>
              .<br /> I also briefly attended USC&rsquo;s{" "}
              <a
                href="https://iovine-young.usc.edu/"
                className="link"
                target="_blank"
                rel="noopener noreferrer"
              >
                Iovine and Young Academy
              </a>
              .
            </p>
            <p>
              I conduct periodic media experiments, many of which are niche
              interests or games of comprehension. Out of 10+ personal trials, my favorite accounts surrounded metaphysics,
              quantum mechanics + cosmology, and finance.
            </p>
            <p>
              I&rsquo;m historically an INTJ-T or INFJ-T, 8w7, and a life path 5.
            </p>
          </div>

          <section className="home-section">
            <h2 className="section-label">Other Realms</h2>
            <ul className="prose social-list">
              <li>
                <a href={`mailto:${site.email}`} className="link">
                  General-purpose email
                </a>
                {" / "}
                <a
                  href="https://www.linkedin.com/in/awhmaisy/"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  LinkedIn
                </a>
              </li>
              <li>
                <a
                  href="https://x.com/mtheory"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  X Dot Com
                </a>
              </li>
              <li>
                <a
                  href="https://meihigashi.com"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Substack
                </a>
              </li>
              <li>
                <a
                  href="https://instagram.com/0xmaisy"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Finance-gram
                </a>
                {" / "}
                <a
                  href="https://instagram.com/uploading"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Mei-gram
                </a>
              </li>
              <li>
                <a
                  href="https://pinterest.com/awhmaisy"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Pinterest
                </a>
                {" / "}
                <a
                  href="https://www.cosmos.so/maisy"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Cosmos
                </a>
                {" / "}
                <a
                  href="https://www.are.na/mei-higashi"
                  className="link"
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  Are.na
                </a>
              </li>
            </ul>
          </section>
        </div>
      </main>

      <HomePhotoToggle />

      <footer className="page-footer text-muted">
        <p className="max-w-sm">
          Web typeface set in{" "}
          <a
            href="https://www.laborandwait.xyz/fonts/copernicus"
            className="link"
          >
            Copernicus
          </a>{" "}
          by Chester Jenkins &amp; Kris Sowersby and{" "}
          <a
            href="https://www.laborandwait.xyz/fonts/cosmica-mono"
            className="link"
          >
            Cosmica Mono
          </a>{" "}
          by Chester &amp; Tracy Jenkins, by{" "}
          <a href="https://www.laborandwait.xyz/" className="link">
            Labor and Wait
          </a>
          .
        </p>
      </footer>
    </div>
  );
}
