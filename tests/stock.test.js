const request = require('supertest');
const app = require('../src/app');

describe('Sistema de controle de estoque', () => {
  test('deve registrar um usuário e retornar JWT', async () => {
    const response = await request(app)
      .post('/api/auth/register')
      .send({
        name: 'Usuário Teste',
        email: 'teste@estoque.com',
        password: '123456'
      });

    expect(response.status).toBe(201);
    expect(response.body).toHaveProperty('token');
    expect(response.body.user).toHaveProperty('email', 'teste@estoque.com');
  });

  test('deve registrar entrada e diminuir o estoque quando houver saída', async () => {
    const login = await request(app)
      .post('/api/auth/login')
      .send({ email: 'teste@estoque.com', password: '123456' });

    const token = login.body.token;

    const category = await request(app)
      .post('/api/categories')
      .set('Authorization', `Bearer ${token}`)
      .send({ name: 'Material Escolar', description: 'Itens acadêmicos' });

    const product = await request(app)
      .post('/api/products')
      .set('Authorization', `Bearer ${token}`)
      .send({
        name: 'Caderno',
        description: 'Caderno universitário',
        category_id: category.body.id,
        price: 15.5,
        stock_quantity: 10
      });

    const entrada = await request(app)
      .post('/api/movements')
      .set('Authorization', `Bearer ${token}`)
      .send({
        product_id: product.body.id,
        type: 'entrada',
        quantity: 5,
        description: 'Compra de estoque'
      });

    expect(entrada.status).toBe(201);
    expect(entrada.body.product.stock_quantity).toBe(15);

    const saida = await request(app)
      .post('/api/movements')
      .set('Authorization', `Bearer ${token}`)
      .send({
        product_id: product.body.id,
        type: 'saida',
        quantity: 4,
        description: 'Venda do produto'
      });

    expect(saida.status).toBe(201);
    expect(saida.body.product.stock_quantity).toBe(11);
  });
});
