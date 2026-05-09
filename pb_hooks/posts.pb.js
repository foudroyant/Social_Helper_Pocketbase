// pb_hooks/routes.pb.js

routerAdd("POST", "/api/generate-post", (e) => {
  try {
    // 🔒 Vérifier que l'utilisateur est connecté
    const authRecord = e.auth;
    if (!authRecord) {
      throw new UnauthorizedError("Vous devez être connecté.");
    }

    // ✅ Nouvelle syntaxe PocketBase v0.23+
    const data = e.requestInfo().body;
    const idea = data["idea"] ?? "";

    if (!idea) {
      throw new BadRequestError("Vous devez envoyer l'idée principale pour créer le post.");
    }

    // Appel à l'API externe
    const response = $http.send({
      url:     "https://n8n.foudroyant.fun/webhook/social-helper-generate",
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({ idea, user_id: authRecord.id }),
      timeout: 10,
    });

    if (response.statusCode !== 200) {
      throw new BadRequestError("Erreur API externe : " + response.raw);
    }

    const result = JSON.parse(response.raw);

    return e.json(200, {
      success: true,
      data:    result,
    });

  } catch (err) {
    // Laisser passer les erreurs HTTP de PocketBase telles quelles
    if (err instanceof BadRequestError || err instanceof UnauthorizedError) {
      throw err;
    }
    // Erreur inattendue
    throw new BadRequestError("Erreur inattendue : " + err.message);
  }
});