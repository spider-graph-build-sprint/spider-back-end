const router = require('express').Router();
const graphsDB = require('./graphsDB');
const legsDB = require('../legs/legsDB');
const datasetsDB = require('../datasets/datasetsDB');
const pointsDB = require('../points/pointsDB');
const db = require('../../data/dbConfig');


router.post('/', validateGraph, graph, legs, (req, res) => {
    const graph = {
        name: req.graph_id.name,
        legs: req.legs,
    };
    res.status(200).json(graph)
});

router.get('/:name', async (req, res) => {
    let graphs = [];
    let legs_arr = [];
    let points_arr = [];
    let datasets_arr = [];
    await graphsDB.findBy({name: req.params.name, user_id: req.user.id})
        .then(([graph]) => {
            console.log('NAME OF THE GRAPH ', req.params.name);
            console.log('GRAPH ', graph);
            legsDB.findBy({graph_id: graph.id})
                .then(legs => {
                    legs.forEach((leg, index) => {
                        legs_arr = [...legs_arr, leg.name];
                    })
                })
                .catch(err => res.status(500).json({error: "Server could not retrieve legs."}));

            datasetsDB.findBy({graph_id: graph.id})
                .then(datasets => {
                    console.log('DATASETS ', datasets);
                    if (datasets.length) {
                        datasets.forEach(async (dataset, index) => {
                            //each dataset has points
                            await pointsDB.findBy({dataset_id: dataset.id})
                                .then(points => {
                                    console.log('POINTS ', points);
                                    points.forEach((point, index) => {
                                        points_arr = [...points_arr, point.data];
                                    })
                                })
                                .catch(err => res.status(500).json({error: "Server could not retrieve points."}));

                            datasets_arr = [...datasets_arr, {name: dataset.name, points: points_arr}];
                            points_arr = [];

                            if (datasets.length - 1 === index) {
                                graphs = [...graphs, {name: graph.name, legs: legs_arr, datasets: datasets_arr}];
                                res.status(200).json(graphs)
                            }
                        })
                    } else {
                        graphs = [...graphs, {name: graph.name, legs: legs_arr, datasets: datasets_arr}];
                        res.status(200).json(graphs)
                    }

                })
                .catch(err => res.status(500).json({error: "Server could not retrieve datasets."}));
        })
        .catch(err => {
            console.log('err ', err);
            res.status(500).json({error: "Server could no retrieve graphs."})

        })

});

router.get('/', (req, res) => {
    graphsDB.findBy({user_id: req.user.id})
        .then(graphs => {
            res.status(200).json(graphs);
        })
        .catch(err => res.status(500).json({error: "Server could not retrieve graphs"}))
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

    if (legs.length) {
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
    } else {
        req.legs = legsArr;
        next();
    }

}

function legsDelete(req, res, next) {
    const graph_id = req.graph_id.id;
    legsDB.findBy({graph_id})
        .then(ls => {
            ls.forEach((leg) => {
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