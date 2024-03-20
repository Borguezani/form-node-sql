const { DataBasePostgres } = require ('./database-postgres.js')
const { VotosDataBasePostgres } = require ('./votos-postgres.js')
const { fastify } = require ('fastify')
const cors = require ('@fastify/cors')
const server = fastify()
server.register(cors, {
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE']
  });
const dataBase = new DataBasePostgres()
const votosBase = new VotosDataBasePostgres()
server.post('/form', async (req, res)=>{
    const {title, field1, field2, field3, data_inicio, data_termino, data_voto, opcao_id} = req.body
    
    await dataBase.create({
        title,
        field1,
        field2,
        field3,
        data_inicio,
        data_termino,
        data_voto,
        opcao_id

    })
    return res.status(201).send()
})
server.get('/form', async (req, res)=>{
    const search = req.query.search
    const forms = await dataBase.list(search)
    return forms
})
server.get('/votos', async (req, res) =>{
    const votos = await votosBase.list()
    return votos
})
server.put('/form/:id', async(req, res)=>{
    const formId = req.params.id
    const {title, field1, field2,field3,data_inicio,data_termino} = req.body
    await dataBase.update(formId, {
        title, 
        field1,
        field2,
        field3,
        data_inicio,
        data_termino
    })

    return res.status(204).send()
})
server.delete('/form/:id', async(req, res)=>{
    const formId = req.params.id
    await dataBase.delete(formId)
    
    return res.status(204).send()
})

server.listen({
    host:'0.0.0.0',
    port: process.env.PORT ?? 3030
})