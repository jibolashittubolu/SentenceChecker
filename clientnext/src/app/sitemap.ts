import type { MetadataRoute } from 'next'
 
export default function sitemap(): MetadataRoute.Sitemap {
  return [
    {
      url: 'https://sentence-checker.jiboladev.com',
    //   lastModified: new Date(),
    //   changeFrequency: 'yearly',
    //   priority: 1,
    },
    {
        url: 'https://sentence-checker.jiboladev.com/sentenceChecker',
      //   lastModified: new Date(),
      //   changeFrequency: 'yearly',
      //   priority: 1,
    },

  ]
}