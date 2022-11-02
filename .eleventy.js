module.exports = function(eleventyConfig) {

    eleventyConfig.addPassthroughCopy("./src/assets/css");
    eleventyConfig.addPassthroughCopy("./src/assets/js");
    eleventyConfig.addPassthroughCopy("./src/assets/img");
    eleventyConfig.addPassthroughCopy("./src/assets/fonts");

    eleventyConfig.addShortcode("year", () => `${new Date().getFullYear()}`);

    return {
      dir: {
        input: "src",
        output: "public",
        includes: "includes"
      }
    }
  };