const router = require('express').Router();
const graphsDB = require('./graphsDB');
const legsDB = require('../legs/legsDB');
const datasetsDB = require('../datasets/datasetsDB');
const pointsDB = require('../points/pointsDB');
const db = require('../../data/dbConfig');

//Endpoints

router.post('/', validateGraph, graph, legs, (req, res) => {
    const graph = {
        name: req.graph_id.name,
        legs: req.legs,
    };
    res.status(200).json(graph)
});

router.get('/', (req, res) => {
    // get all graphs of the user
    let graphs = [];
    const user_id = req.user.id;
    pointsDB.dataset({user_id})
        .then(datasets => {
            res.status(200).json(datasets)
        })
        .catch(err => res.status(500).json({error: "Server could not"}))

});

router.put('/:name', validateGraph, validatePath, checkIfGraphExists, graphUpdate, legsDelete, legs, (req, res) => {
    const graph = {
        name: "",
        legs: req.legs,
    };
    graphsDB.findBy({name: req.body.name, user_id: req.user.id})
        .then(([g]) => {
            graph.name = g.name;
            res.status(200).json(graph);
        })
        .catch(err => res.status(500).json({error: "Server could not retrieve a graph"}));
});

router.delete('/:name', validatePath, checkIfGraphExists, (req, res) => {
    console.log({name: req.graph_id.name, user_id: req.user.id});
    graphsDB.remove({name: req.graph_id.name, user_id: req.user.id})
        .then(graph => res.status(200).json(graph))
        .catch(err => res.status(500).json({error: "The graph could not be removed"}))
});

//Middleware

function checkIfGraphExists(req, res, next) {
    const graphTitle = req.params.name;
    const user_id = req.user.id;

    graphsDB.findBy({name: graphTitle, user_id})
        .then(([data]) => {
            if (data) {
                req.graph_id = data;
                next();
            } else {
                res.status(500).json({errorMessage: "The graph does not exist"});
            }
        });
}

function graph(req, res, next) {
    const graphTitle = req.body.name;

    const user_id = req.user.id;
    const graph = {name: graphTitle, user_id: user_id};

    graphsDB.findBy({name: graphTitle, user_id})
        .then(([data]) => {
            if (!data) {
                graphsDB.add(graph)
                    .then(([id]) => {
                        req.graph_id = id;
                        next();
                    })
                    .catch(err => res.status(500).json({error: "Server could not add a graph"}));
            } else {
                res.status(500).json({errorMessage: "The graph already exists"});
            }
        });
}

function graphUpdate(req, res, next) {
    const graphTitle = req.params.name;
    const newGraphTitle = req.body.name;
    const user_id = req.user.id;

    graphsDB.update({name: graphTitle, user_id}, {name: newGraphTitle, user_id})
        .then(id => next())
        .catch(err => res.status(500).json({error: "Server could not update a graph"}));
}

function legs(req, res, next) {
    const legs = req.body.legs;
    const graph_id = req.graph_id.id;
    const legsArr = [];
    console.log('LEGS', legs);
    console.log('GRAPH_ID', graph_id);
    legs.forEach((leg, index) => {
        legsDB.add({name: leg, graph_id})
            .then(([leg]) => {
                console.log('LEG', leg);
                legsArr.push(leg.name);
                if (legs.length - 1 === index) {
                    req.legs = legsArr;
                    next();
                }
            })
            .catch(err => res.status(500).json({error: "Server could not add a leg"}))
    });
}

function legsDelete(req, res, next) {
    const graph_id = req.graph_id.id;
    console.log(graph_id);
    legsDB.findBy({graph_id})
        .then(ls => {
            ls.forEach((leg) => {
                console.log('leg ', leg);
                legsDB.remove({name: leg.name, graph_id})
                    .then(count => {
                        if (!count) {
                            res.status(400).json(count)
                        }
                    })
                    .catch(err => res.status(500).json({error: "Server could not delete a leg"}))
            });
            next();
        })
        .catch(err => res.status(404).json({errorMessage: "The legs with the specified ID does not exist."}))
}


function datasets(req, res, next) {
    const datasets = req.body.datasets;
    const graph_id = req.graph_id.id;
    datasets.forEach(dataset => {
        datasetsDB
            .add({name: dataset.title, graph_id})
            .then(([id]) => {
                dataset.points.forEach(point => {
                    pointsDB
                        .add({data: point, dataset_id: id.id})
                        .then(data => {
                            req.points = [...req.points, data.data];
                            console.log('point ', data)
                        })
                        .catch(err => res.status(500).json({error: "Server could not add a point"}))
                })
            })
            .catch(err => res.status(500).json({error: "Server could not add a dataset"}))
    });
    next();
}

function validatePath(req, res, next) {
    const name = req.params.name;

    graphsDB.findBy({name})
        .then(graph => {
            next();
        })
        .catch(err => res.status(404).json({errorMessage: "The graph with the specified name does not exist."}));
}

function validateGraph(req, res, next) {
    if (!req.body) {
        res.status(400).json({errorMessage: "Missing graph data."})
    } else if (!req.body.name && !req.body.legs) {
        res.status(400).json({errorMessage: "Please provide name/legs for the graph."})
    }
    next();
}

module.exports = router;