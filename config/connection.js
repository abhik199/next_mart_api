const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("NEXT_MART", "root", "", {
  host: "localhost",
  dialect: "mysql",
  logging: false,
});

try {
  sequelize.authenticate();
  console.log("db connected");
} catch (error) {
  console.error("Db connection failed");
}

module.exports = sequelize;
