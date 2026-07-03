import 'dotenv/config';
import { readFile, writeFile } from 'node:fs/promises';
import { EleventyHtmlBasePlugin } from "@11ty/eleventy";
import { minify as minifyHtml } from 'html-minifier-terser';
import CleanCSS from 'clean-css';

export default function (eleventyConfig) {
  eleventyConfig.addPassthroughCopy({
    'assets': 'assets',
  });
  eleventyConfig.ignores.add('.kiro/**');
  eleventyConfig.ignores.add('CLAUDE.md');
  eleventyConfig.ignores.add('tests/**');
  eleventyConfig.addGlobalData('site_title', 'Bang Bang Auto Detailing');
  eleventyConfig.addGlobalData('email', 'bangbangautodetailing@gmail.com');
  eleventyConfig.addGlobalData('phone', '(407) 878-9967');
  eleventyConfig.addGlobalData('form_key', '22014556-8e60-44ea-a7d8-ebf8afea0a6d');
  eleventyConfig.addGlobalData('mapbox_key', process.env.MAPBOX_KEY || '');
  eleventyConfig.addGlobalData('service_area_cities', [
    'Orlando',
    'Windermere',
    'Oviedo',
    'Winter Springs',
    'Conway',
    'Altamonte Springs',
    'Winter Park',
    'Sanford',
    'Maitland',
    'Chuluota',
  ]);
  eleventyConfig.setIncludesDirectory('_includes');
  eleventyConfig.setLayoutsDirectory('_layouts');
  eleventyConfig.addPlugin(EleventyHtmlBasePlugin);

  // Minify only for `npm run build` — dev server output stays readable.
  if (process.env.ELEVENTY_RUN_MODE === 'build') {
    eleventyConfig.addTransform('htmlmin', function (content) {
      if (!this.page.outputPath || !this.page.outputPath.endsWith('.html')) {
        return content;
      }
      return minifyHtml(content, {
        collapseWhitespace: true,
        removeComments: true,
        minifyCSS: true,
        minifyJS: true,
      });
    });

    eleventyConfig.on('eleventy.after', async ({ dir }) => {
      const cssPath = `${dir.output}/assets/css/style.css`;
      const css = await readFile(cssPath, 'utf8');
      const minified = new CleanCSS().minify(css);
      if (minified.errors.length) {
        throw new Error(`CSS minification failed: ${minified.errors.join('; ')}`);
      }
      await writeFile(cssPath, minified.styles);
    });
  }
};
