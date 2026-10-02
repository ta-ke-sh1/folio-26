import type { InteractiveItem } from "./draggableWindow.modal";

export function EditorialFileModal({ item }: { item: InteractiveItem }) {
  if (!item.photo) return null;

  return (
    <section className={`editorial-file editorial-file--${item.id}`}>
      <div className="editorial-file__spread">
        <article className="editorial-file__poster">
          <svg
            className="editorial-file__clip"
            viewBox="0 0 44 58"
            aria-hidden="true"
          >
            <path
              d="M13 49V17a9 9 0 0 1 18 0v24a6 6 0 0 1-12 0V20a3 3 0 0 1 6 0v17"
              fill="none"
              stroke="currentColor"
              strokeLinecap="round"
              strokeLinejoin="round"
              strokeWidth="2.2"
            />
            <path
              d="M18 49V18a4 4 0 0 1 8 0v19"
              fill="none"
              stroke="rgba(255,255,255,.72)"
              strokeLinecap="round"
              strokeWidth="1"
            />
          </svg>
          <header className="editorial-file__eyebrow">
            <span>{item.category.replaceAll("_", " ")}</span>
            <span>PERSONAL ARCHIVE / 01</span>
          </header>

          <div className="editorial-file__poster-title">
            <span className="editorial-file__overline">{item.tag}</span>
            <h2>{item.content.title}</h2>
            <p>{item.content.subtitle}</p>
          </div>

          <div className="editorial-file__index" aria-label="Highlights">
            {item.content.highlights.map((highlight, index) => (
              <div className="editorial-file__index-row" key={highlight}>
                <span className="editorial-file__index-number">
                  {String(index + 1).padStart(2, "0")}
                </span>
                <span>{highlight}</span>
              </div>
            ))}
          </div>

          <footer className="editorial-file__poster-footer">
            <span>{item.photo.caption}</span>
            <span>FILE NO. {item.id === "pets" ? "09" : "03"}</span>
          </footer>
        </article>

        <div className="editorial-file__rings" aria-hidden="true">
          <span />
          <span />
          <span />
        </div>

        <figure className="editorial-file__photograph">
          <img src={item.photo.src} alt={item.photo.alt} />
          <figcaption className="editorial-file__note">
            <span className="editorial-file__note-kicker">A NOTE FROM THE ARCHIVE</span>
            <span className="editorial-file__note-rule" aria-hidden="true" />
            <p>{item.content.description}</p>
            <span className="editorial-file__note-signature">
              {item.id === "pets" ? "CAM / HOUSEHOLD DIRECTOR" : "MILESTONE / 2025"}
            </span>
          </figcaption>
          <span className="editorial-file__photo-count" aria-hidden="true">
            IMAGE {item.id === "pets" ? "09" : "03"} — 01
          </span>
        </figure>
      </div>
    </section>
  );
}
