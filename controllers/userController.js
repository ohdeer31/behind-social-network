const mongoose = require("mongoose");
const { User, Thought } = require("../models");

// Aggregate function to get the number of friends overall
const headCount = async () =>
  User.aggregate()
    .count("headCount")
    .then((numberOfUsers) => numberOfUsers);

module.exports = {
  // Get all users
  getUsers(req, res) {
    User.find()
      .then(async (users) => {
        const userObj = {
          users,
          headCount: await headCount(),
          // friendCount,
        };
        return res.json(userObj);
      })
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // Get a single user
  getSingleUser(req, res) {
    User.findOne({ _id: req.params.userId })
      .select("-__v")
      .then(async (user) =>
        !user
          ? res.status(404).json({ message: "No user with that ID" })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        return res.status(500).json(err);
      });
  },
  // create a new user
  createUser(req, res) {
    User.create(req.body)
      .then((user) => res.json(user))
      .catch((err) => res.status(500).json(err));
  },
  // Delete a user and remove them from the course
  deleteUser(req, res) {
    User.findOneAndRemove({ _id: req.params.userId })
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },
  updateUser(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $set: req.body },
      { runValidators: true, new: true }
    )
      .then((user) => res.json(user))
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  addFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $addToSet: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Application created, but found no user with that ID",
            })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  deleteFriend(req, res) {
    User.findOneAndUpdate(
      { _id: req.params.userId },
      { $pull: { friends: req.params.friendId } },
      { new: true }
    )
      .then((user) =>
        !user
          ? res.status(404).json({
              message: "Application created, but found no user with that ID",
            })
          : res.json(user)
      )
      .catch((err) => {
        console.log(err);
        res.status(500).json(err);
      });
  },

  // Add an assignment to a student
  //   addAssignment(req, res) {
  //     console.log("You are adding an assignment");
  //     console.log(req.body);
  //     Student.findOneAndUpdate(
  //       { _id: req.params.studentId },
  //       { $addToSet: { assignments: req.body } },
  //       { runValidators: true, new: true }
  //     )
  //       .then((student) =>
  //         !student
  //           ? res
  //               .status(404)
  //               .json({ message: "No student found with that ID :(" })
  //           : res.json(student)
  //       )
  //       .catch((err) => res.status(500).json(err));
  //   },
  //   // Remove assignment from a student
  //   removeAssignment(req, res) {
  //     Student.findOneAndUpdate(
  //       { _id: req.params.studentId },
  //       { $pull: { assignment: { assignmentId: req.params.assignmentId } } },
  //       { runValidators: true, new: true }
  //     )
  //       .then((student) =>
  //         !student
  //           ? res
  //               .status(404)
  //               .json({ message: "No student found with that ID :(" })
  //           : res.json(student)
  //       )
  //       .catch((err) => res.status(500).json(err));
  //   },
};
