# Apply 2 CSS

`apply2css` is a Visual Studio Code extension that compiles `@apply` directives into CSS, enhancing your development experience by allowing you to write more maintainable and scalable CSS within your projects. This extension is especially useful for developers using CSS-in-JS libraries or working in a Tailwind CSS environment where `@apply` is a common pattern.

## Features

- **Compile `@apply` Directives**: Automatically compiles `@apply` directives into standard CSS, making it easier to integrate with environments that do not support `@apply` natively.

- **Seamless Integration**: Works quietly in the background, with minimal configuration needed, providing a smoother workflow for front-end developers.

## Installation

To install the `apply2css` extension manually from a file:

1. Open Visual Studio Code.

2. Go to the Extensions view by clicking on the square icon in the sidebar or pressing `Ctrl+Shift+X`.

3. Click on the three dots at the top right of the Extensions view to open the menu.

4. Select `Install from VSIX...` from the menu.

5. Navigate to the location of the `.vsix` file you have downloaded or received, select it, and click `Open` to start the installation.

Ensure you have the `.vsix` file for the extension downloaded prior to following these steps.

## Usage

Once installed, the `apply2css` extension will automatically monitor CSS, SCSS, or other style files for `@apply` directives and compile them into CSS when you save the file. There are no additional steps required to activate the extension functionalities.

## Requirements

No specific requirements needed. The extension operates entirely within Visual Studio Code.

## Extension Settings

This extension allows some configuration to optimize the development environment according to your setup:

- **Node Path**: Specify the path to the Node.js binary if it's not set globally in your environment.

- **Tailwind CSS Config Path**: Optionally specify the path to your Tailwind CSS configuration file if it is not located in the default path.

## Release Notes

### 1.0.0

Initial release of `apply2css`:

- Support for real-time compilation of `@apply` directives into CSS.

## License

Distributed under the MIT License.
