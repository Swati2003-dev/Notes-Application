import mongoose from "mongoose";

const MONGO_URI = "mongodb+srv://dbSwati:Das%402003@cluster0.faqjcom.mongodb.net/?appName=Cluster0";

const userSchema=new mongoose.Schema({
    username:{ type:String, required:true },
    email:{ type:String, required:true, unique:true },
    password:{ type:String, required:true },
    createdAt:{ type:Date, default:Date.now() }
})
const User=mongoose.model("User",userSchema)

async function run() {
  await mongoose.connect(MONGO_URI);
  const users = await User.find({}, "email username");
  console.log("ALL DB USERS:");
  users.forEach(u => console.log(`- ${u.email} (${u.username})`));
  process.exit();
}
run();
