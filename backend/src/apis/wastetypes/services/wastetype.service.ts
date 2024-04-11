import { Response, Request, NextFunction } from "express-serve-static-core";
import { drizzlePool } from "../../../db/connect";
import { wasteTypeTable } from "../../../db/schemas";
import { InsertWasteType } from "../../../db/schemas/waste-type";
import { eq } from "drizzle-orm";

const getWasteTypes = async () => {
  const wastetypes = await drizzlePool.select().from(wasteTypeTable);
  return wastetypes;
};

const postWasteType = async (newWasteType: InsertWasteType) => {
  console.log("🚀 ~ postWasteType ~ newWasteType:", newWasteType);
  await drizzlePool.insert(wasteTypeTable).values(newWasteType);
};

const deleteWasteTypeById = async (wasteTypeId: number) => {
  console.log("🚀 ~ deleteWasteTypeById ~ wasteTypeId:", wasteTypeId);
  await drizzlePool.delete(wasteTypeTable).where(eq(wasteTypeTable.id, wasteTypeId));
};

const putWasteTypeById = async (
  updatedWaasteType: InsertWasteType,
  wasteTypeId: number
) => {
  console.log("🚀 ~ putWasteTypeById ~ updatedWaasteType:", updatedWaasteType);
  await drizzlePool
    .update(wasteTypeTable)
    .set(updatedWaasteType)
    .where(eq(wasteTypeTable.id, wasteTypeId));
};

const WasteTypeServices = {
  getAll: getWasteTypes,
  create: postWasteType,
  deleteById: deleteWasteTypeById,
  putById: putWasteTypeById,
};

export default WasteTypeServices;
