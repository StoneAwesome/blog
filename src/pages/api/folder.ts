import { deleteFolder, getAllImagesFromFolder } from "@lib/cloud-img";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const folder = req.query["instagram_id"] as string;

  if (!folder) {
    res.status(400).json({ msg: "No folder specified" });
    return;
  }

  try {
    if (req.method === "DELETE") {
      await deleteFolder(folder);
      res.status(200).end();
    } else if (req.method === "GET") {
      const result = await getAllImagesFromFolder(folder);
      res.status(200).json(result);
    } else {
      res.status(400).json({ msg: "Method not supported" });
    }
  } catch (er) {
    res.status(500).json(er);
  }
};
