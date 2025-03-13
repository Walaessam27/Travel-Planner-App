# 🏝️ Travel App - Front End Nanodegree Capstone

## 📑 Table of Contents
- [Overview](#-overview)
- [Core Features](#-core-features)
- [APIs Used](#-apis-used)
- [Folder Structure](#-folder-structure)
- [Prerequisites](#prerequisites)
- [Getting Started](#-getting-started)
- [Acknowledgements](#acknowledgements)


---

## 🌍 Overview  
The **Travel App** is a web application that helps users plan their trips.  
Users can enter a **destination** and **trip date**, and the app will fetch:  
✅ **Weather data** for the selected location.  
✅ **An image** of the destination.  
✅ **A countdown timer** until the trip date.  

---

## ✨ Core Features  
✔️ **User Input:** Enter trip destination & date.  
✔️ **Weather Data:** Current & future weather from Weatherbit API.  
✔️ **Location Image:** Fetch images via Pixabay API.  
✔️ **Countdown Timer:** See how soon your trip is.  
✔️ **Modern UI:** Clean & responsive design.  

---

## 🔗 APIs Used  
🔹 **[Geonames API](http://www.geonames.org/)** → Get location data.  
🔹 **[Weatherbit API](https://www.weatherbit.io/)** → Fetch weather forecasts.  
🔹 **[Pixabay API](https://pixabay.com/api/docs/)** → Get destination images.  

---

## 📂 Folder Structure  
/travel-planner-app

  ├── /dist              # Output folder for bundled files
  
  ├── /src
  
  │   ├── /client 
  
  |   |   ├── /views   

          ├── /styles

          ├── /js

          └── index.js   
  
  │   ├── /server        
     
  ├── test     
      
  ├── package.json   

  ├── .babelrc   
  
  ├── webpack.dev.js 

  ├── webpack.prod.js 
  
  └── README.md        
---

## Prerequisites
- Node.js version v16.20.2 (Recommended)
- Install Node.js: [Download](https://nodejs.org/)
- If using NVM, run `nvm use`


---
## 🚀 Getting Started  

Follow these steps to set up and run the **Travel App** on your local machine:  

### 📥 1. Clone the Repository  
```bash
git clone https://github.com/walaessam27/travel-planner-app.git
```
### 📦 2. Install Dependencies
Run the following command to install all required packages:

```bash
npm install
```

### 🔑 3. Set Up Environment Variables
Set Up the APIs keys on this file /src/client/js/handleSubmit:

* username = your username on geonames
* weatherbitkey = your weatherbit API key
* pixabayAPI = your pixabay API key


### ⚙️ 4. Build and Run the Application
Development Build:

```bash
npm run build-dev
```

Start the Server:

```bash 

npm start

```

### 🌍 5. Open in Browser
Go to http://localhost:8888 to use the app.

---
## Acknowledgements
* Thanks to the API providers (Geonames, Weatherbit, and Pixabay) for providing excellent services that make this app functional.
* Special thanks to Udacity for providing the materials and guidance in completing this project.
