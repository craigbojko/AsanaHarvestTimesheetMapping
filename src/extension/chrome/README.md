# Grunt
  * Run `make build` to build the extension
  * This creates the /build/extensions/chrome folder that the extension is run out of
  * Run `make watch` to run continuous development tasks

# Installing
  * Navigate to chrome://extensions
  * Click 'Load unpacked extension'
  * Select the build folder
  * This is now running the unminified development version

# Deployment
  * Currently the extension can run as unpacked
  * Future updates will minify/uglify the code and pack into .crx file
