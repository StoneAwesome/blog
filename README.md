![StoneAwesomeBlog](./public/logo/ogimage.jpg)

[![Netlify Status](https://api.netlify.com/api/v1/badges/430325a9-bf84-4789-907d-e0334c40abeb/deploy-status)](https://app.netlify.com/sites/stoneawesome/deploys)

This is the code & content for StoneAwesome. It's based on the [Next.js blogging template](https://github.com/wutali/nextjs-netlify-blog-template).


# Dependencies

- [Next.JS](https://nextjs.org/) - Site is statically generated using Next.JS.
- [Bootstrap](https://getbootstrap.com/) - Most of the main CSS is provided by a customized version of Bootstrap 5.
- [Cloudinary](https://cloudinary.com/) - Persists all of our instagram images allowing us to easily blur, resize and optimize for different screen sizes.
- [FontAwesome](https://fontawesome.com/) - There's several places where we use glyphs. These are almost always provided by FontAwesome. Note we use the DuoTone glyphs and some pro glyphs so you'll need to have a pro account in order to use them, but you can easily swap them out for the free variants.


# Environment Values Used

When running the project locally, you should use the following .env.local file with the placeholders filled out. You'll also need to have `FONT_AWESOME_TOKEN` in your environment to build / run project for the Font Awesome Pro icons.

```
NEXT_PUBLIC_IS_DEBUG=true
NEXT_PUBLIC_CLOUDINARY_CLOUD=
NEXT_PUBLIC_CLOUDINARY_KEY=
CLOUDINARY_SECRET=
NEXT_PUBLIC_IS_DEBUG=
```