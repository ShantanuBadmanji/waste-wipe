import { eq } from "drizzle-orm";
import { drizzlePool } from "../../../../db/connect";
import { afterImage } from "../../../../db/schemas";

const getAfterImages = async (complaintId: number) => {
  return await drizzlePool
    .select({
      id: afterImage.id,
      url: afterImage.url,
    })
    .from(afterImage)
    .where(eq(afterImage.complaintId, complaintId));
};

export default getAfterImages;
