const express = require("express");
const { uuid, isUuid } = require("uuidv4");
const cors = require("cors");


const app = express();

app.use(express.json());
app.use(cors());

const repositories = [];
const like = [];

function validadeProjectID(request, response, next){
  const { id } = request.params;

  if (!isUuid(id)){
    return response.status(400).json({ error: 'Invalid Project ID.'});
  }
  return next();
}

app.use('/repositories:id', validadeProjectID);
app.use('/repositories/:id/like', validadeProjectID);

// GET

app.get("/repositories", (request, response) => {
  const { title } = request.query;
  
    const results = title 
      ? repositories.filter(repo => repo.title.includes(title))
      : repositories;
    return response.json(results);
});

// POST

app.post("/repositories", (request, response) => {
  const { title, url, techs } = request.body;
  const repo = { id: uuid(), title, url, techs }; 

  repositories.push(repo);
  return response.json(repo);
});


// PUT
app.put("/repositories/:id", (request, response) => {
  const { id } = request.params;
  const { title, url, techs } = request.body;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0 ) {
    return response.status(400).json({ error: 'not found!'});
  }

  const repo = {
    id,
    title,
    url,
    techs
  };

  repositories[repoIndex] = repo;

  return response.json(repo);

});

// DELETE

app.delete("/repositories/:id", (request, response) => {
  const { id } = request.params;

  const repoIndex = repositories.findIndex(repo => repo.id === id);

  if (repoIndex < 0 ) {
    return response.status(400).json({ error: 'not found!'});
  }

  repositories.splice(repoIndex, 1); 

  return response.status(204).send();

});
/*
app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repo = repositories.find(repo => repo.id === id);

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  if (repoIndex < 0){
      return response.status(400).json({ error: "project not found" });
  }
  repo.like += 1;
  repositories[repoIndex] = repo;

  return response.status(200).json(repo);
});
*/

app.post("/repositories/:id/like", (request, response) => {
  const { id } = request.params;

  const repo = repositories.find(repo => repo.id === id);

  const repoIndex = repositories.findIndex(repo => repo.id === id);
  
  if (!repo){
    return response.status(400).json({ error: "Repository not found."});
  }
  repoIndex.like += 1;
  repositories[repoIndex] = repo;

  return response.status(200).json(repo);
});

module.exports = app;
