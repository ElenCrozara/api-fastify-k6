

import http from 'k6/http';
import { check, sleep } from 'k6';

export const options = {
    vus: 10, // Número de usuários virtuais
    duration: '30s', // Duração do teste
    thresholds: {
        http_req_duration: ['p(95)<200'], // 95% das requisições devem ser menores que 200ms
        http_req_failed: ['rate<0.01'],    // A taxa de falha não deve exceder 1%
    },
};

export default function () {
    // Criar um novo item
    const createPayload = JSON.stringify({
        name: `Test Item ${Math.random()}`,
        price: Math.random() * 100,
    });
    const createRes = http.post('http://localhost:3000/items', createPayload, {
        headers: { 'Content-Type': 'application/json' },
    });

    check(createRes, { 'create item status is 201': (r) => r.status === 201 });

    // Listar os itens
    const listRes = http.get('http://localhost:3000/items');
    check(listRes, { 'list items status is 200': (r) => r.status === 200 });

    sleep(1);
}