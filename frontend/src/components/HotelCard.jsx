
function HotelCard({ hotel, index, onSelect }) {
  return (
    <article
      className={`stay-card ${index === 0 ? "featured-stay" : ""}`}
      key={hotel.id}
      onClick={() => onSelect(hotel)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === "Enter") {
          onSelect(hotel);
        }
      }}
    >
      <div className="stay-photo">
        <img src={hotel.image} alt={hotel.name} />

        {hotel.category && (
          <span className="stay-category">
            {hotel.category}
          </span>
        )}

        <span className="stay-rating">
          ★ {hotel.rating}
        </span>
      </div>

      <div className="stay-card-content">
        <h3>{hotel.name}</h3>

        <p className="stay-location">
          📍 {hotel.city}
        </p>

        <p className="stay-description">
          {hotel.description}
        </p>

        <div className="stay-card-bottom">
          <div className="stay-price-info">
            <div className="stay-price-row">
              {hotel.originalPrice > hotel.price && (
                <span className="original-price">
                  ₹{hotel.originalPrice.toLocaleString("en-IN")}
                </span>
              )}

              <strong>
                ₹{hotel.price.toLocaleString("en-IN")}
              </strong>
            </div>

            <span className="per-night">/ night</span>
          </div>

          {hotel.originalPrice > hotel.price && (
            <span className="discount-badge">
              {Math.round(
                ((hotel.originalPrice - hotel.price) /
                  hotel.originalPrice) * 100
              )}% OFF
            </span>
          )}
        </div>

        <div className="stay-explore">
          Explore Stay <span>→</span>
        </div>
      </div>
    </article>
  );
}

export default HotelCard;
