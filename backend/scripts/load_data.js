// server/scripts/load_data.js
const fs = require("fs");
const path = require("path");
const csv = require("csv-parser");

const mongoose = require("mongoose");
const Product = require("../models/Product"); // Import all models here

mongoose.connect("mongodb://localhost:27017/ecommerce");

function loadCSV(filePath, model) {
  return new Promise((resolve, reject) => {
    const results = [];

    fs.createReadStream(filePath)
      .pipe(csv())
      .on("data", (data) => results.push(data))
      .on("end", async () => {
        try {
          await model.insertMany(results);
          console.log(`✅ Loaded ${results.length} records into ${model.modelName}`);
          resolve();
        } catch (err) {
          console.error(`❌ Failed loading ${model.modelName}`, err);
          reject(err);
        }
      });
  });
}

async function run() {
  await loadCSV("path/to/products.csv", Product);
  // repeat for others
  mongoose.disconnect();
}

run();
