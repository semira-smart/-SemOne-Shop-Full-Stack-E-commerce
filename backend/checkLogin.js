(async () => {
  try {
    const res = await fetch("http://localhost:5001/auth/login", {
      method: "POST",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({
        email: "semiratsegaye71@gmail.com",
        password: "Semira@123",
      }),
    });
    const json = await res.json();
    if (json && json.success && json.token) {
      console.log("Login OK for admin email, token issued");
      process.exit(0);
    } else {
      console.error("Login failed:", json);
      process.exit(1);
    }
  } catch (e) {
    console.error("Login check error:", e.message);
    process.exit(1);
  }
})();
