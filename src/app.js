const express = require("express");
const cors = require("cors");
const { v4: uuid } = require('uuid');

// const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repo = {
    id: uuid(),
    title,
    url,
    techs,
    likes: 0,
  };

  repositories.push(repo);
  return response.json(repo);
});

app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repo = repositories.find(repo => repo.id === id);

  if (!repo) {
    return response.status(400).send();
  }

  repo.title = title;
  repo.url = url;
  repo.techs = techs;

  return response.json(repo);
});

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const repoIndex = repositories.findIndex(repo => repo.id === id)

  if (repoIndex >= 0) {
    repositories.splice(repoIndex, 1);
  } else {
    return response.status(400).send({error : "repo not found"});
  }

  return response.status(204).send();
});

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;
  const repo = repositories.find(repo => repo.id === id)

  if (!repo) {
    return response.status(400).send();
  }
  repo.likes += 1

  return response.json(repo);
});

module.exports = app;
