import { uploadInstagramUrl } from "@lib/cloud-img";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = req.query["url"] as string;
  const bucket = req.query["bucket"] as string;

  try {
    const result = await uploadInstagramUrl(bucket, url);

    res.status(200).json(result);
  } catch (er) {
    res.status(500).json(er);
  }
};
