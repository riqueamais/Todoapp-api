const express = require('express');
const router = express.Router()
module.exports = router;
const modeloTarefa = require('../models/tarefa');

const undo = []


router.post('/post', async (req, res) => {
    const objetoTarefa = new modeloTarefa({
        descricao: req.body.descricao,
        statusRealizada: req.body.statusRealizada
    })

    try {
        const tarefaSalva = await objetoTarefa.save();
        undo.push(objetoTarefa)
        res.status(200).json(tarefaSalva)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/getAll', async (req, res) => {
    try {
        const resultados = await modeloTarefa.find();
        res.json(resultados)
    }
    catch (error) {
        res.status(500).json({ message: error.message })
    }
})

router.delete('/delete/:id', async (req, res) => {
    try {
        const resultado = await modeloTarefa.findByIdAndDelete(req.params.id)

        res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.patch('/update/:id', async (req, res) => {
    try {
        const id = req.params.id;
        const novaTarefa = req.body;
        const options = { new: true };
        const result = await modeloTarefa.findByIdAndUpdate(
            id, novaTarefa, options
        )
        res.json(result)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.get('/search/:s', async (req, res) => {
    try {
        const param = req.params.s;

        const resultado = await modeloTarefa.find({ $text: { $search: param } })

        res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/deleteAll', async (req, res) => {
    try {

        const resultado = await modeloTarefa.deleteMany()

        res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/deleteAllDone', async (req, res) => {
    try {

        const resultado = await modeloTarefa.deleteMany({ statusRealizada: true })

        res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.delete('/undo', async (req, res) => {
    try {


        const resultado = await modeloTarefa.findByIdAndDelete(undo[0]._id)

        res.json(resultado)
    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})

router.post('/undo', async (req, res) => {
    try {

        const array = []
        undo.forEach(async (item, index) => {

            const objetoTarefa = new modeloTarefa({
                descricao: item.descricao,
                statusRealizada: item.statusRealizada
            })
            console.log(objetoTarefa)
             resultado = await objetoTarefa.save()
             array.push(resultado)
        })
        res.json(resultado)

    }
    catch (error) {
        res.status(400).json({ message: error.message })
    }
})
