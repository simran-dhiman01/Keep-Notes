import bcrypt from 'bcrypt';
import User from './models/User.js';
import Tenant from './models/Tenant.js'

const seedData = async () => {
  // Tenants
  const acme = await Tenant.findOneAndUpdate(
    { slug: "acme" },
    { name: "Acme", slug: "acme", plan: "free" },
    { upsert: true, new: true }
  );

  const globex = await Tenant.findOneAndUpdate(
    { slug: "globex" },
    { name: "Globex", slug: "globex", plan: "free" },
    { upsert: true, new: true }
  );

  const password = await bcrypt.hash("password", 10);

  // Users
  await User.findOneAndUpdate(
    { email: "admin@acme.test" },
    { email: "admin@acme.test", password: password, role: "admin", tenantId: acme._id },
    { upsert: true, new: true }
  );

  await User.findOneAndUpdate(
    { email: "user@acme.test" },
    { email: "user@acme.test", password: password, role: "member", tenantId: acme._id },
    { upsert: true, new: true }
  );

  await User.findOneAndUpdate(
    { email: "admin@globex.test" },
    { email: "admin@globex.test", password: password, role: "admin", tenantId: globex._id },
    { upsert: true, new: true }
  );

  await User.findOneAndUpdate(
    { email: "user@globex.test" },
    { email: "user@globex.test", password: password, role: "member", tenantId: globex._id },
    { upsert: true, new: true }
  );

  console.log("Seeding done");
};

export default seedData;
