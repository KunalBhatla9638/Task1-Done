const { QueryTypes } = require("sequelize");
const bcrypt = require("bcrypt");
const sequelize = require("../models");
const jwt = require("jsonwebtoken");

const JWT_SECRET = process.env.SECRETKEY;

const welcome = (req, res) => {
  res.send("Welcome");
};

const getUsers = async (req, res) => {
  const selectAllActiveUsers =
    "SELECT * FROM `users` WHERE status != 'inactive'";

  const selectAllUsers = "select * from users";

  const allUsers = await sequelize.query(selectAllActiveUsers, {
    type: QueryTypes.SELECT,
  });
  res.status(200).json({ Users: allUsers });
};

const postUser = async (req, res) => {
  const {
    firstname,
    lastname,
    email,
    password,
    gender,
    hobbies,
    status,
    department_id,
  } = req.body;

  if (
    !firstname ||
    !lastname ||
    !email ||
    !password ||
    !gender ||
    !hobbies ||
    !status ||
    !department_id
  ) {
    return res.status(400).json({ error: "Input Missing" });
  }

  try {
    const allUsers = await sequelize.query("select * from users", {
      type: QueryTypes.SELECT,
    });

    const checkEmail = allUsers.find((item) => item.email == email);
    if (checkEmail !== undefined) {
      res.status(409).send("Email Already Exists");
    } else {
      const salt = await bcrypt.genSalt(10);
      const securePassword = await bcrypt.hash(password, salt);
      const user = await sequelize.query(
        "INSERT INTO `users` (`firstname`, `lastname`, `email`, `password`, `gender`, `hobbies`, `status`, `department_id`) VALUES (?, ?, ?, ?, ?, ?, ?, ?);",
        {
          type: QueryTypes.INSERT,
          replacements: [
            firstname,
            lastname,
            email,
            securePassword,
            gender,
            hobbies,
            status,
            department_id,
          ],
        }
      );
      res.status(200).send("Created ");
    }
  } catch (err) {
    //res.status(409).send("Email Address Already Exists"); //409 used because of conflict in email
    console.log("Error : " + err);
  }
};

const getUser = async (req, res) => {
  const id = req.params.id;
  try {
    // const userId = await sequelize.query("select * from users where id = ?",)
    const userId = await sequelize.query(
      "SELECT * FROM users LEFT JOIN departments ON users.department_id = departments.department_id WHERE users.id = ?",
      {
        type: QueryTypes.SELECT,
        // replacements: { id: id },
        replacements: [id],
      }
    );
    if (userId.length > 0) {
      res.status(200).send(userId);
    } else {
      res.status(404).send("User Not Found");
    }
  } catch (err) {
    console.log("Error : ", err);
  }
};

const patchUpdateUser = async (req, res) => {
  const id = req.params.id;
  const data = req.body;
  try {
    const allUsers = await sequelize.query("select * from users", {
      type: QueryTypes.SELECT,
    });
    let uid = allUsers.find((item) => item.id == id);
    console.log(uid);
    if (uid !== undefined) {
      const updateUser = sequelize.query(
        "UPDATE `users` SET `firstname` = ?, `lastname` = ?, `email` = ?, `password` = ?, `gender` = ?, `hobbies` = ?, `department_id` = ? WHERE `users`.`id` = ?",
        // "UPDATE `users` SET `firstname` = ?, `lastname` = ? WHERE `users`.`id` = ?",
        {
          type: QueryTypes.UPDATE,
          replacements: [
            data.firstname ? data.firstname : uid.firstname,
            data.lastname ? data.lastname : uid.lastname,
            data.email ? data.email : uid.email,
            data.password ? data.password : uid.password,
            data.gender ? data.gender : uid.gender,
            data.hobbies ? data.hobbies : uid.hobbies,
            data.department_id ? data.department_id : uid.department_id,
            id,
          ],
        }
      );
      res.send("Updated : " + JSON.stringify(uid));
    } else {
      res.send("No Such Record");
    }
  } catch (err) {
    console.log(err);
  }
};

const getUserLogging = async (req, res) => {
  const { email, password } = req.body;
  try {
    const user = await sequelize.query(
      "SELECT id, email, password FROM `users` WHERE email = ?",
      {
        type: QueryTypes.SELECT,
        replacements: [email],
      }
    );

    if (user.length === 0) {
      return res.status(404).send("Email Not Found");
    }

    if (user != 0) {
      const passwordCompare = await bcrypt.compare(password, user[0].password);

      if (!passwordCompare) {
        res.status(401).send("Please Enter the valid credentails");
      } else {
        console.log(user[0].id);
        // const data = {
        //   user: {
        //     id: user.id,
        //   },
        // };
        const data = {
          id: user[0].id,
        };
        jwt.sign(data, JWT_SECRET, { expiresIn: "300s" }, (err, authToken) => {
          res.status(200).json({
            id: user[0].id,
            Status: "You Logged in",
            AuthToken: authToken,
          });
        });
      }
    } else {
      return res
        .status(404)
        .json({ data: "No need to Compare email not found" });
    }
  } catch (err) {
    console.log("Error Occured : " + err);
    res.status(500).json({ Error: "Internal Server Error" });
  }
};

const deleteUser = async (req, res) => {
  const id = req.params.id;
  try {
    const searchId = await sequelize.query("select * from users where id = ?", {
      type: QueryTypes.SELECT,
      replacements: [id],
    });
    if (searchId.length === 0) {
      return res.status(404).json({ ID: "Not Found" });
    }

    const uid = await sequelize.query(
      "UPDATE `users` SET `status` = 'inactive' WHERE `users`.`id` = ?",
      {
        type: QueryTypes.UPDATE,
        replacements: [id],
      }
    );
    return res.status(200).json({ id: id, status: "Record Deleted" });
  } catch (err) {
    res.status(500).json({ Error: err.message });
  }
};

const postUpload = (req, res) => {
  console.log("Image renamed to : " + req.imageName);
  res.status(200).json({ Result: "Image Uploaded Successfully " });
};

const notFoundPage = (req, res) => {
  res.send("Opps! Page Not Found");
};

module.exports = {
  welcome,
  getUsers,
  postUser,
  notFoundPage,
  getUser,
  patchUpdateUser,
  getUserLogging,
  deleteUser,
  postUpload,
};
