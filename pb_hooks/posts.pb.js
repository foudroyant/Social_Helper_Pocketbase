// pb_hooks/posts.pb.js
routerAdd("POST", "/api/generate-post", (e) => {
  // 🔒 Vérifier que l'utilisateur est connecté
  const authRecord = e.auth;
  if (!authRecord) {
    throw new UnauthorizedError("Vous devez être connecté.");
  }

  // Lire le body de la requête
  const data = $apis.requestInfo(e).body;
  const idea = data["idea"] ?? "";

  if (!idea) {
    throw new BadRequestError("Vous devez envoyer l'idée principale pour créer le post.");
  }

  // Appel à ton API externe
  const response = $http.send({
    url:     "https://n8n.foudroyant.fun/webhook/social-helper-generate",  // 🔁 remplace par ton URL
    method:  "POST",
    headers: { "Content-Type": "application/json" },
    body:    JSON.stringify({ idea, user_id : authRecord.id }),
    timeout: 10,
  });

  if (response.statusCode !== 200) {
    throw new BadRequestError("Erreur API externe : " + response.raw);
  }

  const result = JSON.parse(response.raw);

  // Retourner le résultat au client
  return e.json(200, {
    success: true,
    data:    result,
  });
});