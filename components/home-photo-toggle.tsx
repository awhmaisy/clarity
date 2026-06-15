"use client";

import { useState } from "react";
import { cosmicaMono } from "@/lib/fonts";
import { site } from "@/lib/site";

export function HomePhotoToggle() {
  const [visible, setVisible] = useState(true);

  return (
    <div className="home-photo-block">
      <div className="home-photo-block__header">
        <button
          type="button"
          onClick={() => setVisible((current) => !current)}
          className="home-photo-toggle"
          aria-expanded={visible}
        >
          {visible ? "[close img]" : "[open img]"}
        </button>
      </div>
      {visible ? (
        <figure className="home-photo-frame">
          <img
            src="/images/sayu-mei.JPG"
            alt="An empress with her wolf familiar and a crow under a full moon"
            className="home-photo"
          />
          <figcaption className={`home-photo-caption ${cosmicaMono.className}`}>
            artwork commissioned by{" "}
            <a
              href={site.sayu}
              className="link home-photo-caption-link"
              target="_blank"
              rel="noopener noreferrer"
            >
              sayu
            </a>
            , picturing a
            <br />
            warrior-maiden and her wolf on the full moon
          </figcaption>
        </figure>
      ) : null}
    </div>
  );
}
