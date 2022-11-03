import { MDX_Components } from "@lib/mdx-helper";
import { NextApiHandler, NextApiRequest, NextApiResponse } from "next";
import renderToString from "next-mdx-remote/render-to-string";

// api/mdx.ts
const mdxHandler: NextApiHandler = async (
  req: NextApiRequest,
  res: NextApiResponse
) => {
  const content = req.body.content;
  const mdxSource = await renderToString(content, {
    components: MDX_Components,
    mdxOptions: {
      remarkPlugins: [],
      rehypePlugins: [],
    },
    scope: {},
  });
  res.json({ mdxSource });
};

export default mdxHandler;
