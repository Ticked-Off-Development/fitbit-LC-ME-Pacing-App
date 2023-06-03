These are the directories that we are actively using in the development:

+ [app/](./app/): This folder contains the application logic which executes on the device. Code in this folder has access to the Device API and is capable of interacting directly with the presentation layer, communicating with the companion, or reading and writing settings.
+ [companion/](./companion/): This folder contains the companion logic which executes on the mobile device. Code in this folder has access to the Companion API and is capable of making direct requests to the internet, and communicating with the application.
+ [resources/](./resources/): This folder contains all of the resources which are bundled with the application during the build process.
+ [settings](./settings/): This folder contains the declaration for application settings, written using React JSX. This can be used to make an app configurable by the user. Code within this file has access to the Settings API.
+ [test](./test/): This folder contains the test files.

### app /
An `index.js` or `index.ts` file must exist in this folder, and must not be empty, or the build process will fail.


#### index.js
As the name implies, here is where all the javascript fonts and javascript frameworks reside. When you want to make changes, please minify the javascript and then upload.

#### css
Similar to js, here are the minified css files.

### companion /

If an `index.js` or `index.ts` file exist in this folder, the companion will be built.

### resources /
This folder contains all of the resources which are bundled with the application during the build process.

#### /resources/index.view
This is the main Fitbit SVG file where the application user interface markup is defined. This is a mandatory file.

#### /resources/widget.defs
This Fitbit SVG file controls which system widgets are available for use within the `index.view` file. This is a mandatory file.

#### /resources/*.css
Fitbit CSS files can be included in the application by creating a `<link>` in the `index.view` file.

#### /resources/*.png and /resources/*.jpg
All image files which are included in the resources folder can be used in the presentation layer by referencing them within an `<image>` element in the index.view.

[Here is more info about this model](http://www.ibm.com/developerworks/java/library/j-dao/)

###  settings / 
This folder contains the declaration for application settings, written using React JSX. This can be used to make an app configurable by the user. Code within this file has access to the Settings API.