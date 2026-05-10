// pb_hooks/save_system_prompt.pb.js

routerAdd("POST", "/api/save-system-prompt", (e) => {
  try {
    // 🔒 Vérifier que l'utilisateur est connecté
    const authRecord = e.auth;
    if (!authRecord) {
      throw new UnauthorizedError("Vous devez être connecté.");
    }

    // Lire le body de la requête
    const data = e.requestInfo().body;
    const pageId       = data["page_id"]       ?? "";
    const systemPrompt = data["system_prompt"] ?? "";

    if (!pageId || !systemPrompt) {
      throw new BadRequestError("page_id et system_prompt sont requis.");
    }

    // 📡 Envoyer à n8n
    const response = $http.send({
      url:     "https://n8n.foudroyant.fun/webhook/save-system-prompt", // 🔁 ton URL n8n
      method:  "POST",
      headers: { "Content-Type": "application/json" },
      body:    JSON.stringify({
        page_id:       pageId,
        system_prompt: systemPrompt,
        user_id:       authRecord.id,
      }),
      timeout: 10,
    });

    if (response.statusCode !== 200) {
      throw new BadRequestError("Erreur n8n : " + response.raw);
    }

    // ✅ Retourner la réponse de n8n telle quelle à la vue
    return e.json(200, JSON.parse(response.raw));

  } catch (err) {
    if (err instanceof BadRequestError || err instanceof UnauthorizedError) {
      throw err;
    }
    throw new BadRequestError("Erreur inattendue : " + err.message);
  }
});