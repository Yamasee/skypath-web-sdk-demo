# SkyPath React Demo 🌐

Quick Start Guide for the SkyPath React Demo using the Web JS SDK.

## Quick Start 🚀

This guide is designed to help you set up and run the SkyPath React demo application with minimal setup steps. Follow these steps to get started:

### 1. Clone the Repository

First, clone the demo repository to your local machine:

```sh
git clone https://github.com/Yamasee/skypath-web-sdk-demo.git
cd skypath-web-sdk-demo
```

### 2. Set Up Environment Variables

Before running the application, you need to set up the necessary environment variables. Copy the `.env.example` file to `.env`.

#### Variables

`REACT_APP_SKYPATH_SDK_API_KEY` - Access key

`REACT_APP_SKYPATH_SDK_BASE_URL` - Base URL

`REACT_APP_MAPBOX_ACCESS_TOKEN` - MapBox access token; you can get it for free from [Mapbox](https://account.mapbox.com/)

### 3. Install Dependencies

Run the following command to install all necessary dependencies:

```sh
npm install
```

### 4. Link the SkyPath SDK (For Developers)

If you are working on the SDK and need to test local changes, follow these steps to link the SDK:

```sh
# Navigate to your local SkyPath SDK directory
cd path/to/skypath-web-sdk
# Build the SDK if not already built
npm run compile
# Locate to dist folder
cd dist
# Link the SDK to the global npm registry
npm link

# Navigate back to your demo project directory
cd path/to/skypath-web-sdk-demo
# Link the local SDK to your project
npm link skypath-sdk
```

Use `npm link` inside the `dist` folder to create a symbolic link to the SDK.

This will use your local version of the SkyPath SDK for development purposes. Make sure the you do this after installing the dependencies.

### 5. Start the Application

Now, start the application:

```sh
npm start
```

The application should now be running on `http://localhost:3000`. Open this URL in your browser to view the demo.

### Troubleshooting 🆘

If you encounter any issues during the setup or have questions, please refer to the main SDK documentation or contact the SkyPath support team for assistance.

### Additional Resources

For further details on how to utilize the SDK, please refer to the full [SkyPath Web SDK documentation](https://github.com/Yamasee/skypath-web-sdk).

Happy coding! 🚀
