# Lightbeam

💡 Import Lightbeam data from different geographical locations to identify patterns and trends. 💡

## Setup

- Clone this repository
- While in the repository directory, run the following:
  - `npm install`
  - `node index.js`
- Open a browser and type `localhost:3000`
- This application highlights the countries in the world map corresponding to the data sets available in the `data` folder
- Click on a country code from the left panel to visualise the corresponding data set

## Import data

- Place the lightbeam data sets in the `data` folder
- The naming convention is `[country-code].json`
  - Example: `usa.json`
- Detailed list of country codes can be found in `src/world/world_population.tsv` file

## Notes

- This is a initial proof of concept and work in progess

![Screenshot](/docs/import.gif)
