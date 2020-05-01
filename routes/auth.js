const router = require("express").Router();
const passport = require("passport");

router.get("/:socialapp", function (req, res, next) {
  let scope = null;
  switch (req.params.socialapp) {
    case "google":
      break;
    case "github":
      scope = "user:email";
      break;
    default:
      return res.json(400, { reason: "unknown social login method" });
  }
  passport.authenticate(req.params.socialapp, {
    scope: scope,
  })(req, res, next);
});

router.get("/:socialapp/callback", function (req, res, next) {
  switch (req.params.socialapp) {
    case "google":
    case "github":
      break;
    default:
      return res.send(404);
  }

  passport.authenticate(req.params.socialapp, {
    successRedirect: "/graphql",
    failureRedirect: "/opps",
  })(req, res, next);
});

module.exports = router;
