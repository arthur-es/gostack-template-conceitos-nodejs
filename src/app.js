const express = require("express");
const cors = require("cors");

const { uuid, isUuid } = require("uuidv4");

const app = express();

app.use(express.json());
app.use(cors());
app.use("/repositories/:id", validateRepositoryId);

function validateRepositoryId(request, response, next) {
  const { id } = request.params;

  if (!id) return response.status(404).json({ error: "Please provide an id." });

  if (!isUuid(id)) {
    return response.status(400).json({ error: "Invalid ID." });
  }

  return next();
}

const repositories = [
  {
    id: "iejsaiodsoka-sdaoklmaodask",
    url: "https://github.com/arthur-es/rocketseat",
    title: "Rocketseat GoStack Arthur",
    likes: 2,
  },
];

app.get("/", (request, response) => {
  return response.json({ message: "Hello" });
});

app.get("/repositories", (request, response) => {
  return response.status(200).json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;

  const newRepository = { id: uuid(), title, url, techs, likes: 0 };

  repositories.push(newRepository);

  return response.status(200).json(newRepository);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;
  const index = repositories.findIndex((repo) => repo.id === id);

  if (index === -1) {
    return response
      .status(404)
      .json({ error: `Unable to find repository with id of ${id}` });
  }

  if (title) repositories[index].title = title;
  if (url) repositories[index].url = url;
  if (techs) repositories[index].techs = techs;

  return response.status(200).json(repositories[index]);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex((repo) => repo.id === id);
  repositories.splice(index, 1);

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const index = repositories.findIndex((repo) => repo.id === id);

  if (index === -1) {
    return response.status(404).json({ error: "Not found" });
  }

  repositories[index].likes += 1;

  return response.status(200).json(repositories[index]);
});

module.exports = app;
