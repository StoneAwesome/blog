import { v2 as cloudinary } from "cloudinary";

cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD,
  api_key: process.env.NEXT_PUBLIC_CLOUDINARY_KEY,
  api_secret: process.env.CLOUDINARY_SECRET,
  secure: true,
});

const META_DATA = {
  instagram_id: "jbr4xs5gggkmbvt4qbsh",
};
export async function uploadInstagramUrl(instagram_id: string, url: string) {
  const result = await cloudinary.uploader.upload(url, {
    folder: `/instagram/${instagram_id}`,
  });

  await cloudinary.uploader.update_metadata(
    {
      [META_DATA.instagram_id]: "312",
    },
    [result.public_id]
  );

  return result;
}
