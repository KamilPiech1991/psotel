
module.exports = function (eleventyConfig) {
  
  eleventyConfig.addPassthroughCopy("./src/assets/css");
  eleventyConfig.addPassthroughCopy("./src/assets/js");
  eleventyConfig.addPassthroughCopy("./src/assets/img");
  eleventyConfig.addPassthroughCopy("./src/assets/fonts");
  eleventyConfig.addPassthroughCopy("./src/admin");
  eleventyConfig.addPassthroughCopy("./src/static");
  eleventyConfig.addPassthroughCopy("./src/blog/img");
  eleventyConfig.addPassthroughCopy("./src/galeria/img");
  eleventyConfig.addWatchTarget("./src/assets/sass/");

  // Collections
  eleventyConfig.addCollection('posts', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/blog/**/*.md').reverse();
  });

  eleventyConfig.addCollection("faq", function(collectionApi) {
    return collectionApi.getFilteredByGlob("src/faq/**/*.md");
  });

  // Gallery
  eleventyConfig.addCollection('gallery', function(collectionApi) {
    return collectionApi.getFilteredByGlob('src/galeria/**/*.md').reverse();
  });
  

  return {
    dir: {
      input: "src",
      output: "public",
      includes: "includes",
    },
  };
};
