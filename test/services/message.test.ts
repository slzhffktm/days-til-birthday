// import assert from 'assert'
// import sinon from 'sinon'
//
// import * as messageService from '../../src/services/message'
// import messageRouter from '../../src/routes/message'
//
// let expect = require('chai').expect
//
// // Mock  method from message service
//
// describe('Message Routes', function() {
//     describe('Get all messages', () => {
//         it('should get all messages', done => {
//             let getAllMessagesStub = sinon.stub(messageService, 'getAllMessages').callsFake(() => {
//                 return new Promise((resolve) => {
//                     resolve(
//                         {
//                             'user1': {
//                                 'message1': 'hi',
//                                 'message2': 'welcome'
//                             },
//                             'user2': {
//                                 'message1': 'hi',
//                                 'message2': 'welcome'
//                             }
//                         }
//                     );
//                 });
//             });
//
//             messageRouter.ge
//             {
//                 expect(body).to.equal({
//                     'user1': {
//                         'message1': 'hi',
//                         'message2': 'welcome'
//                     },
//                     'user2': {
//                         'message1': 'hi',
//                         'message2': 'welcome'
//                     }
//                 })
//                 done()
//             });
//     })
// })
// })
