'use strict';

const http = require('http');
const path = require('path');

const express = require('express');
const app = express();

const {port, host, storage} = require('./serverConfig.json');
const { renameSync } = require('fs');

const Datastorage = 
    require(path.join(__dirname, storage.storageFolder, storage.dataLayer));

const dataStorage = new Datastorage();

const server = http.createServer(app);

app.set('view engine', 'ejs');
app.set('views', path.join(__dirname, 'pageviews'));

app.use(express.urlencoded({extended: false}));
app.use(express.static(path.join(__dirname, 'public')));

const menuPath = path.join(__dirname, 'menu.html');

app.get('/', (req, res) => res.sendFile(menuPath));

app.get('/allMopeds', (req, res) => dataStorage.getAll()
    .then(data => res.render('allMopeds', {result: data})));

app.get('/getMoped', (req, res) => res.render('getMoped', {
    title: 'Get',
    header: 'Get',
    action: '/getMoped'
}));

app.post('/getMoped', (req, res) => {
    if(!req.body) res.sendStatus(500);

    const id = req.body.id;
    dataStorage.getOne(id)
        .then(moped => res.render('mopedPage', { result: moped }))
        .catch(error => sendErrorPage(res, error));
})

app.get('/removemoped', (req, res) => res.render('getmoped', {
    title: 'Remove',
    header: 'Remove a moped',
    action: '/removemoped'
}));

app.post('/removemoped', (req, res) => {
    if(!req.body) res.sendStatus(500);
    const id = req.body.id;
    dataStorage.remove(id)
        .then(status => sendStatusPage(res, status))
        .catch(error => sendErrorPage(res, error));
});

app.get('/inputform', (req, res) => res.render('form', {
    title: 'Add moped',
    header: 'Add a new moped',
    action: '/insert',
    id: {value: '', readonly: ''},
    name: {value: '', readonly: ''},
    modelYear: {value: '', readonly: ''},
    itemsInStock: {value: '', readonly: ''},
    topSpeed: {value: '', readonly: ''}
}));

app.post('/insert', (req, res) => {
    if(!req.body) res.sendStatus(500);
    dataStorage.insert(req.body)
        .then(status => sendStatusPage(res, status))
        .catch(error => sendErrorPage(res, error))
});


app.get('/updateform', (req, res) => res.render('form', {
    title: 'Update moped',
    header: 'Update moped data',
    action: '/updatedata',
    id: {value: '', readonly: ''},
    name: {value: '', readonly: 'readonly'},
    modelYear: {value: '', readonly: 'readonly'},
    itemsInStock: {value: '', readonly: 'readonly'},
    topSpeed: {value: '', readonly: 'readonly'}
}));

app.post('/updatedata', (req, res) => {
    if(!req.body) res.sendStatus(500);
    dataStorage.getOne(req.body.id)
        .then(moped => res.render('form', {
            title: 'Update moped',
            header: 'Update moped data',
            action: '/update',
            id: {value: moped.id, readonly: 'readonly'},
            name: {value: moped.name, readonly: ''},
            modelYear: {value: moped.modelYear, readonly: ''},
            itemsInStock: {value: moped.itemsInStock, readonly: ''},
            topSpeed: {value: moped.topSpeed, readonly: ''}
        }))
        .catch(error => sendErrorPage(res, error));
});

app.post('/update', (req, res) => {
    if(!req.body) res.sendStatus(500);
    dataStorage.update(req.body)
        .then(status => sendStatusPage(res, status))
        .catch(error => sendErrorPage(res, error))
});

server.listen(port, host, () => console.log(`${host}:${port} serving...`));

function sendErrorPage(res, error, title = 'Error', header = 'Error') {
    sendStatusPage(res, error, title, header);
}

function sendStatusPage(res, status, title = 'Status', header = 'Status') {
    return res.render('statusPage', {title, header, status});
}