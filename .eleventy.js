module.exports = function (eleventyConfig) {
  eleventyConfig.addWatchTarget('src/scss');
  eleventyConfig.setTemplateFormats(['ejs']);

  return {
    dir: {
      input: 'src',
      output: 'dist',
      // includes: 'src/_includes',
    },
  };
};
