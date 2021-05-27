const path = require('path')

let environmentViewsDirectory = ''
let outputDir = 'dist/'

/**
 * This is a precaution
 * In case we accidentally write dev-server files to disk,
 * we're not going to mess with our production ready dist folder
 */
if (process.env.NODE_ENV === 'development') {
  environmentViewsDirectory = 'devserver/'
  outputDir = 'dist-devserver/'
}

/**
 * A helper function to create Vue CLI page entries
 * @param {string} name The name of the JavaScript entry point for the page
 * @param {string} outputPath The path to the resulting HTML Blade file without the extension
 * @param {string} template An optional template file to be used as base for the Blade view
 * @returns 
 */
const page = (name, outputPath, template) => {
  return {
    [name]: {
      entry: `src/${name}.js`,
      filename: path.resolve(__dirname, `views/${environmentViewsDirectory}${outputPath}.blade.php`),
      template: template || 'src/template.blade.php'
    }
  }
}

module.exports = {
  /**
   * If you're not aiming for a SPA
   * You can add as many pages here as you want
   * as long as you create an entry .js file at resources/src/
   * You can also use this to create a separate template for an admin endpoint or any other endpoint you need
   */
  pages: {
    ...page('main', 'app'),
    // ...page('contact', 'contact'),
    // ...page('admin', `admin`),
  },
  // Where to dump resulting files
  outputDir: `../public/${outputDir}`,
  // The URL from which assets will be served
  // AND WHICH will be used by injected assets inside the HTML
  publicPath: process.env.VUE_APP_ASSET_URL,
  css: {
    extract: (process.env.NODE_ENV === 'development')
      ? {
        filename: 'css/[name].css'
      }
      : true
  },
  devServer: {
    // Public needs to be explicitly set since we're not using the defaults
    public: process.env.VUE_APP_ASSET_URL,
    // During development, we want to write ONLY the HTML files to the disk
    // This is needed because Laravel won't be able to read the view directly from memory
    // But we want our .js and .css assets to still be served directly from memory
    // So, we're writing to disk ONLY if the output file is at views/devserver/
    writeToDisk: (filePath) => {
      return /views\/devserver\//.test(filePath);
    },
    // Allows you to point any host to the devserver port.
    // Eg.: http://assets.localhost:8080 will also work
    // Alternatively you could use the "allowedHosts" option
    disableHostCheck: true,
    // Avoid CORS issues
    headers: {
      "Access-Control-Allow-Origin": "*",
      "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, PATCH, OPTIONS",
      "Access-Control-Allow-Headers": "X-Requested-With, content-type, Authorization"
    }
  }
}