# League of Legends Stats Tracker

A MERN stack web application that displays statistics for League of Legends players. Users can view player stats and performance data in an intuitive interface. Built with a simple CSS design for clean and user-friendly interaction.

---

# Demo Video

https://github.com/user-attachments/assets/8ee89974-62b4-402e-a4d9-32eef83d5b92


## Table of Contents
- [Features](#features)
- [Technologies](#technologies)
- [Installation](#installation)
- [Usage](#usage)
- [Contributors](#contributors)

---

## Features
- Search for League of Legends player statistics.
- Simple and clean user interface using vanilla CSS.
- Interactive and responsive experience powered by the MERN stack.

---

## Technologies
- [![React](https://img.shields.io/badge/React-20232A?style=for-the-badge&logo=react&logoColor=61DAFB)](https://reactjs.org/)
- [![CSS3](https://img.shields.io/badge/CSS-1572B6?style=for-the-badge&logo=css3&logoColor=white)](https://developer.mozilla.org/en-US/docs/Web/CSS)
- [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
- [![Express.js](https://img.shields.io/badge/Express.js-000000?style=for-the-badge&logo=express&logoColor=white)](https://expressjs.com/)
- [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)
- [![dotenv](https://img.shields.io/badge/dotenv-ECD53F?style=for-the-badge&logo=envato&logoColor=black)](https://www.npmjs.com/package/dotenv) 

---

## Installation

### Prerequisites
Make sure you have the following installed:
- [![Node.js](https://img.shields.io/badge/Node.js-339933?style=for-the-badge&logo=node.js&logoColor=white)](https://nodejs.org/)
- [![MongoDB](https://img.shields.io/badge/MongoDB-47A248?style=for-the-badge&logo=mongodb&logoColor=white)](https://www.mongodb.com/)

### Steps
1. **Clone the repository**:
 ```bash
 git clone https://github.com/pixhy/league-of-legends-stats-tracker
 cd league-of-legends-stats-tracker
 ```

2. **Install dependencies for both client and server**:

- Navigate to the client folder:
```bash
   cd client
   npm install
```
- Navigate to the server folder:
```bash
   cd ../server
   npm install
```
3. **Set up environment variables**:
- Create a .env file in the server directory.
- Add the following:
  API_KEY=your-api-key-for-data-fetching


#### Notes on Riot API
  
  You can get your API key on the [Riot Games developer portal](https://developer.riotgames.com/) with a Riot account.
  
  The Riot API provides the data for League of Legends player statistics.
  
  Keep in mind that the API key is rate-limited. For production use, apply for a production API key with higher limits on the Riot Developer Portal.
  


- Create mongoConnect.js in the server directory.
- Add the following:
 ```
  let mongooseConnect = your-mongodb-connection-string
  export default mongooseConnect;
  ``` 
# Usage
## Start the Application
1. **Run the client**: 
   ```bash
   cd client
   npm run dev
   ```

2. **Run the server**:
   ```bash
   cd server
   node server.js
   ```
3. Open your browser and navigate to: `http://localhost:5173/`


---

## Contributors
This project is made possible thanks to the following contributors:

| Name           | LinkedIn                                          | GitHub                                 |
|----------------|---------------------------------------------------|----------------------------------------|
| Tünde Bak      | [LinkedIn](https://www.linkedin.com/in/tunde-bak) | [GitHub](https://github.com/pixhy)     |
| Péter Právics  | [LinkedIn](https://www.linkedin.com/in/pr%C3%A1vics-p%C3%A9ter-760265330/) | [GitHub](https://github.com/prvics) |
| Kristóf Nyikes | [LinkedIn](https://www.linkedin.com/in/krist%C3%B3f-nyikes-31121133a/) | [GitHub](https://github.com/kristofNyikes) |

Feel free to connect with us on LinkedIn or check out our other projects on GitHub!

