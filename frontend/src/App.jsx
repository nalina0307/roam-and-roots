import HotelCard from "./components/HotelCard";
import HotelForm from "./components/HotelForm";
import Pagination from "./components/Pagination";
import AdminLogin from "./components/AdminLogin";
import {
  getHotels,
  createHotel,
  editHotelAPI,
  removeHotel,
} from "./services/hotelService";
import { loginAdmin } from "./services/authService";
import { useNavigate, useLocation } from "react-router-dom";
import { useState, useEffect } from "react";
import { useDispatch, useSelector } from "react-redux";
import { Helmet } from "react-helmet-async";
import {
  setHotels,
  addHotel as addHotelAction,
  updateHotel as updateHotelAction,
  deleteHotel as deleteHotelAction,
} from "./hotelSlice";
import "./App.css";

const hotelData = [
  {
    id: 1,
    name: "The Courtyard House",
    city: "Coimbatore, Tamil Nadu",
    price: 4200,
    rating: 4.8,
    latitude: 11.0168,
    longitude: 76.9558,
    category: "BOUTIQUE STAY",
    image:
      "https://images.unsplash.com/photo-1566073771259-6a8506099945?w=900",
    description:
      "A quiet retreat with thoughtful interiors, a leafy courtyard and warm local hospitality.",
  },
  {
    id: 2,
    name: "Salt & Shore",
    city: "Mahabalipuram, Tamil Nadu",
    price: 6800,
    rating: 4.9,
    latitude: 12.6269,
    longitude: 80.1927,
    category: "COASTAL ESCAPE",
    image:
      "https://images.unsplash.com/photo-1571896349842-33c89424de2d?w=900",
    description:
      "Wake up to coastal air, slow mornings and beautiful spaces designed for a restful stay.",
  },
  {
    id: 3,
    name: "The Fern Residence",
    city: "Ooty, Tamil Nadu",
    price: 5100,
    rating: 4.7,
    latitude: 11.4064,
    longitude: 76.6932,
    category: "HILL RETREAT",
    image:
      "https://images.unsplash.com/photo-1511895426328-dc8714191300?w=900",
    description:
      "A hillside hideaway surrounded by green landscapes, crisp air and peaceful surroundings.",
  },
];

function App() {
  
const dispatch = useDispatch();
const navigate = useNavigate();
const location = useLocation();

const hotelId = location.pathname.startsWith("/hotels/")
  ? location.pathname.split("/")[2]
  : null;
const hotels = useSelector((state) => state.hotels.hotels);
const selectedHotel = hotelId
  ? hotels.find((hotel) => String(hotel.id) === hotelId)
  : null;
const [isHotelsLoaded, setIsHotelsLoaded] = useState(false);
const [activeNav, setActiveNav] = useState("#top");
const [isAdmin, setIsAdmin] = useState(false);
const [showAdminLogin, setShowAdminLogin] = useState(false);
  const [search, setSearch] = useState("");
  const [currentPage, setCurrentPage] = useState(1);
  const [minPrice, setMinPrice] = useState("");
  const [maxPrice, setMaxPrice] = useState("");
  const [showForm, setShowForm] = useState(false);
  const [preview, setPreview] = useState("");
  const [galleryImages, setGalleryImages] = useState([]);
  const [message, setMessage] = useState("");
  const [editingHotelId, setEditingHotelId] = useState(null);
  const [locationLoading, setLocationLoading] = useState(false);
  const [currentLocation, setCurrentLocation] = useState(null);
  const [form, setForm] = useState({
  title: "",
  city: "",
  description: "",
  latitude: "",
  longitude: "",
  price: "",
  originalPrice: "",
  website: "",
  image: null,
});
useEffect(() => {
  async function loadHotels() {
    try {
      let databaseHotels = await getHotels();

      // If database is empty, move existing hotels into it
      if (databaseHotels.length === 0) {
        const savedHotels = localStorage.getItem("roamRestHotels");

        const existingHotels = savedHotels
          ? JSON.parse(savedHotels)
          : hotelData;

        for (const hotel of existingHotels) {
          await createHotel(hotel);
        }

        databaseHotels = await getHotels();
      }

      const formattedHotels = databaseHotels.map((hotel) => ({
        ...hotel,
        id: Number(hotel.id),
        price: Number(hotel.price),
        originalPrice: Number(hotel.originalPrice ?? hotel.price),
        rating: Number(hotel.rating ?? 4.5),
        latitude: Number(hotel.latitude),
        longitude: Number(hotel.longitude),
        galleryImages: hotel.galleryImages || [],
      }));

      dispatch(setHotels(formattedHotels));
    } catch (error) {
      console.error("Failed to load hotels:", error);
      setMessage("Unable to load hotels from database.");
    } finally {
      setIsHotelsLoaded(true);
    }
  }

  loadHotels();
}, [dispatch]);

  const filteredHotels = hotels.filter((hotel) => {
  const searchText = search.toLowerCase().trim();

  const searchMatch =
    String(hotel.name ?? "").toLowerCase().includes(searchText) ||
    String(hotel.city ?? "").toLowerCase().includes(searchText) ||
    String(hotel.latitude ?? "").toLowerCase().includes(searchText) ||
    String(hotel.longitude ?? "").toLowerCase().includes(searchText);

  const minMatch = minPrice === "" || hotel.price >= Number(minPrice);
  const maxMatch = maxPrice === "" || hotel.price <= Number(maxPrice);

  return searchMatch && minMatch && maxMatch;
});
  useEffect(() => {
  setCurrentPage(1);
}, [search, minPrice, maxPrice]);
  
const hotelsPerPage = 6;

const totalPages = Math.ceil(filteredHotels.length / hotelsPerPage);

const startIndex = (currentPage - 1) * hotelsPerPage;

const currentHotels = filteredHotels.slice(
  startIndex,
  startIndex + hotelsPerPage
);


  function openForm() {
    if (!isAdmin) return;
  setForm({
    title: "",
    city: "",
    description: "",
    latitude: "",
    longitude: "",
    price: "",
originalPrice: "",
website: "",
image: null,
  });

  setPreview("");
  setShowForm(true);
}
 function editHotel(hotel) {
  if (!isAdmin) return;
  setEditingHotelId(hotel.id);

  setForm({
    title: hotel.name,
    city: hotel.city ?? "",
    description: hotel.description,
    latitude: String(hotel.latitude),
    longitude: String(hotel.longitude),
   price: String(hotel.price),
originalPrice: String(hotel.originalPrice ?? hotel.price),
website: hotel.website ?? "",
image: null,
  });

  setPreview(hotel.image);
  setGalleryImages(hotel.galleryImages || []);
  navigate("/");
  setShowForm(true);
}

  function updateForm(field, value) {
    setForm((previous) => ({ ...previous, [field]: value }));
  }
  function getCurrentLocation() {
  if (!navigator.geolocation) {
    alert("Geolocation is not supported by your browser.");
    return;
  }

  setLocationLoading(true);

  navigator.geolocation.getCurrentPosition(
    (position) => {
      setCurrentLocation({
        latitude: position.coords.latitude,
        longitude: position.coords.longitude,
      });

      setLocationLoading(false);
      setMessage("Your current location detected successfully.");
    },
    (error) => {
      setLocationLoading(false);

      if (error.code === 1) {
        alert("Please allow location access.");
      } else if (error.code === 2) {
        alert("Your location is unavailable.");
      } else {
        alert("Unable to get your location. Please try again.");
      }
    },
    {
      enableHighAccuracy: true,
      timeout: 10000,
      maximumAge: 0,
    }
  );
}
  
function handleImage(event) {
  const file = event.target.files?.[0];
  if (!file) return;

  const reader = new FileReader();

  reader.onload = () => {
    const image = new Image();

    image.onload = () => {
      const canvas = document.createElement("canvas");

      const maxWidth = 1000;
      const scale = Math.min(1, maxWidth / image.width);

      canvas.width = image.width * scale;
      canvas.height = image.height * scale;

      const context = canvas.getContext("2d");

      context.drawImage(
        image,
        0,
        0,
        canvas.width,
        canvas.height
      );

      const compressedImage = canvas.toDataURL("image/jpeg", 0.7);

      updateForm("image", compressedImage);
      setPreview(compressedImage);
    };

    image.src = reader.result;
  };

  reader.readAsDataURL(file);
}
function handleGalleryImages(event) {
  const files = Array.from(event.target.files || []).slice(0, 3);

  if (files.length === 0) return;

  const compressedImages = files.map((file) => {
    return new Promise((resolve) => {
      const reader = new FileReader();

      reader.onload = () => {
        const image = new Image();

        image.onload = () => {
          const canvas = document.createElement("canvas");
          const maxWidth = 1000;
          const scale = Math.min(1, maxWidth / image.width);

          canvas.width = image.width * scale;
          canvas.height = image.height * scale;

          const context = canvas.getContext("2d");
          context.drawImage(image, 0, 0, canvas.width, canvas.height);

          resolve(canvas.toDataURL("image/jpeg", 0.7));
        };

        image.src = reader.result;
      };

      reader.readAsDataURL(file);
    });
  });

  Promise.all(compressedImages).then((images) => {
    setGalleryImages(images);
  });
}
 
async function addHotel(event) {
  event.preventDefault();
  if (!isAdmin) return;
  if (!form.title.trim()) {
    alert("Please enter a hotel title.");
    return;
  }

  if (!form.description.trim()) {
    alert("Please enter a hotel description.");
    return;
  }

  if (Number(form.price) <= 0) {
    alert("Price must be greater than zero.");
    return;
  }
  if (Number(form.originalPrice) < Number(form.price)) {
  alert("Original price must be greater than or equal to offer price.");
  return;
}

  if (
    form.latitude === "" ||
    Number(form.latitude) < -90 ||
    Number(form.latitude) > 90
  ) {
    alert("Please enter a valid latitude between -90 and 90.");
    return;
  }

  if (
    form.longitude === "" ||
    Number(form.longitude) < -180 ||
    Number(form.longitude) > 180
  ) {
    alert("Please enter a valid longitude between -180 and 180.");
    return;
  }
  const existingHotel = hotels.find(
    (hotel) => hotel.id === editingHotelId
  );

  const hotelImage = form.image
    ? preview
    : existingHotel?.image;

  if (!hotelImage) {
    alert("Please choose a hotel image.");
    return;
  }

  const updatedHotel = {
    id: editingHotelId ?? Date.now(),
    name: form.title.trim(),
    city: form.city.trim(),
    price: Number(form.price),
    originalPrice: Number(form.originalPrice),
    website: form.website?.trim() || existingHotel?.website || "",
    rating: existingHotel?.rating ?? 4.5,
    latitude: Number(form.latitude),
    longitude: Number(form.longitude),
    category: existingHotel?.category ?? "NEW PROPERTY",
    image: hotelImage,
    galleryImages:
  galleryImages.length > 0
    ? galleryImages
    : existingHotel?.galleryImages || [],
    description: form.description.trim(),
  };

 try {
  if (editingHotelId !== null) {
    await editHotelAPI(editingHotelId, updatedHotel);
    setMessage("Hotel details updated successfully.");
  } else {
    await createHotel(updatedHotel);
    setMessage("Your property has been added.");
  }

  const databaseHotels = await getHotels();

  const formattedHotels = databaseHotels.map((hotel) => ({
    ...hotel,
    id: Number(hotel.id),
    price: Number(hotel.price),
    originalPrice: Number(hotel.originalPrice ?? hotel.price),
    rating: Number(hotel.rating ?? 4.5),
    latitude: Number(hotel.latitude),
    longitude: Number(hotel.longitude),
    galleryImages: hotel.galleryImages || [],
  }));

  dispatch(setHotels(formattedHotels));

} catch (error) {
  console.error("Hotel save failed:", error);
  setMessage("Unable to save hotel. Please try again.");
  return;
}

  setEditingHotelId(null);
  setGalleryImages([]);
  setShowForm(false);

  window.setTimeout(() => setMessage(""), 3000);
}
async function deleteHotel(hotel) {
  if (!isAdmin) return;
  const confirmDelete = window.confirm(
    `Are you sure you want to delete "${hotel.name}"?`
  );

  if (!confirmDelete) return;
try {
  await removeHotel(hotel.id);

  dispatch(deleteHotelAction(hotel.id));

  navigate("/");
  setMessage("Hotel deleted successfully.");

  window.setTimeout(() => setMessage(""), 3000);
} catch (error) {
  console.error("Hotel delete failed:", error);
  setMessage("Unable to delete hotel. Please try again.");
}
 
}

async function handleAdminLogin(username, password) {
  const result = await loginAdmin(username, password);

  if (result.success) {
    setIsAdmin(true);
    setShowAdminLogin(false);
    return true;
  }

  return false;
}
function handleAdminLogout() {
  setIsAdmin(false);
  setShowForm(false);
  setEditingHotelId(null);
  navigate("/");
}
  return (
     <div className="roam-app">
    <Helmet>
  <title>
    {selectedHotel
      ? `${selectedHotel.name} | roam&roots`
      : "roam&roots | Find Your Stay"}
  </title>

  <meta
    name="description"
    content={
      selectedHotel
        ? `${selectedHotel.description} Book your stay at ${selectedHotel.name}.`
        : "Discover thoughtful stays, memorable places, and unique hotel experiences with roam&roots."
    }
  />
  </Helmet>
 
{hotelId && !selectedHotel && (
  <div className="hotel-not-found">
    <div className="not-found-card">
      <span className="not-found-icon">404</span>

      <p className="not-found-label">
        LOST YOUR WAY?
      </p>

      <h1>Hotel Not Found</h1>

      <p className="not-found-description">
        Sorry, this stay doesn't exist or may have
        been removed from our collection.
      </p>

      <button
        className="not-found-button"
        onClick={() => navigate("/")}
      >
        ← Explore our stays
      </button>

      <span className="not-found-footer">
        ROAM & ROOTS · STAYS WITH CHARACTER
      </span>
    </div>
  </div>
)}

  {selectedHotel && (
    <meta
      property="og:image"
      content={selectedHotel.image}
    />
  )}

    
      <header className="roam-header">
        <a className="brand" href="#top">
  <img
    src="/roam-roots-logo.webp"
    alt="roam & roots"
    className="brand-logo"
  />
</a>

        <nav className="main-nav">
  <a
    href="#top"
    className={activeNav === "#top" ? "active" : ""}
    onClick={() => setActiveNav("#top")}
  >
    Discover
  </a>

  <a
    href="#stays"
    className={activeNav === "#stays" ? "active" : ""}
    onClick={() => setActiveNav("#stays")}
  >
    Our stays
  </a>

  <a
    href="#about"
    className={activeNav === "#about" ? "active" : ""}
    onClick={() => setActiveNav("#about")}
  >
    Our story
  </a>
</nav>

        {isAdmin ? (
  <div className="admin-header-actions">
    <span className="admin-status">Admin</span>

    <button
      className="add-property"
      onClick={openForm}
    >
      + List a stay
    </button>

    <button
      className="admin-logout"
      onClick={handleAdminLogout}
    >
      Logout
    </button>
  </div>
) : (
  <button
    className="add-property"
    onClick={() => setShowAdminLogin(true)}
  >
    Admin Login
  </button>
)}
      </header>

      <section className="roam-hero" id="top">
        <div className="hero-copy">
          <span className="hero-kicker">A DIFFERENT KIND OF GETAWAY</span>
          <h1>
            Find a place
            <br />
            that feels <em>like you.</em>
          </h1>
          <p>
            Thoughtful stays, memorable corners and places worth taking
            the long way to.
          </p>
          <a className="hero-link" href="#stays">
            Find your next stay <span>↗</span>
          </a>
        </div>

        <div className="hero-note">
          <span>01 — 03</span>
          <p>Small places.<br />Big memories.</p>
        </div>
      </section>
     <main
  className="stays-section"
  id="stays"
  style={{
  background: "linear-gradient(180deg, #f3efe6 0%, #faf7f0 45%, #f3efe6 100%)",
  minHeight: "100vh"
}}
>
        <div className="section-topline">
          <span>THE ROAM COLLECTION</span>
          <span>CURATED FOR SLOW TRAVEL</span>
        </div>

        <div className="stays-heading">
          <div>
            <h2>Somewhere<br />worth staying.</h2>
            <p>Places with a little more soul.</p>
          </div>

          <span className="result-count">
            {filteredHotels.length} stays found
          </span>
        </div>

        <div className="stay-filters">
          <input
            type="search"
            placeholder="Search by hotel or destination"
            value={search}
            onChange={(event) => setSearch(event.target.value)}
          />

          <input
            type="number"
            placeholder="Min. price ₹"
            value={minPrice}
            onChange={(event) => setMinPrice(event.target.value)}
          />

          <input
            type="number"
            placeholder="Max. price ₹"
            value={maxPrice}
            onChange={(event) => setMaxPrice(event.target.value)}
          />
        </div>

        {message && <div className="roam-message">{message}</div>}

        <div className="stay-grid">
  {currentHotels.map((hotel, index) => (
    <HotelCard
      key={hotel.id}
      hotel={hotel}
      index={index}
      onSelect={(hotel) => navigate(`/hotels/${hotel.id}`)}
    />
  ))}
</div>

        {filteredHotels.length === 0 && (
          <div className="no-stays">
            <h3>No stays match your search</h3>
            <p>Try a different destination or price range.</p>
          </div>
        )}
        
<Pagination
  currentPage={currentPage}
  totalPages={totalPages}
  onPageChange={setCurrentPage}
/>

      </main>
      

{selectedHotel && (
  <div className="hotel-details-overlay">

    {/* CINEMATIC HOTEL HERO */}

    <section className="details-hero">
      <img
        src={selectedHotel.image}
        alt={selectedHotel.name}
        className="details-hero-image"
      />

      <div className="details-hero-shade"></div>

      <button
        className="details-back"
        onClick={() => navigate("/")}
      >
        ← Back to stays
      </button>

      <div className="details-hero-content">
        <span>{selectedHotel.category}</span>

        <h1>{selectedHotel.name}</h1>

        <p>↗ {selectedHotel.city}</p>
      </div>

      <div className="details-hero-number">
        ROAM & ROOTS
        <span>STAYS WITH CHARACTER</span>
      </div>
    </section>

    {/* HOTEL INFORMATION */}

    <main className="details-main">

<section className="details-intro">

  {/* LEFT: PHOTO CARDS + STATEMENT */}
  <div className="details-gallery-section">

    <div className="details-gallery">
      {(selectedHotel.galleryImages?.length > 0
        ? selectedHotel.galleryImages
        : [selectedHotel.image]
      ).map((photo, index) => (
        <div className={`details-gallery-card gallery-card-${index + 1}`} key={index}>
          <img
            src={photo}
            alt={`${selectedHotel.name} photo ${index + 1}`}
          />
        </div>
      ))}
    </div>

    <div className="details-intro-heading">
      <span className="details-eyebrow">YOUR NEXT ESCAPE</span>
      <h2>
        A stay worth
        <br />
        <em>remembering.</em>
      </h2>
    </div>

  </div>

  {/* RIGHT: DESCRIPTION */}
  <div className="details-description-box">
    <span>THE FEELING</span>
    <p>{selectedHotel.description}</p>
  </div>

</section>

      {/* PRICE AND RATING */}

      <section className="details-highlight-grid">

        <div className="details-highlight">
  <span>YOUR STAY</span>

  <div className="details-price-row">
    {selectedHotel.originalPrice > selectedHotel.price && (
      <span className="details-original-price">
        ₹{selectedHotel.originalPrice.toLocaleString("en-IN")}
      </span>
    )}

    <h3>
      ₹{selectedHotel.price.toLocaleString("en-IN")}
    </h3>
  </div>

  {selectedHotel.originalPrice > selectedHotel.price && (
    <span className="details-discount">
      {Math.round(
        ((selectedHotel.originalPrice - selectedHotel.price) /
          selectedHotel.originalPrice) * 100
      )}% OFF
    </span>
  )}

  <p>Per night</p>
</div>

        <div className="details-highlight rating-highlight">
          <span>GUEST LOVE</span>
          <h3>★ {selectedHotel.rating}</h3>
          <p>Guest rating</p>
        </div>

        <div className="details-highlight">
          <span>DESTINATION</span>
          <h3 className="destination-name">
            {selectedHotel.city}
          </h3>
          <p>Explore this location</p>
        </div>

      </section>

      {/* LOCATION DETAILS */}

      <section className="details-location-section">

        <div className="details-section-heading">
          <span>FIND YOUR WAY</span>
          <h2>Explore the location.</h2>
        </div>

        <div className="details-coordinates">
          <div>
            <span>LATITUDE</span>
            <p>{selectedHotel.latitude}</p>
          </div>

          <div>
            <span>LONGITUDE</span>
            <p>{selectedHotel.longitude}</p>
          </div>
        </div>

        <div className="details-map">
          <iframe
            title={`${selectedHotel.name} location`}
            src={`https://maps.google.com/maps?q=${selectedHotel.latitude},${selectedHotel.longitude}&z=15&output=embed`}
            width="100%"
            height="350"
            style={{ border: 0 }}
            loading="lazy"
            allowFullScreen
          />
        </div>

        <div className="current-location-section">

          <button
            type="button"
            className="use-location-btn"
            onClick={getCurrentLocation}
            disabled={locationLoading}
          >
            {locationLoading
              ? "Detecting your location..."
              : "⌖ Get Directions from My Location"}
          </button>

          {currentLocation && (
            <div className="current-location-info">
              <p>
                <strong>Your Latitude:</strong>{" "}
                {currentLocation.latitude}
              </p>

              <p>
                <strong>Your Longitude:</strong>{" "}
                {currentLocation.longitude}
              </p>

              <a
                href={`https://www.google.com/maps/dir/${currentLocation.latitude},${currentLocation.longitude}/${selectedHotel.latitude},${selectedHotel.longitude}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                Open Directions to Hotel →
              </a>
            </div>
          )}

          <button
            type="button"
            className="see-availability-btn"
            onClick={() => {
              if (selectedHotel.website) {
                window.open(
                  selectedHotel.website,
                  "_blank",
                  "noopener,noreferrer"
                );
              } else {
                alert("Official hotel website is not available yet.");
              }
            }}
          >
            See Availability ↗
          </button>

        </div>

        {isAdmin && (
          <div className="details-actions">
            <button
              className="details-edit"
              onClick={() => editHotel(selectedHotel)}
            >
              Edit hotel
            </button>

            <button
              className="details-delete"
              onClick={() => deleteHotel(selectedHotel)}
            >
              Delete hotel
            </button>
          </div>
        )}

      </section>

    </main>
  </div>
)}

      
<footer className="roam-footer" id="about">
  <div className="footer-content">
    <div className="footer-column">
      <h3>Explore</h3>
      <a href="#top">Discover</a>
      <a href="#stays">Our Stays</a>
    </div>

    <div className="footer-column">
      <h3>For Guests</h3>
      <a href="#stays">Find a Stay</a>
      <a href="#stays">Explore Hotels</a>
    </div>

    <div className="footer-column">
      <h3>Our Company</h3>
      <a href="#about">Our Story</a>
      <a href="#top">About roam & roots</a>
    </div>
  </div>

  <div className="footer-bottom">
    <a className="brand footer-brand" href="#top">
      roam<span>&</span>roots
    </a>
    <p>For the places that stay with you.</p>
    <span>© 2026 ROAM & ROOTS. All rights reserved.</span>
  </div>
</footer>

      {showAdminLogin && (
  <AdminLogin
    onLogin={handleAdminLogin}
    onClose={() => setShowAdminLogin(false)}
  />
)}
{showForm && (
  <HotelForm
    form={form}
    preview={preview}
    galleryImages={galleryImages}
    editingHotelId={editingHotelId}
    updateForm={updateForm}
    handleImage={handleImage}
    handleGalleryImages={handleGalleryImages}
    addHotel={addHotel}
    onClose={() => setShowForm(false)}

  />
)}
      </div>
  );
}

export default App;