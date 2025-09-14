import mongoose from "mongoose";

const tenantSchema = mongoose.Schema({
    name: { 
        type:String,
        required:true
    },
    slug:{
        type:String,
        required:true,
        unique:true,
        lowercase:true
    },
    plan:{
        type:String,
        enum:["free","pro"],
        default:"free"
    }
} , { timestamps: true });

const Tenant = mongoose.model('Tenant' , tenantSchema);
export default Tenant;