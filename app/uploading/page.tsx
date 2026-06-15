import type { Metadata } from "next";
import { SiteHeader } from "@/components/site-header";
import { cosmicaMono } from "@/lib/fonts";
import { getUploadingMeta } from "@/lib/uploading";

export const metadata: Metadata = {
  title: "@uploading",
  description:
    "A hobbyist exhibit hall for personal interests: quantum science, cosmology, and whatever else at whim.",
};

const challenges = [
  "Keeping videos under 2 minutes",
  "Designing a filming set + editing style that retains simplicity and focuses on the quality of information presented",
  "Retaining enunciation without veering towards my VA ways",
  "Finding the most accurate, first-or-close sources",
];

export default function UploadingPage() {
  const { accountUrl } = getUploadingMeta();

  return (
    <div className="page">
      <SiteHeader active="/uploading" />

      <main className="home-copy">
        <h1 className="page-title text-ink">@uploading</h1>
        <p className="page-lead">
          <a href={accountUrl} className="link">
            {accountUrl.replace(/^https?:\/\//, "")}
          </a>
        </p>

        <figure className="home-photo-frame home-photo-frame--uploading">
          <img
            src="/images/bekenstein.png"
            alt="Sphere illustrating the Bekenstein bound, one bit of information per Planck area"
            className="home-photo"
          />
          <figcaption
            className={`home-photo-caption home-photo-caption--uploading ${cosmicaMono.className}`}
          >
            excavating the resonant information that shapes our
            <br />
            reality. bekenstein, &rsquo;t hooft &amp; susskind.
          </figcaption>
        </figure>

        <div className="prose">
          <p>
          Quantum & space remain my favorite experiments, so I&rsquo;m setting aside more time for leisurely
            pursuits with a high ROI. (Measured in joy, of course)
          </p>
          <p>
            This exhibit hall will be conducted in a hobbyist manner and will fluctuate topics
            at-whim. Uploading is the first account that focuses exclusively on
            my personal interests, without planning or end-to-end orchestration.
          </p>
          <p>
            I expect a few practical challenges, and I&rsquo;m excited to work through them:
          </p>
          <ul className="prose social-list">
            {challenges.map((challenge) => (
              <li key={challenge}>{challenge}</li>
            ))}
          </ul>
        </div>

        <section className="home-section home-section--divider">
          <p className="home-section__lede">
            Information structures that shape how we interpret reality fascinate me. The through-line is comprehension, with open and provoked thought.
          </p>
          <h2 className="section-label">Currently investigating</h2>
          <ol className="prose prose-list prose-list--numbered">
            <li>
              What it takes to build an empire or micronation within existing
              city and town structures
            </li>
            <li>
              How to incentivize technological adoption in suburban communities
            </li>
            <li>
              Where fiduciary media can improve, and which standards to uphold
            </li>
          </ol>
        </section>

        <section className="home-section">
          <h2 className="section-label">Next ten years</h2>
          <ol className="prose prose-list prose-list--numbered">
            <li>Strengthen incentives to build in and for America</li>
            <li>
              Help humans discover their ideal OS, highly correlated with
              dreams, conscious awareness, and subconscious programming
            </li>
            <li>Reform and refine formative education, especially K-12</li>
            <li>
              Advance corporeal programming research through dreams,
              consciousness, and NLP/NLP-II/BCI
            </li>
          </ol>
        </section>
      </main>
    </div>
  );
}
