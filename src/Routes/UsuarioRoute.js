const express = require("express");
const router = express.Router();
const UsuarioController = require("../Controllers/usuarioController");
const upload = require("../middleware/multer");

// agrega cliente
router.post("/", UsuarioController.crearUsuario);
// router.get("/asignarLocalidadesAleatorias", UsuarioController.asignarLocalidadesAleatorias);
// router.get("/contarUsuariosPorLocalidad", UsuarioController.contarUsuariosPorLocalidad);
router.post("/reportes/:id", UsuarioController.crearReporte);
router.post("/check-email", UsuarioController.checkEmail);
router.post("/check-telefono", UsuarioController.checkTelefono);

router.post("/check-code", UsuarioController.checkCode);

router.put("/editarUsuario/:id" , upload.none(), UsuarioController.editarUsuario);
router.put("/editarUsuario/:id/con-foto/", upload.single('profileImg'), UsuarioController.subirFotoDelUsuario);
router.get("/fotoDePerfil/:id", UsuarioController.consulrarPerfilUsuarioId);
router.delete("/:id", UsuarioController.eliminarUsuario);

// router.get("/", UsuarioController.clienteRoute);
router.put("/actualizaRol/:id", UsuarioController.actualizaRolUsuario);
router.put("/actualiza/:id", UsuarioController.actualizaDatos);
// router.delete("/deleteCliente/:id", UsuarioController.eliminarCliente);
// obtener detalles del cliente por id
router.get("/:id", UsuarioController.obtenerUsuarioById);
// obtener todos los clientes registrados
// router.get("/", UsuarioController.obtenerUsuarios);
// busca un usuario por correo
router.get("/:correo", UsuarioController.buscaUsuarioByCorreo);
router.put("/actualizaxCorreo", UsuarioController.actualizarPasswordxCorreo);
router.put(
  "/actualizaxPregunta",
  UsuarioController.actualizarPasswordxPregunta
);
router.post("/token", UsuarioController.BuscaUsuarioByToken);
router.post("/correo", UsuarioController.BuscaUsuarioByCorreo);
router.get("/miPerfil/:correo", UsuarioController.perfilUsuario);
router.post("/respuesta", UsuarioController.BuscaUsuarioByPreguntayRespuesta);
// router.post("/signIn", UsuarioController.Login);
// router.post("/crearVariosUsuarios", UsuarioController.crearVariosUsuarios);
router.get("/", UsuarioController.obtenerUsuarios);
module.exports = router;
