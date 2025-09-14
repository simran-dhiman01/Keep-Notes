import mongoose from "mongoose";

const userSchema = mongoose.Schema({
    email: { type: String, required: true, unique: true },
    password: { type: String, required: true },
    role: { type: String, enum: ["admin", "member"], default: "member" },
    tenantId: { type: mongoose.Schema.Types.ObjectId, ref: "Tenant", required: true },

} , {timestamps:true});

const User = mongoose.model('User' , userSchema);
export default User