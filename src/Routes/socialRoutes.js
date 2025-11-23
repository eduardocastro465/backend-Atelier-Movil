const express = require('express');
const router = express.Router();
const ctrl = require("../Controllers/socialController");

const upload = require("../middleware/multer");
// ======================
// Rutas de posts
// ======================
// Crear post con múltiples imágenes (CORREGIDO)
router.post("/", upload.fields([{ name: "imagenes", maxCount: 10 }]), ctrl.crearPost);
router.get("/no-aprobados", ctrl.listarPostsNoAprobados);
router.get("/detalle/:id", ctrl.detallePostById);
router.get("/likes/:usuariaId", ctrl.misLikes);
router.get("/aprobados", ctrl.listarPosts);


// Editar post con múltiples imágenes (CORREGIDO)
router.put(
  "/:id",
  upload.fields([{ name: "imagenes", maxCount: 10 }]),
  ctrl.editarPost
);

router.post("/:id/aprobar", ctrl.aprobarPost);
router.delete("/:id", ctrl.eliminarPost);

// ======================
// Rutas de interacciones
// ======================
router.post("/likes", ctrl.darLike);
router.delete("/likes", ctrl.quitarLike);

router.post("/comentarios", ctrl.comentar);
router.get("/comentarios/:postId", ctrl.listarComentarios);
router.delete("/comentarios/:id", ctrl.borrarComentario);

router.post("/guardados", ctrl.guardarPost);
router.delete("/guardados", ctrl.quitarGuardado);

module.exports = router;
