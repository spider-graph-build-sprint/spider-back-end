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
    res.status(200).json(graph);
});

router.get('/', (req, res) => {
    // get all graphs of the user
    const user_id = req.user.id;
    let graphs = [];
    let legs = [];
    graphsDB.findBy({user_id})
        .then((g_arr )=> {
            g_arr.forEach(async (g, index) =>{
                await legsDB.findBy({graph_id: g.id})
                    .then(legs_arr =>{
                        legs_arr.forEach((leg, index) =>{
                            legs = [...legs, leg.name];
                            if(legs_arr.length-1 === index){
                                graphs = [...graphs, {name: g.name, legs: legs}];
                                legs = [];
                                console.log("legs", graphs);
                            }
                        })
                    })
                    .catch(err => res.status(500).json({error: "Server could not retrieve legs"}))
                if(g_arr.length-1 === index){
                    console.log(graphs);
                    res.status(200).json(graphs);
                }
            });
        })
        .catch(err => res.status(500).json({error: "Server could not retrieve graphs"}))
});

router.put('/:name', validatePath, checkIfGraphExists, graphUpdate, legsDelete, legs, (req, res) => {
    const graph = {
        name: "",
        legs: req.legs,
    };
    graphsDB.findBy({name: req.body.name})
        .then(([g]) => {
            graph.name = g.name;
            res.status(200).json(graph);
        })
        .catch(err => res.status(500).json({error: "Server could not retrieve a graph"}));
});

router.delete('/:name', validatePath, (req, res) => {
    const name = req.params.name;
    graphsDB.remove({name, user_id: req.user.id})
        .then(graph => {
            if (graph) {
                const [data] = graph;
                res.status(200).json(data)
            } else res.status(200).json(graph)
        })
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
    legs.forEach((leg, index) => {
        legsDB.add({name: leg, graph_id})
            .then(([leg]) => {
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

    legsDB.findBy({graph_id})
        .then(ls => {
            ls.forEach((leg) => {
                legsDB.remove(leg.name)
                    .then(count => {
                        if (!count) {
                            res.status(400).json(count)
                        }
                    })
                    .catch(err => res.status(500).json({error: "Server could not delete a leg"}))
            });
            next();
        })
        .catch(err => res.status(500).json({error: "Server could not retrieve legs"}));
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
    console.log(req.body);
    if (!req.body) {
        res.status(400).json({errorMessage: "Missing graph data."})
    } else if (!req.body.name && !req.body.legs) {
        res.status(400).json({errorMessage: "Please provide name/legs for the graph."})
    }
    next();
}

module.exports = router;