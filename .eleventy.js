
module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("./src/assets/css");
    eleventyConfig.addPassthroughCopy("./src/assets/js");
    eleventyConfig.addPassthroughCopy("./src/assets/img");
    eleventyConfig.addPassthroughCopy("./src/assets/fonts");
    eleventyConfig.addWatchTarget("./src/assets/sass/");

    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    return {
      dir: {
        input: "src",
        output: "public",
        includes: "includes"
      }
    }
  };