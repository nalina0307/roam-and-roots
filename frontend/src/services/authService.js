
const ADMIN_CREDENTIALS = {
  username: "admin",
  password: "roots@123",
};

export async function loginAdmin(username, password) {
  // Simulates a backend login request
  await new Promise((resolve) => setTimeout(resolve, 500));

  if (
    username === ADMIN_CREDENTIALS.username &&
    password === ADMIN_CREDENTIALS.password
  ) {
    return {
      success: true,
      user: {
        username: "admin",
        role: "ADMIN",
      },
    };
  }

  return {
    success: false,
    message: "Invalid username or password",
  };
}
