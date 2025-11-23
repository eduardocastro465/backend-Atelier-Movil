const fs = require("fs-extra");
const cloudinary = require("cloudinary").v2;
const { Post, Like, Comentario, Guardado } = require("../Models/social");

// Configuración de Cloudinary
cloudinary.config({
  cloud_name: "dvvhnrvav",
  api_key: "982632489651298",
  api_secret: "TTIZcgIMiC8F4t8cE-t6XkQnPyQ",
});

/* ---------- POSTS ---------- */
/* ---------- POSTS ---------- */
exports.crearPost = async (req, res) => {
  console.log("=== INICIANDO crearPost ===");
  console.log("📥 Headers:", req.headers);
  console.log("📦 Body recibido:", JSON.stringify(req.body, null, 2));
  console.log("🖼️ Archivos en req.files:", req.files ? JSON.stringify(Object.keys(req.files)) : 'No hay files');

  try {
    const { usuariaId, descripcion, etiqueta } = req.body;
    const imagenesUrls = [];

    const imagenes = req.files?.imagenes;

    if (req.files?.imagenes) {
      console.log(`📸 Cantidad de imágenes recibidas: ${req.files.imagenes.length}`);
      
      for (const imagenFile of req.files.imagenes) {
        console.log("\n===============================");
        console.log("📝 Archivo recibido:");
        console.log("Nombre:", imagenFile.originalname);
        console.log("Tipo:", imagenFile.mimetype);
        console.log("Ruta temporal:", imagenFile.path);
        console.log("Tamaño:", imagenFile.size);
        console.log("===============================\n");
      }
    } else {
      console.log("❌ Debug → NO llegaron archivos en req.files.imagenes");
    }

    for (const imagenFile of imagenes) {
      try {
        console.log(`☁️ Subiendo imagen a Cloudinary: ${imagenFile.originalname}`);
        const resultado = await cloudinary.uploader.upload(imagenFile.path, {
          folder: "PostsAtelier",
        });
        
        console.log(`✅ Imagen subida exitosamente: ${resultado.secure_url}`);
        imagenesUrls.push(resultado.secure_url);

        await fs.unlink(imagenFile.path);
        console.log(`🗑️ Archivo temporal eliminado: ${imagenFile.path}`);
      } catch (uploadError) {
        console.error("❌ Error al subir imagen:", uploadError);
      }
    }

    if (imagenesUrls.length === 0) {
      console.log("❌ No se pudieron procesar las imágenes");
      return res.status(400).json({ error: "Error al procesar imágenes" });
    }

    console.log(`📸 URLs generadas: ${imagenesUrls.length} imágenes`);
    console.log("💾 Creando post en la base de datos...");

    const post = await Post.create({
      usuariaId,
      imagenUrls: imagenesUrls,
      descripcion,
      etiqueta,
    });

    console.log("✅ Post creado exitosamente con ID:", post._id);
    res.status(201).json({ message: "Post creado exitosamente", post });

  } catch (error) {
    console.error("❌ Error general en crearPost:", error);

    if (req.files?.imagenes) {
      for (const img of req.files.imagenes) {
        try {
          await fs.unlink(img.path);
          console.log(`🗑️ Archivo temporal limpiado: ${img.path}`);
        } catch (err) { }
      }
    }

    res.status(500).json({ error: "Ocurrió un error al crear el post" });
  }
};


// *******************
//detallePostById
// *******************
exports.detallePostById = async (req, res) => {
  console.log("=== INICIANDO detallePostById ===");
  console.log("📥 ID recibido en params:", req.params.id);

  try {
    const post = await Post.findById(req.params.id).populate(
      "usuariaId",
      "nombre fotoDePerfil"
    );

    if (!post) {
      console.log("❌ Post no encontrado en la base de datos");
      return res.status(404).json({ error: "Post no encontrado" });
    }

    console.log("✅ Post encontrado:", post._id);
    res.json(post);
  } catch (e) {
    console.error("❌ Error en detallePostById:", e.message);
    res.status(500).json({ error: e.message });
  }
};

exports.listarPosts = async (req, res) => {
  console.log("=== INICIANDO listarPosts (aprobados) ===");

  try {
    const posts = await Post.find({ aprobado: true })
      .populate("usuariaId", "nombre fotoDePerfil")
      .sort({ fecha: -1 });
    
    console.log(`✅ Se encontraron ${posts.length} posts aprobados`);
    res.json(posts);
  } catch (e) {
    console.error("❌ Error en listarPosts:", e.message);
    res.status(500).json({ error: e.message });
  }
};

exports.listarPostsNoAprobados = async (req, res) => {
  console.log("=== INICIANDO listarPostsNoAprobados ===");

  try {
    const posts = await Post.find({ aprobado: false })
      .populate("usuariaId", "nombre fotoDePerfil")
      .sort({ fecha: -1 });
    
    console.log(`✅ Se encontraron ${posts.length} posts pendientes de aprobación`);
    res.json(posts);
  } catch (e) {
    console.error("❌ Error en listarPostsNoAprobados:", e.message);
    res.status(500).json({ error: e.message });
  }
};

exports.aprobarPost = async (req, res) => {
  console.log("=== INICIANDO aprobarPost ===");
  console.log("📥 ID recibido en params:", req.params.id);

  try {
    const post = await Post.findByIdAndUpdate(
      req.params.id,
      { aprobado: true },
      { new: true }
    );
    
    if (!post) {
      console.log("❌ Post no encontrado para aprobar");
      return res.status(404).json({ error: "Post no encontrado" });
    }
    
    console.log("✅ Post aprobado exitosamente:", post._id);
    res.json(post);
  } catch (e) {
    console.error("❌ Error en aprobarPost:", e.message);
    res.status(500).json({ error: e.message });
  }
};

exports.eliminarPost = async (req, res) => {
  console.log("=== INICIANDO eliminarPost ===");
  console.log("📥 ID recibido en params:", req.params.id);

  try {
    const post = await Post.findById(req.params.id);
    if (!post) {
      console.log("❌ Post no encontrado para eliminar");
      return res.status(404).json({ error: "Post no encontrado" });
    }

    console.log("🗑️ Post encontrado, eliminando", post.imagenUrls.length, "imagenes de Cloudinary...");

    if (post.imagenUrls && post.imagenUrls.length > 0) {
      for (const url of post.imagenUrls) {
        try {
          const urlParts = url.split('/');
          const publicIdWithExtension = urlParts[urlParts.length - 1];
          const publicId = publicIdWithExtension.split('.')[0];
          const fullPublicId = `PostsAtelier/${publicId}`;

          await cloudinary.uploader.destroy(fullPublicId);
          console.log(`🗑️ Imagen eliminada de Cloudinary: ${fullPublicId}`);
        } catch (error) {
          console.error("❌ Error al eliminar imagen de Cloudinary:", error);
        }
      }
    }

    console.log("🗑️ Eliminando documento del post y referencias...");
    await Post.findByIdAndDelete(req.params.id);
    await Like.deleteMany({ postId: post._id });
    await Comentario.deleteMany({ postId: post._id });
    await Guardado.deleteMany({ postId: post._id });

    console.log("✅ Post eliminado completamente:", req.params.id);
    res.json({ msg: "Post eliminado correctamente" });
  } catch (e) {
    console.error("❌ Error en eliminarPost:", e.message);
    res.status(500).json({ error: e.message });
  }
};

/* ---------- LIKES ---------- */
exports.darLike = async (req, res) => {
  console.log("=== INICIANDO darLike ===");
  console.log("📥 Body recibido:", req.body);

  try {
    const { postId, usuariaId } = req.body;
    const like = await Like.create({ postId, usuariaId });
    
    console.log("✅ Like creado exitosamente:", like._id);
    res.status(201).json(like);
  } catch (e) {
    console.error("❌ Error en darLike:", e.message);
    if (e.code === 11000) return res.status(400).json({ error: "Ya diste like" });
    res.status(400).json({ error: e.message });
  }
};

exports.quitarLike = async (req, res) => {
  console.log("=== INICIANDO quitarLike ===");
  console.log("📥 Body recibido:", req.body);

  try {
    const { postId, usuariaId } = req.body;
    const result = await Like.findOneAndDelete({ postId, usuariaId });
    
    console.log(result ? "✅ Like eliminado" : "⚠️ Like no encontrado");
    res.json({ msg: "Like eliminado" });
  } catch (e) {
    console.error("❌ Error en quitarLike:", e.message);
    res.status(500).json({ error: e.message });
  }
};

/* ---------- COMENTARIOS ---------- */
exports.comentar = async (req, res) => {
  console.log("=== INICIANDO comentar ===");
  console.log("📥 Body recibido:", req.body);

  try {
    const { postId, usuariaId, texto } = req.body;
    const c = await Comentario.create({ postId, usuariaId, texto });
    
    console.log("✅ Comentario creado exitosamente:", c._id);
    res.status(201).json(c);
  } catch (e) {
    console.error("❌ Error en comentar:", e.message);
    res.status(400).json({ error: e.message });
  }
};

exports.listarComentarios = async (req, res) => {
  console.log("=== INICIANDO listarComentarios ===");
  console.log("📥 postId recibido en params:", req.params.postId);

  try {
    const coments = await Comentario.find({ postId: req.params.postId })
      .populate("usuariaId", "nombre fotoDePerfil")
      .sort({ fecha: -1 });
    
    console.log(`✅ Se encontraron ${coments.length} comentarios`);
    res.json(coments);
  } catch (e) {
    console.error("❌ Error en listarComentarios:", e.message);
    res.status(500).json({ error: e.message });
  }
};

exports.borrarComentario = async (req, res) => {
  console.log("=== INICIANDO borrarComentario ===");
  console.log("📥 ID recibido en params:", req.params.id);

  try {
    await Comentario.findByIdAndDelete(req.params.id);
    console.log("✅ Comentario eliminado:", req.params.id);
    res.json({ msg: "Comentario eliminado" });
  } catch (e) {
    console.error("❌ Error en borrarComentario:", e.message);
    res.status(500).json({ error: e.message });
  }
};

/* ---------- EDICIÓN DE POSTS ---------- */
exports.editarPost = async (req, res) => {
  console.log("=== INICIANDO editarPost ===");
  console.log("📥 ID recibido en params:", req.params.id);
  console.log("📦 Body recibido:", req.body);
  console.log("🖼️ Archivos en req.files:", req.files ? req.files.length : 'No hay files');

  try {
    const { id } = req.params;
    const { usuariaId, descripcion, etiqueta } = req.body;

    const postExistente = await Post.findById(id);
    if (!postExistente) {
      console.log("❌ Post no encontrado");
      return res.status(404).json({ error: "Post no encontrado" });
    }

    console.log("✅ Post encontrado, ID:", postExistente._id);
    console.log("📸 Imágenes actuales:", postExistente.imagenUrls.length);

    let imagenesUrls = postExistente.imagenUrls;

    if (req.files && req.files.length > 0) {
      console.log(`📤 Procesando ${req.files.length} nuevas imágenes...`);
      const nuevasUrls = [];

      for (const imagenFile of req.files) {
        try {
          console.log(`☁️ Subiendo a Cloudinary: ${imagenFile.originalname}`);
          const resultado = await cloudinary.uploader.upload(imagenFile.path, {
            folder: "PostsAtelier",
          });
          nuevasUrls.push(resultado.url);
          console.log(`✅ Nueva imagen subida: ${resultado.url}`);

          await fs.unlink(imagenFile.path);
          console.log(`🗑️ Archivo temporal eliminado: ${imagenFile.path}`);
        } catch (uploadError) {
          console.error("❌ Error al subir imagen a Cloudinary:", uploadError);
        }
      }

      console.log("🗑️ Eliminando imágenes antiguas de Cloudinary...");
      if (postExistente.imagenUrls && postExistente.imagenUrls.length > 0) {
        for (const url of postExistente.imagenUrls) {
          try {
            const urlParts = url.split('/');
            const publicIdWithExtension = urlParts[urlParts.length - 1];
            const publicId = publicIdWithExtension.split('.')[0];
            const fullPublicId = `PostsAtelier/${publicId}`;

            await cloudinary.uploader.destroy(fullPublicId);
            console.log(`🗑️ Imagen anterior eliminada: ${fullPublicId}`);
          } catch (error) {
            console.error("❌ Error al eliminar imagen anterior:", error);
          }
        }
      }

      imagenesUrls = nuevasUrls;
    } else {
      console.log("ℹ️ No se subieron nuevas imágenes, manteniendo las actuales");
    }

    console.log("💾 Actualizando post en la base de datos...");
    const postActualizado = await Post.findByIdAndUpdate(
      id,
      {
        usuariaId,
        imagenUrls: imagenesUrls,
        descripcion,
        etiqueta,
        fecha: new Date()
      },
      { new: true }
    ).populate("usuariaId", "nombre fotoDePerfil");

    console.log("✅ Post actualizado exitosamente:", postActualizado._id);
    res.json({ message: "Post actualizado exitosamente", post: postActualizado });

  } catch (error) {
    console.error("❌ Error general en editarPost:", error);

    if (req.files && req.files.length > 0) {
      for (const imagenFile of req.files) {
        try {
          await fs.unlink(imagenFile.path);
          console.log(`🗑️ Archivo temporal limpiado: ${imagenFile.path}`);
        } catch (err) {
          console.error(`No se pudo eliminar archivo temporal: ${imagenFile.path}`, err);
        }
      }
    }

    res.status(500).json({ error: "Ocurrió un error al actualizar el post" });
  }
};

/* ---------- GUARDADOS ---------- */
exports.guardarPost = async (req, res) => {
  console.log("=== INICIANDO guardarPost ===");
  console.log("📥 Body recibido:", req.body);

  try {
    const { usuariaId, postId } = req.body;
    const g = await Guardado.create({ usuariaId, postId });
    
    console.log("✅ Post guardado exitosamente:", g._id);
    res.status(201).json(g);
  } catch (e) {
    console.error("❌ Error en guardarPost:", e.message);
    if (e.code === 11000) return res.status(400).json({ error: "Ya guardado" });
    res.status(400).json({ error: e.message });
  }
};

exports.quitarGuardado = async (req, res) => {
  console.log("=== INICIANDO quitarGuardado ===");
  console.log("📥 Body recibido:", req.body);

  try {
    const { usuariaId, postId } = req.body;
    const result = await Guardado.findOneAndDelete({ usuariaId, postId });
    
    console.log(result ? "✅ Guardado eliminado" : "⚠️ Guardado no encontrado");
    res.json({ msg: "Guardado eliminado" });
  } catch (e) {
    console.error("❌ Error en quitarGuardado:", e.message);
    res.status(500).json({ error: e.message });
  }
};

exports.misGuardados = async (req, res) => {
  console.log("=== INICIANDO misGuardados ===");
  console.log("📥 usuariaId recibido en params:", req.params.usuariaId);

  try {
    const guardados = await Guardado.find({ usuariaId: req.params.usuariaId })
      .populate("postId")
      .sort({ fecha: -1 });
    
    console.log(`✅ Se encontraron ${guardados.length} posts guardados`);
    res.json(guardados);
  } catch (e) {
    console.error("❌ Error en misGuardados:", e.message);
    res.status(500).json({ error: e.message });
  }
};

exports.misLikes = async (req, res) => {
  console.log("=== INICIANDO misLikes ===");
  console.log("📥 usuariaId recibido en params:", req.params.usuariaId);

  try {
    const likes = await Like.find({ usuariaId: req.params.usuariaId })
      .populate("postId")
      .populate("usuariaId");

    console.log(`✅ Se encontraron ${likes.length} likes`);
    res.json(likes);
  } catch (e) {
    console.error("❌ Error en misLikes:", e.message);
    res.status(500).json({ error: e.message });
  }
};