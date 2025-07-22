import { EleventyHtmlBasePlugin } from "@11ty/eleventy";

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    'assets': 'assets',
  });
  eleventyConfig.addGlobalData('site_title', 'Bang Bang Auto Detailing');
  eleventyConfig.addGlobalData('email', 'bangbangautodetailing@gmail.com');
  eleventyConfig.addGlobalData('phone', '(407) 878-9967');
  eleventyConfig.addGlobalData('form_key', '22014556-8e60-44ea-a7d8-ebf8afea0a6d');
  eleventyConfig.setIncludesDirectory('_includes');
  eleventyConfig.setLayoutsDirectory('_layouts');
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);
};
