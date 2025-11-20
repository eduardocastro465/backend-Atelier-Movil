const { Post, Like, Comentario, Guardado } = require("../Models/social");

/* ---------- POSTS ---------- */
exports.crearPost = async (req, res) => {
  try {
    console.log(req.body)
    const { usuariaId, imagenUrl, descripcion, etiqueta } = req.body;
    const post = await Post.create({ usuariaId, imagenUrl, descripcion, etiqueta });
    res.status(201).json(post);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.listarPosts = async (req, res) => {
  try {
    const posts = await Post.find({ aprobado: true })
      .populate("usuariaId", "nombre fotoDePerfil")
      .sort({ fecha: -1 });
    res.json(posts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};
exports.listarPostsNoAprobados = async (req, res) => {
  try {
    const posts = await Post.find({ aprobado: false })
      .populate("usuariaId", "nombre fotoDePerfil")
      .sort({ fecha: -1 });
    res.json(posts);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.aprobarPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { aprobado: true },
      { new: true }
    );
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    res.json(post);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.eliminarPost = async (req, res) => {
  try {
    const post = await Post.findByIdAndDelete(req.params.id);
    if (!post) return res.status(404).json({ error: "Post no encontrado" });
    await Like.deleteMany({ postId: post._id });
    await Comentario.deleteMany({ postId: post._id });
    await Guardado.deleteMany({ postId: post._id });
    res.json({ msg: "Post eliminado" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ---------- LIKES ---------- */
exports.darLike = async (req, res) => {
  try {
    const { postId, usuariaId } = req.body;
    const like = await Like.create({ postId, usuariaId });
    res.status(201).json(like);
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ error: "Ya diste like" });
    res.status(400).json({ error: e.message });
  }
};

exports.quitarLike = async (req, res) => {
  try {
    const { postId, usuariaId } = req.body;
    await Like.findOneAndDelete({ postId, usuariaId });
    res.json({ msg: "Like eliminado" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ---------- COMENTARIOS ---------- */
exports.comentar = async (req, res) => {
  try {
    const { postId, usuariaId, texto } = req.body;
    const c = await Comentario.create({ postId, usuariaId, texto });
    res.status(201).json(c);
  } catch (e) {
    res.status(400).json({ error: e.message });
  }
};

exports.listarComentarios = async (req, res) => {
  try {
    const coments = await Comentario.find({ postId: req.params.postId })
      .populate("usuariaId", "nombre fotoDePerfil")
      .sort({ fecha: -1 });
    res.json(coments);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.borrarComentario = async (req, res) => {
  try {
    await Comentario.findByIdAndDelete(req.params.id);
    res.json({ msg: "Comentario eliminado" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

/* ---------- GUARDADOS ---------- */
exports.guardarPost = async (req, res) => {
  try {
    const { usuariaId, postId } = req.body;
    const g = await Guardado.create({ usuariaId, postId });
    res.status(201).json(g);
  } catch (e) {
    if (e.code === 11000) return res.status(400).json({ error: "Ya guardado" });
    res.status(400).json({ error: e.message });
  }
};

exports.quitarGuardado = async (req, res) => {
  try {
    const { usuariaId, postId } = req.body;
    await Guardado.findOneAndDelete({ usuariaId, postId });
    res.json({ msg: "Guardado eliminado" });
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};

exports.misGuardados = async (req, res) => {
  try {
    const guardados = await Guardado.find({ usuariaId: req.params.usuariaId })
      .populate("postId")
      .sort({ fecha: -1 });
    res.json(guardados);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
};