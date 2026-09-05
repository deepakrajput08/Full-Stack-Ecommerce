import mongoose from "mongoose";
import bcrypt from "bcryptjs";

const sellerProfileSchema = new mongoose.Schema(
  {
    storeName: { type: String, trim: true, maxlength: 80 },
    description: { type: String, trim: true, maxlength: 500 },
  },
  { _id: false }
);

const userSchema = new mongoose.Schema(
  {
    username: { type: String, required: true, unique: true, trim: true },
    email: { type: String, required: true, unique: true, trim: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["user", "admin"], default: "user" },
    isSeller: { type: Boolean, default: false },
    sellerProfile: { type: sellerProfileSchema, default: null },
  },
  { timestamps: true }
);

userSchema.pre("save", async function () {
  if (!this.isModified("password")) return;
  this.password = await bcrypt.hash(this.password, 10);
});

const User = mongoose.model("User", userSchema);
export default User;
