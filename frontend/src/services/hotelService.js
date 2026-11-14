const API_URL = "http://localhost:5000/api/hotels";

// Get all hotels
export async function getHotels() {
  const response = await fetch(API_URL);

  if (!response.ok) {
    throw new Error("Failed to fetch hotels");
  }

  return response.json();
}

// Add a hotel
export async function createHotel(hotel) {
  const response = await fetch(API_URL, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hotel),
  });

  if (!response.ok) {
    throw new Error("Failed to add hotel");
  }

  return response.json();
}

// Update a hotel
export async function editHotelAPI(id, hotel) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "PUT",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(hotel),
  });

  if (!response.ok) {
    throw new Error("Failed to update hotel");
  }

  return response.json();
}

// Delete a hotel
export async function removeHotel(id) {
  const response = await fetch(`${API_URL}/${id}`, {
    method: "DELETE",
  });

  if (!response.ok) {
    throw new Error("Failed to delete hotel");
  }

  return response.json();
}