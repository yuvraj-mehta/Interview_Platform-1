import { Inngest} from "inngest";
import { connectDB } from "./db.js";
import User from "../models/User.js";
import { upsertStreamUser,deleteStreamUser } from "./stream.js";
 
export const inngest = new Inngest({
  id: "talent-iq",
  signingKey: process.env.INNGEST_SIGNING_KEY,
});

const syncUser = inngest.createFunction(
  { id: "Sync User" },
  { event: "clerk/user.created" },
  async ({ event }) => {
    try {
      await connectDB();

      console.log("SyncUser function triggered");
      console.log("Event data:", event.data);

      const {
        id,
        email_addresses,
        first_name,
        last_name,
        image_url,
      } = event.data;

      const email = email_addresses?.[0]?.email_address || "";

      // ✅ Upsert user (prevents duplicate key errors)
      const user = await User.findOneAndUpdate(
        { clerkId: id },
        {
          clerkId: id,
          name: `${first_name || ""} ${last_name || ""}`.trim(),
          profileImage: image_url || "",
          email,
        },
        {
          upsert: true,
          new: true,
          setDefaultsOnInsert: true,
        }
      );

      console.log("User synced to DB:", user.clerkId);

      // ✅ Sync with Stream (safe block so it doesn't crash entire function)
      try {
        await upsertStreamUser({
          id: user.clerkId.toString(),
          name: user.name,
          image: user.profileImage,
        });

        console.log("User synced to Stream:", user.clerkId);
      } catch (streamError) {
        console.error("Stream sync failed:", streamError.message);
      }

      return { success: true };
    } catch (error) {
      console.error("SyncUser function failed:", error);
      throw error; // Let Inngest handle retry if it's a real failure
    }
  }
);


const deleteUserFromDB = inngest.createFunction(
    { id: "Delete User From DB" },
    {event: "clerk/user.deleted" },
    async ({ event}) => { 
        await connectDB();
          
        const {id} = event.data;
         await User.deleteOne({clerkId: id});
        

         await deleteStreamUser(id.toString());
    }
);

export const functions = [syncUser, deleteUserFromDB];