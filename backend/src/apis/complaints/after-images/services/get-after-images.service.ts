import { eq } from "drizzle-orm";
import { drizzlePool } from "../../../../db/connect";
import { afterImageTable } from "../../../../db/schemas";

const getAfterImages = async (complaintId: number) => {
  return await drizzlePool
    .select({
      id: afterImageTable.id,
      url: afterImageTable.url,
    })
    .from(afterImageTable)
    .where(eq(afterImageTable.complaintId, complaintId));
};

export default getAfterImages;
