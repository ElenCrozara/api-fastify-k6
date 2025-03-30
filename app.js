const fastify = require('fastify')({ logger: true });

// Simulação de um banco de dados em memória (para simplificar o exemplo)
let items = [];
let itemIdCounter = 1;

// Definição do esquema para validação
const itemSchema = {
    type: 'object',
    properties: {
        id: { type: 'integer' },
        name: { type: 'string' },
        description: { type: 'string' },
        price: { type: 'number' },
        on_sale: { type: 'boolean' }
    }
};

const createItemSchema = {
    body: {
        type: 'object',
        required: ['name', 'price'],
        properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            on_sale: { type: 'boolean' }
        }
    },
    response: {
        201: itemSchema
    }
};

const updateItemSchema = {
    body: {
        type: 'object',
        properties: {
            name: { type: 'string' },
            description: { type: 'string' },
            price: { type: 'number' },
            on_sale: { type: 'boolean' }
        }
    },
    response: {
        200: itemSchema
    }
};

const getItemSchema = {
    response: {
        200: itemSchema
    }
};

const getItemsSchema = {
    response: {
        200: {
            type: 'array',
            items: itemSchema
        }
    }
};

// Rota para criar um novo item (POST)
fastify.post('/items', { schema: createItemSchema }, async (request, reply) => {
    const item = { id: itemIdCounter++, ...request.body };
    items.push(item);
    reply.code(201).send(item);
});

// Rota para listar todos os itens (GET)
fastify.get('/items', { schema: getItemsSchema }, async (request, reply) => {
    reply.send(items);
});

// Rota para obter um item específico por ID (GET)
fastify.get('/items/:id', { schema: getItemSchema }, async (request, reply) => {
    const { id } = request.params;
    const item = items.find(item => item.id === parseInt(id));
    if (item) {
        reply.send(item);
    } else {
        reply.code(404).send({ message: 'Item not found' });
    }
});

// Rota para atualizar um item existente (PUT)
fastify.put('/items/:id', { schema: updateItemSchema }, async (request, reply) => {
    const { id } = request.params;
    const index = items.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
        items[index] = { id: parseInt(id), ...request.body };
        reply.send(items[index]);
    } else {
        reply.code(404).send({ message: 'Item not found' });
    }
});

// Rota para deletar um item (DELETE)
fastify.delete('/items/:id', async (request, reply) => {
    const { id } = request.params;
    const index = items.findIndex(item => item.id === parseInt(id));
    if (index !== -1) {
        items.splice(index, 1);
        reply.code(204).send();
    } else {
        reply.code(404).send({ message: 'Item not found' });
    }
});

// Iniciar o servidor
const start = async () => {
    try {
        await fastify.listen({ port: 3000 });
    } catch (err) {
        fastify.log.error(err);
        process.exit(1);
    }
};
start();