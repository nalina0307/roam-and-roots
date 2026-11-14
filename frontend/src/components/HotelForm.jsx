
function HotelForm({
  form,
  preview,
  galleryImages,
  editingHotelId,
  updateForm,
  handleImage,
  handleGalleryImages,
  addHotel,
  onClose,

}) {
  return (
    <div className="roam-modal-backdrop">
      <section className="roam-modal">
        <header className="roam-modal-header">
          <div>
            <span>PROPERTY COLLECTION</span>
            <h2>
              {editingHotelId !== null
                ? "Edit hotel"
                : "Add a new stay"}
            </h2>
          </div>

          <button
            type="button"
            className="modal-close"
            onClick={onClose}
            aria-label="Close form"
          >
            ×
          </button>
        </header>

        <form onSubmit={addHotel} className="roam-form">
          <label>
            Property image
            <input
              type="file"
              accept="image/*"
              onChange={handleImage}
              required={editingHotelId === null}
            />
          </label>

          {preview && (
            <img
              className="roam-preview"
              src={preview}
              alt="Selected property"
            />
          )}
          <label>
  Additional Hotel Photos (Up to 3)
  <input
    type="file"
    accept="image/*"
    multiple
    onChange={handleGalleryImages}
  />
</label>
{galleryImages.length > 0 && (
  <div className="gallery-upload-preview">
    {galleryImages.map((image, index) => (
      <img
        key={index}
        src={image}
        alt={`Hotel gallery ${index + 1}`}
      />
    ))}
  </div>
)}

          <label>
            Hotel title
            <input
              type="text"
              placeholder="Name of the property"
              value={form.title}
              onChange={(event) =>
                updateForm("title", event.target.value)
              }
              required
            />
          </label>

          <label>
            City
            <input
              type="text"
              placeholder="Enter city name (e.g., Goa)"
              value={form.city}
              onChange={(event) =>
                updateForm("city", event.target.value)
              }
              required
            />
          </label>
          <label>
  Official Website URL
  <input
    type="url"
    placeholder="https://www.example.com"
    value={form.website || ""}
    onChange={(event) =>
      updateForm("website", event.target.value)
    }
  />
</label>

          <label>
            Description
            <textarea
              placeholder="What makes this stay special?"
              value={form.description}
              onChange={(event) =>
                updateForm("description", event.target.value)
              }
              required
            />
          </label>

          <div className="roam-coordinates">
            <label>
              Latitude
              <input
                type="number"
                step="any"
                min="-90"
                max="90"
                placeholder="11.0168"
                value={form.latitude}
                onChange={(event) =>
                  updateForm("latitude", event.target.value)
                }
                required
              />
            </label>

            <label>
              Longitude
              <input
                type="number"
                step="any"
                min="-180"
                max="180"
                placeholder="76.9558"
                value={form.longitude}
                onChange={(event) =>
                  updateForm("longitude", event.target.value)
                }
                required
              />
            </label>
          </div>
         

         <div className="roam-price-fields">
  <label>
    Original Price (₹)
    <input
      type="number"
      min="1"
      placeholder="Example: 1800"
      value={form.originalPrice ?? ""}
      onChange={(event) =>
        updateForm("originalPrice", event.target.value)
      }
      required
    />
  </label>

  <label>
    Offer Price (₹)
    <input
      type="number"
      min="1"
      placeholder="Example: 1200"
      value={form.price}
      onChange={(event) =>
        updateForm("price", event.target.value)
      }
      required
    />
  </label>
</div>

          <div className="roam-form-actions">
            <button
              type="button"
              className="form-cancel"
              onClick={onClose}
            >
              Cancel
            </button>

            <button type="submit" className="form-save">
              {editingHotelId !== null
                ? "Save changes"
                : "Add property"}
            </button>
          </div>
        </form>
      </section>
    </div>
  );
}

export default HotelForm;
