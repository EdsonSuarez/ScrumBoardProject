const express = require("express");
const router = express.Router();
const bcrypt = require("bcrypt");

const User = require("../models/user");
const Role = require("../models/role");
const Auth = require("../middleware/auth");
const UserAuth = require("../middleware/user");
const AdminAuth = require("../middleware/admin");
const mongoose = require("mongoose");

// register user
router.post("/registerUser", async (req, res) => {
  if (!req.body.name || !req.body.email || !req.body.password)
    return res.status(401).send("Process failed: Incomplete data");

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(401)
      .send("Process failed: The user is already registered");

  const hash = await bcrypt.hash(req.body.password, 10);

  const role = await Role.findOne({ name: "user" });
  if (!role)
    return res.status(400).send("Process failed: No role was assigned");

  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash,
    roleId: role._id,
    active: true,
  });

  try {
    const result = await user.save();
    if (!result) return res.status(401).send("Failed to register user");
    const jwtToken = user.generateJWT();
    console.log(jwtToken);
    res.status(200).send({ jwtToken });
  } catch (error) {
    return res.status(400).send("Failed to register user");
  }
});

router.post("/registerAdmin", Auth, UserAuth, AdminAuth, async (req, res) => {
  if (
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.roleId
  )
    return res.status(400).send("Process failed: Incomplete data");

  let user = await User.findOne({ email: req.body.email });
  if (user)
    return res
      .status(401)
      .send("Process failed: The user is already registered");

  const validRol = await Role.findOne({ name: req.body.roleId });
  if (!validRol) return res.status(401).send("Invlaid role");

  const hash = await bcrypt.hash(req.body.password, 10);
  user = new User({
    name: req.body.name,
    email: req.body.email,
    password: hash,
    roleId: validRol._id,
    active: true,
  });

  try {
    const result = await user.save();
    if (!result) return res.status(401).send("Failed to register user");
    const jwtToken = user.generateJWT();
    res.status(200).send({ jwtToken });
  } catch (e) {
    return res.status(400).send("Failed to register user");
  }
});

router.get("/listUsers/:name?", Auth, UserAuth, AdminAuth, async (req, res) => {
  const users = await User.find({ name: new RegExp(req.params["name"], "i") })
    .populate("roleId")
    .exec();
  if (!users) return res.status(401).send("Process failed: No users");
  return res.status(200).send({ users });
});

router.get("/getUser/:_id", Auth, UserAuth, AdminAuth, async (req, res) => {
  const validId = mongoose.Types.ObjectId.isValid(req.params._id);
  if (!validId) return res.status(401).send("Process failed: Invalid id");
  const users = await User.findById(req.params._id).populate("roleId").exec();
  if (!users) return res.status(401).send("Process failed: No users");
  users.password = "";
  return res.status(200).send({ users });
});

router.get("/emailUser/:email", Auth, UserAuth, AdminAuth, async (req, res) => {
  const users = await User.find({ email: req.params["email"] });
  if (!users) return res.status(401).send("Process failed: No email of user");
  return res.status(200).send({ users });
});

router.put("/updateUser", Auth, UserAuth, AdminAuth, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.email ||
    !req.body.roleId
  )
    return res.status(401).send("Process failed: Incomplete data");

  const validId = mongoose.Types.ObjectId.isValid(req.body._id);
  if (!validId) return res.status(401).send("Process failed: Invalid id");

  const validRol = await Role.findOne({ name: req.body.roleId });
  if (!validRol) return res.status(401).send("Invlaid role");

  let hash = await User.findById(req.body._id);
  hash = hash.password;
  if (req.body.password) hash = await bcrypt.hash(req.body.password, 10);

  const user = await User.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: hash,
    roleId: validRol._id,
    active: req.body.active,
  });
  if (!user) return res.status(401).send("Process failed: Error editing User");
  return res.status(200).send({ user });
});

router.put("/deleteUser", Auth, UserAuth, AdminAuth, async (req, res) => {
  if (
    !req.body._id ||
    !req.body.name ||
    !req.body.email ||
    !req.body.password ||
    !req.body.roleId
  )
    return res.status(401).send("Process failed: Incomplete data");

  const hash = await bcrypt.hash(req.body.password, 10);

  const user = await User.findByIdAndUpdate(req.body._id, {
    name: req.body.name,
    email: req.body.email,
    password: hash,
    roleId: req.body.roleId,
    active: false,
  });
  if (!user) return res.status(401).send("Process failed: Error delete User");
  return res.status(200).send({ user });
});

router.delete(
  "/deleteUser/:_id",
  Auth,
  UserAuth,
  AdminAuth,
  async (req, res) => {
    const validId = mongoose.Types.ObjectId.isValid(req.params._id);
    if (!validId) return res.status(401).send("Process failed: Invalid id");

    const users = await User.findByIdAndDelete(req.params._id);
    if (!users) return res.status(401).send("Failed to delete user");

    return res.status(200).send({ message: "User deleted" });
  }
);

module.exports = router;
