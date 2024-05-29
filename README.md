# SkyPath React Demo 🌐

Quick Start Guide for the SkyPath React Demo using the Web JS SDK.

## Quick Start 🚀

This guide is designed to help you set up and run the SkyPath React demo application with minimal setup steps. Follow these steps to get started:

### 0. Clone the Repository

Make sure you have access to the SDK which is a dependency of this Demo app.

### 1. Clone the Repository

First, clone the demo repository to your local machine:

```sh
git clone https://github.com/Yamasee/skypath-web-sdk-demo.git
cd skypath-web-sdk-demo
```

### 2. Set Up Environment Variables

Before running the application, you need to set up the necessary environment variables. Copy the `.env.example` file to `.env`.

#### Variables

`VITE_REACT_SKYPATH_SDK_API_KEY` - Access key

`VITE_REACT_SKYPATH_SDK_BASE_URL` - Base URL

`VITE_REACT_MAPBOX_ACCESS_TOKEN` - MapBox access token; you can get it for free from [Mapbox](https://account.mapbox.com/)

### 3. Install Dependencies

Run the following command to install all necessary dependencies:

```sh
pnpm install
```

### 4. Start the Application

Now, start the application:

```sh
pnpm run dev
```

The application should now be running on `http://localhost:5173`. Open this URL in your browser to view the demo.

### Troubleshooting 🆘

If you encounter any issues during the setup or have questions, please refer to the main SDK documentation or contact the SkyPath support team for assistance.

### Additional Resources

For further details on how to utilize the SDK, please refer to the full [SkyPath Web SDK documentation](https://github.com/Yamasee/skypath-web-sdk).

Happy coding! 🚀
