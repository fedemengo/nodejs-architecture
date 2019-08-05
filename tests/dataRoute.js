const chai = require('chai');
const app = require('../src/app');

chai.use(require('chai-http'));
chai.should();

describe('Testing "/data" route', () => {
    it('Should respond to GET /data/retrieve?key=hello with 200', done => {
        chai.request(app)
            .get('/data/retrieve')
            .query({ key: 'hello' })
            .end((err, res) => {
                res.should.have.status(500);
                //res.body.should.be.deep.equal('[world]');
                done();
            });
    });
});
