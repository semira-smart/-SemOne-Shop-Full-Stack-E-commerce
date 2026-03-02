require("dotenv").config();
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const User = require("./src/models/User");

(async () => {
  try {
    await mongoose.connect(process.env.MONGODB_URI);

    const email = "semiratsegaye71@gmail.com";
    const username = "semira";
    const plainPassword = "Semira@123";

    let user = await User.findOne({ email });
    const hashedPassword = await bcrypt.hash(plainPassword, 10);

    if (!user) {
      user = await User.create({
        username,
        email,
        password: hashedPassword,
        role: "Admin",
      });
      console.log("Admin user created:", user.email);
    } else {
      user.username = username;
      user.role = "Admin";
      // Update password to the known one to ensure access
      user.password = hashedPassword;
      await user.save();
      console.log("Admin user updated:", user.email);
    }
    process.exit(0);
  } catch (err) {
    console.error("Admin seeding failed:", err.message);
    process.exit(1);
  }
})();
