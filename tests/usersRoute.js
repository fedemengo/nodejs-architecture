const chai = require('chai');
const app = require('../src/app');

chai.use(require('chai-http'));
chai.should();

describe('Testing "/users" route', () => {
    it('Should respond to GET /users/123 with 200', done => {
        chai.request(app)
            .get('/users/123')
            .end((err, res) => {
                res.should.have.status(200);
                res.body.should.have
                    .property('data')
                    .to.deep.equal({ id: '123' });
                done();
            });
    });

    it('Should respond to POST /users/ with 404', done => {
        chai.request(app)
            .post('/users')
            .end((err, res) => {
                res.should.have.status(404);
                done();
            });
    });
});
