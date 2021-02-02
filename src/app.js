const express = require("express");
const cors = require("cors");

const { v4: uuid, validate: isUuid } = require('uuid');

const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];

app.get("/repositories", (request, response) => {
  return response.json(repositories);
});

app.post("/repositories", (request, response) => {
  const {title, url, techs} = request.body;

  const repository = {id:uuid(), title:title, url:`http://github.com/${url}`, techs, likes:0};

  repositories.push(repository);

  return response.json(repository);
});

app.put("/repositories/:id", (request, response) => {
  const {id} = request.params;
  const {title, url, techs} = request.body;

  const index = repositories.findIndex(repository => repository.id === id);

  if (index < 0) {
    return response.status(400).json({error: 'Repository not found'});
  }

  const repository = {
    id,
    title: title ? title : repositories[index].title,
    url: url ? url : repositories[index].url,
    techs: techs ? techs : repositories[index].techs,
    likes: repositories[index].likes
  };

  repositories[index] = repository;

  return response.json(repository);

});

app.delete("/repositories/:id", (request, response) => {
  const {id} = request.params;

  const index = repositories.findIndex(repository => repository.id === id);

  if (index < 0) {
    return response.status(400).json({error: 'Repository not found'});
  }

  repositories.splice(index, 1);

  return response.status(204).send();

});

app.put("/repositories/:id/like", (request, response) => {
  const {id} = request.params;

  const index = repositories.findIndex(repository => repository.id === id);

  if (index < 0) {
    return response.status(400).json('Repository not found!');
  }

  const liked = repositories[index];

  liked.likes += 1;

  return response.status(204).send();
});

module.exports = app;
