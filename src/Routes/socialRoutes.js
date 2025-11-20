const express = require('express');
const router = express.Router();
const ctrl = require("../Controllers/socialController");
router.post("/", ctrl.crearPost);
router.get("/aprobados", ctrl.listarPosts);
router.get("/no-aprobados",ctrl.listarPostsNoAprobados)
router.post("/likes", ctrl.darLike);
router.post("/comentarios", ctrl.comentar);
router.get("/comentarios/:postId", ctrl.listarComentarios);
router.post("/guardados", ctrl.guardarPost);
router.delete("/likes", ctrl.quitarLike);
router.delete("/comentarios/:id", ctrl.borrarComentario);
router.delete("/guardados", ctrl.quitarGuardado);
router.get("/guardados/:usuariaId", ctrl.misGuardados);
router.post("/:id/aprobar", ctrl.aprobarPost);
router.delete("/:id", ctrl.eliminarPost);

module.exports = router;