const { Sequelize } = require("sequelize");

const sequelize = new Sequelize("crud", "root", "", {
  host: "localhost",
  logging: false,
  dialect: "mysql",
});

(async () => {
  try {
    await sequelize.authenticate();
    console.log("Connected Successfully");
  } catch (err) {
    console.log("Not connected :", err);
  }
})();

module.exports = sequelize;
