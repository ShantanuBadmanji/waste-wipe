import { Response, Request, NextFunction } from "express-serve-static-core";
import { DataResBody, MessageResBody } from "../../utils/types";
import { wasteType } from "../../db/schemas";
import { drizzlePool } from "../../db/connect";
import { eq } from "drizzle-orm";
import { InsertWasteType, SelectWasteType } from "../../db/schemas/waste-type";

const getWasteTypes = async (
  req: Request,
  res: Response<DataResBody<SelectWasteType[]>>,
  next: NextFunction
) => {
  try {
    const wastetypes = await drizzlePool.select().from(wasteType);
    res.json({ data: wastetypes, status: 200 });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
};

const postWasteType = async (
  req: Request<unknown, unknown, InsertWasteType>,
  res: Response<MessageResBody>,
  next: NextFunction
) => {
  try {
    const typeName = req.body.typeName;
    console.log("🚀 ~ statusName:", typeName);
    await drizzlePool.insert(wasteType).values({ typeName });
    return res
      .status(201)
      .json({ status: 201, message: "Waste-Type added successfully" });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
};

const deleteWasteTypeById = async (
  req: Request<{ id: number }, unknown, unknown>,
  res: Response<MessageResBody>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    console.log("🚀 ~ id:", id);
    await drizzlePool.delete(wasteType).where(eq(wasteType.id, id));
    res.json({ status: 200, message: "Waste-Type deleted successfully" });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
};

const putWasteTypeById = async (
  req: Request<{ id: number }, unknown, InsertWasteType>,
  res: Response<MessageResBody>,
  next: NextFunction
) => {
  try {
    const id = req.params.id;
    const typeName = req.body.typeName;
    console.log("🚀 ~ id:", id);
    console.log("🚀 ~ typeName:", typeName);
    await drizzlePool
      .update(wasteType)
      .set({ typeName })
      .where(eq(wasteType.id, id));
    res.json({ status: 200, message: "Waste-Type updated successfully" });
  } catch (error: any) {
    console.log("🚀 ~ error:", error);
    return next(error);
  }
};

const WasteType = {
  getAll: getWasteTypes,
  post: postWasteType,
  deleteById: deleteWasteTypeById,
  putById: putWasteTypeById,
};

export default WasteType;
