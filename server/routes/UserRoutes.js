const authHandler = require("./AuthHandler");
const { userService } = require("../services/UserService");
const userRouter = require("express").Router();

userRouter.get("/", [
  authHandler,
  async (req, res) => {
    const user = await userService.getUser(req.session.userId, req.session.accessToken).catch((err) => {
      console.error(`Unable to get user ${req.session.userId}`, err);
      res.status(404);
      res.send("User not found.");
    });

    if (user) {
      res.json(user);
    }
  },
]);

userRouter.get("/steps", [
  authHandler,
  async (req, res) => {
    const steps = await userService
      .getUserSteps(req.session.accessToken, req.query.lastNumDays)
      .catch((err) => {
        console.error(`Unable to get steps of user ${req.session.userId}`, err);
        res.status(500);
      });

    if (steps) {
      res.json([steps]);
    }
  },
]);

userRouter.get("/weight", [
  authHandler,
  async (req, res) => {
    const weight = await userService
      .getUserWeight(req.session.accessToken, req.query.lastNumDays)
      .catch((err) => {
        console.error(
          `Unable to get weight of user ${req.session.userId}`,
          err
        );
        res.status(500);
      });

    if (weight) {
      res.json(weight);
    }
  },
]);

userRouter.get("/meal-plan", [
  authHandler,
  async (req, res) => {
    const mealPlan = await userService
      .getMealPlan(req.session.userId, req.session.accessToken)
      .catch((err) => {
        console.error(
          `Unable to get meal plan for user ${req.session.userId}`,
          err
        );
        res.status(500);
      });

    if (mealPlan) {
      res.json(mealPlan);
    }
  },
]);

userRouter.post("/", [
  authHandler,
  async (req, res) => {
    const user = await userService.createUser(req.body).catch((err) => {
      console.error(`Unable to create user ${req.body.id}`, err);
      res.status(500);
      res.send("Unable to create user.");
    });

    if (user) {
      res.json(user);
    }
  },
]);

userRouter.patch("/", [
  authHandler,
  async (req, res) => {
    const user = await userService.updateUser(req.body).catch((err) => {
      console.error(`Unable to update user ${req.body.id}`, err);
      res.status(500);
      res.send("Unable to update user.");
    });

    if (user) {
      res.json(user);
    }
  },
]);

userRouter.post("/login", async (req, res) => {
  // Attempt to login by creating Google access token
  const loginResult = await userService.login(req.body.code);
  if (!loginResult) {
    res.status(500);
    res.send("Login failed.");
    return;
  }

  // Get Google user info and determine if user already
  // exists with that id in our database
  const googleUser = loginResult.googleUser;
  let user = await userService.getUser(googleUser.id, loginResult.token);
  let isNew = !user;

  // Store user related information in their session
  req.session.accessToken = loginResult.token;
  req.session.userId = googleUser.id;
  req.session.loggedIn = true;
  res.json({ isNew: isNew, initUser: googleUser });
});

userRouter.post("/logout", [
  authHandler,
  async (req, res) => {
    req.session.destroy(function (err) {
      if (err) {
        console.error(err);
        res.status(500);
        res.send("Logout failed. Unable to destroy server session");
      } else {
        res.send("Logout success");
      }
    });
  },
]);

userRouter.get("/loggedIn", async (req, res) => {
  res.type("application/json");
  res.json({ loggedIn: req.session.loggedIn ? req.session.loggedIn : false });
});

module.exports = userRouter;
