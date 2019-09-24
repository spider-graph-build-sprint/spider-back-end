const router = require('express').Router();
const db = require('./graphsDB');


router.post('/', validateGraph, (req, res) => {
    const name = req.body.name;
    const graph = req.body;
    graph.user_id = req.user.id;
    db.findBy({name})
        .then(([data]) => {
            if(!data){
                db.add(graph)
                    .then(([graph]) => {
                        res.status(201).json(graph)
                    })
                    .catch(err => res.status(500).json({error: "There was an error while saving the graph to the database."}))
            }else {
                res.status(500).json({errorMessage: "The graph already exists"});
            }
        })
});

router.get('/', (req, res) => {
    const user_id = req.user.id;
    db.findBy({user_id})
        .then(graphs => res.status(200).json(graphs))
        .catch(err => res.status(500).json({error: "The graphs information could not be retrieved."}))
});

router.get('/:name', (req, res) => {
    const name = req.params.name;
    const user_id = req.user.id;

    db.findBy({name, user_id})
        .then(graph => res.status(200).json(graph))
        .catch(err => res.status(500).json({error: "The graph information could not be retrieved."}));
});

router.put('/:name', validateGraph, (req, res) => {
    const name = req.params.name;
    const user_id = req.user.id;
    const graph = req.body;
    db.update({name, user_id}, graph)
        .then(graph => res.status(200).json(graph))
        .catch(err => res.status(500).json({error: "The graph information could not be modified."}))
});

router.delete('/:name', (req, res) => {
    const name = req.params.name;
    db.remove(name)
        .then(graph => {
            if (graph){
                const [data]= graph;
                res.status(200).json(data)
            } else  res.status(200).json(graph)
        })
        .catch(err => res.status(500).json({error: "The graph could not be removed"}))
});


function validateGraphId(req, res, next) {
    const id = req.params.id;

    db.findBy({id})
        .then(graph => {
            next();
        })
        .catch(err => res.status(404).json({errorMessage: "The graph with the specified ID does not exist."}));
}

function validateGraph(req, res, next) {
    console.log(req.body);
    if (!req.body) {
        res.status(400).json({errorMessage: "Missing graph data."})
    } else if (!req.body.name) {
        res.status(400).json({errorMessage: "Please provide name for the graph."})
    }
    next();
}

module.exports = router;