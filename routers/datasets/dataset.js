const router = require('express').Router();
const graphsDB = require('../graphs/graphsDB');
const legsDB = require('../legs/legsDB');
const datasetsDB = require('./datasetsDB');
const pointsDB = require('../points/pointsDB');
const db = require('../../data/dbConfig');

//Endpoints

router.post('/:graph/dataset', validateDataset, graphFind, dataset, points, (req, res) => {
    const dataset = {
        title: req.dataset.name,
        points: req.points,
    };
    res.status(200).json(dataset);
});

router.put('/:graph/dataset/:dataset', validateDataset, graphFind,
    datasetFind, validatePath, datasetUpdate, pointsDelete, points, (req, res) => {
        const dataset = {
            title: "",
            legs: req.points,
        };
        datasetsDB.findBy({name: req.body.title, graph_id: req.graph_id})
            .then(([g]) => {
                dataset.title = g.name;
                res.status(200).json(dataset);
            })
            .catch(err => res.status(500).json({error: "Server could not retrieve a graph"}));
    });

router.delete('/:graph/dataset/:dataset', validatePath, graphFind, datasetFind, (req, res) => {
    datasetsDB.remove({name: req.dataset.name, graph_id: req.graph_id})
        .then(dataset => res.status(200).json(dataset))
        .catch(err => res.status(500).json({error: "Server could not remove dataset"}))
});


//Middleware
function graphFind(req, res, next) {
    const graph_name = req.params.graph;

    graphsDB.findBy({name: graph_name, user_id: req.user.id})
        .then(([graph]) => {
            req.graph_id = graph.id;
            next();
        })
        .catch(err => res.status(500).json({error: "Server could not retrieve a graph"}));
}

function datasetFind(req, res, next) {
    const dataset_name = req.params.dataset;
    datasetsDB.findBy({name: dataset_name})
        .then(([dataset]) => {
            if (!dataset.length) {
                req.dataset = dataset;
                next();
            } else {
                res.status(404).json({errorMessage: "The dataset with the specified name does not exist."})
            }
        })
        .catch(err => res.status(500).json({error: "Server could not retrieve dataset"}))
}

function dataset(req, res, next) {
    const datasetTitle = req.body.title;
    const graph_id = req.graph_id;
    const dataset = {name: datasetTitle, graph_id};

    datasetsDB.findBy({name: datasetTitle, graph_id})
        .then(([data]) => {
            if (!data) {
                datasetsDB.add(dataset)
                    .then(([created_dataset]) => {
                        req.dataset = created_dataset;
                        next();
                    })
                    .catch(err => res.status(500).json({error: "Server could not add a dataset"}));
            } else {
                res.status(500).json({errorMessage: "The dataset already exists"});
            }
        });
}

function datasetUpdate(req, res, next) {
    const datasetTitle = req.params.dataset;
    const newDatasetTitle = req.body.title;
    const graph_id = req.graph_id;

    datasetsDB.update({name: datasetTitle, graph_id}, {name: newDatasetTitle, graph_id})
        .then(id => next())
        .catch(err => res.status(500).json({error: "Server could not update a dataset"}));
}

function points(req, res, next) {
    const points = req.body.points;
    const dataset_id = req.dataset.id;
    const pointsArr = [];
    points.forEach((point, index) => {
        pointsDB.add({data: point, dataset_id})
            .then(([point]) => {
                pointsArr.push(point.data);
                if (points.length - 1 === index) {
                    req.points = pointsArr;
                    next();
                }
            })
            .catch(err => res.status(500).json({error: "Server could not add a point"}))
    });
}

function pointsDelete(req, res, next) {
    const dataset_id = req.dataset.id;

    pointsDB.findBy({dataset_id})
        .then(ps => {
            ps.forEach((point) => {
                pointsDB.remove({data: point.data, dataset_id})
                    .then(count => {
                        if (!count) {
                            res.status(400).json(count)
                        }
                    })
                    .catch(err => res.status(500).json({error: "Server could not remove the point."}));
            });
            next();
        })
        .catch(err => res.status(404).json({errorMessage: "The points with the specified ID does not exist."}))
}

function validatePath(req, res, next) {
    const title = req.params.dataset;
    const graph = req.params.graph;

    graphsDB.findBy({name: graph})
        .then(graph => {
            next();
        })
        .catch(err => res.status(404).json({errorMessage: "The graph with the specified name does not exist."}));
}

function validateDataset(req, res, next) {
    if (!req.body) {
        res.status(400).json({errorMessage: "Missing dataset data."})
    } else if (!req.body.title && !req.body.points) {
        res.status(400).json({errorMessage: "Please provide title/points for the graph."})
    }
    next();
}

module.exports = router;