declare namespace NodeJS {
  export interface ProcessEnv {
    /**
     * Base URL for API
     */
    NEXT_PUBLIC_API_BASE: string;

    /**
     * Only to be used in dev
     */
    NEXT_PUBLIC_IS_DEBUG: boolean;
    /**
     * Google Analytics
     */
    NEXT_PUBLIC_GOOGLE_ANALYTICS: string;

    /**
     * The name of your cloudinary cloud
     */
    NEXT_PUBLIC_CLOUDINARY_CLOUD: string;

    /**
     * Cloudinary Key
     */
    NEXT_PUBLIC_CLOUDINARY_KEY: string;

    /**
     * Cloudinary Secrete. Only to be used on server side functions (hence no NEXT_PUBLIC)
     */
    CLOUDINARY_SECRET: string;
  }
}
