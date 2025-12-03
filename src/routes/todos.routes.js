const { Router } = require("express");
const ctrl = require("../controllers/todos.controller");

const router = Router();

router.get("/", ctrl.list);
router.post("/", ctrl.create);
router.patch("/:id", ctrl.update);
router.post("/:id/toggle", ctrl.toggle);
router.delete("/:id", ctrl.remove);

module.exports = router;
