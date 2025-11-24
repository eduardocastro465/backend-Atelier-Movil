// En tu archivo de rutas (socialRoutes.js)

const express = require('express');
const router = express.Router();
const postController = require('../controllers/socialController');

// Rutas para posts completos
router.get('/posts-completos', postController.listarPostsCompletos);
router.get('/posts-aprobados', postController.listarPostsAprobados);
router.get('/posts-pendientes', postController.listarPostsPendientes);
router.get('/posts-usuario/:usuariaId', postController.listarPostsPorUsuaria);
router.get('/posts-con-like/:usuariaId', postController.postsConLikeDeUsuaria);
router.get('/post-completo/:id', postController.detallePostCompleto);

// Rutas existentes (mantener estas)
router.post('/crear', postController.crearPost);
router.get('/:id', postController.detallePostById);
router.get('/', postController.listarPosts);
router.get('/no-aprobados', postController.listarPostsNoAprobados);
router.put('/aprobar/:id', postController.aprobarPost);
router.delete('/:id', postController.eliminarPost);
router.put('/editar/:id', postController.editarPost);

// Likes
router.post('/:usuariaId/like', postController.darLike);
router.delete('/:usuariaId/like', postController.quitarLike);
router.get('/likes/:usuariaId', postController.misLikes);

// Comentarios
router.post('/comentarios', postController.comentar);
router.get('/comentarios/:postId', postController.listarComentarios);
router.delete('/comentarios/:id', postController.borrarComentario);

// Guardados
router.post('/guardados', postController.guardarPost);
router.delete('/guardados', postController.quitarGuardado);
router.get('/guardados/:usuariaId', postController.misGuardados);

// Posts con detalles (ya existente)
router.get('/post-detalles', postController.listarPostsConLikes);

module.exports = router;