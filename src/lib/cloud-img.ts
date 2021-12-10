import { v2 as cloudinary, UploadApiResponse } from "cloudinary";
import { StoredInstagramImage } from "./instagram";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

const META_DATA = {
  instagram_id: "jbr4xs5gggkmbvt4qbsh",
};
export async function uploadInstagramUrl(
  instagram_id: string,
  url: string
): Promise<StoredInstagramImage> {
  const result = await cloudinary.uploader.upload(url, {
    folder: `/instagram/${instagram_id}`,
  });

  await cloudinary.uploader.update_metadata(
    {
      [META_DATA.instagram_id]: instagram_id,
    },
    [result.public_id]
  );

  return {
    height: result.height,
    id: result.public_id,
    url: result.url,
    width: result.width,
  };
}

export async function deleteFolder(folderId: string) {
  const imgs = await getAllImagesFromFolder(folderId);
  const ids = imgs.map((i) => i.public_id);
  return await cloudinary.api.delete_resources(ids, { public_ids: ids });
}

export async function getAllImagesFromFolder(folderId: string) {
  const result: { resources: UploadApiResponse[] } = await cloudinary.api.resources({
    type: "upload",
    prefix: `instagram/${folderId}`,
  });
  return result.resources;
}
