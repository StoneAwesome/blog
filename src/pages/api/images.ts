import { uploadInstagramUrl } from "@lib/cloud-img";
import type { NextApiRequest, NextApiResponse } from "next";

export default async (req: NextApiRequest, res: NextApiResponse) => {
  const url = req.body["url"] as string;
  const bucket = req.body["instagram_id"] as string;

  try {
    const result = await uploadInstagramUrl(bucket, url);

    res.status(200).json(result);
  } catch (er) {
    res.status(500).json(er);
  }
};
