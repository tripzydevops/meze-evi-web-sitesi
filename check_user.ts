import { db } from "./src/db";
import { user, account } from "./src/db/schema";
import { eq } from "drizzle-orm";

async function main() {
  const email = "bispecialmeze@gmail.com";
  
  console.log(`Checking user: ${email}`);
  
  const userData = await db.select().from(user).where(eq(user.email, email)).limit(1);
  
  if (userData.length === 0) {
    console.log("User not found in user table.");
    return;
  }
  
  const u = userData[0];
  console.log("User found:", JSON.stringify(u, null, 2));
  
  const accountData = await db.select().from(account).where(eq(account.userId, u.id)).limit(1);
  
  if (accountData.length === 0) {
    console.log("No account found for this user.");
  } else {
    console.log("Account found:", JSON.stringify({
      ...accountData[0],
      password: accountData[0].password ? "[REDACTED]" : "NULL"
    }, null, 2));
  }
}

main().catch(console.error);
