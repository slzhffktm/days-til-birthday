import assert from 'assert'
import sinon from 'sinon'

import * as status from '../../src/config/http-status'
import * as messageService from '../../src/services/message'
import * as messageModel from '../../src/db/models/message'
import * as userModel from '../../src/db/models/user'

let expect = require('chai').expect

const test_message = {
    'user1': {
        messages: {
            'message1': 'hi',
            'message2': 'welcome'
        }
    },
    'user2': {
        messages: {
            'message1': 'hi',
            'message2': 'welcome'
        }
    }
}

describe('Message Services', function() {
    let sandbox = sinon.createSandbox();

    afterEach(function () {
        sandbox.restore();
    });

    describe('resolveMessage', () => {
        it('should return stage0', (done: any) => {
            let add_message_stub = sandbox.stub(messageModel, 'addMessage')
            let update_stage_stub = sandbox.stub(userModel, 'updateStage')
            let get_stage_stub = sandbox.stub(userModel, 'getStage').callsFake(() => {
                return new Promise((resolve) => {
                    resolve(null)
                });
            });

            let expectedResult = { text: "Hi! What's your first name?" }

            messageService.resolveMessage('user1', 'hi').then(function (result) {
                assert(add_message_stub.calledOnceWith('user1', 'hi'))
                assert(update_stage_stub.calledOnceWith('user1', 1))
                assert(get_stage_stub.calledOnceWith('user1'))
                assert.deepEqual(result, expectedResult)
                done()
            }).catch(function (error) {
                console.error('Test error: ' + error)
            })
        })
        it('should return stage1', (done: any) => {
            let add_message_stub = sandbox.stub(messageModel, 'addMessage')
            let update_stage_stub = sandbox.stub(userModel, 'updateStage')
            let get_stage_stub = sandbox.stub(userModel, 'getStage').callsFake(() => {
                return new Promise((resolve) => {
                    resolve(1)
                });
            });

            let expectedResult = { text: `Hi User! When is your birth date? Please insert with format: YYYY-MM-DD` }

            messageService.resolveMessage('user1', 'User').then(function (result) {
                assert(add_message_stub.calledOnceWith('user1', 'User'))
                assert(update_stage_stub.calledOnceWith('user1', 2))
                assert(get_stage_stub.calledOnceWith('user1'))
                assert.deepEqual(result, expectedResult)
                done()
            }).catch(function (error) {
                console.error('Test error: ' + error)
            })
        })
        it('should return stage2_fail because of wrong message format', (done: any) => {
            let add_message_stub = sandbox.stub(messageModel, 'addMessage')
            let get_stage_stub = sandbox.stub(userModel, 'getStage').callsFake(() => {
                return new Promise((resolve) => {
                    resolve(2)
                });
            });

            let expectedResult = { text: `Sorry, I think it is an invalid date. Could you please try again?` }

            messageService.resolveMessage('user1', '111').then(function (result) {
                assert(add_message_stub.calledOnceWith('user1', '111'))
                assert(get_stage_stub.calledOnceWith('user1'))
                assert.deepEqual(result, expectedResult)
                done()
            }).catch(function (error) {
                console.error('Test error: ' + error)
            })
        })
        it('should return stage2', (done: any) => {
            let add_message_stub = sandbox.stub(messageModel, 'addMessage')
            let update_stage_stub = sandbox.stub(userModel, 'updateStage')
            let get_stage_stub = sandbox.stub(userModel, 'getStage').callsFake(() => {
                return new Promise((resolve) => {
                    resolve(2)
                });
            });

            let expectedResult = {
                text: "Do you wanna know how many days left to your next birthday?",
                quick_replies: [
                    {
                        content_type: "text",
                        title: "Yes",
                        payload: "STAGE2YES"
                    },
                    {
                        content_type: "text",
                        title: "No",
                        payload: "STAGE2NO"
                    }
                ]
            }

            messageService.resolveMessage('user1', '1992-02-15').then(function (result) {
                assert(add_message_stub.calledOnceWith('user1', '1992-02-15'))
                assert(update_stage_stub.calledOnceWith('user1', 3))
                assert(get_stage_stub.calledOnceWith('user1'))
                assert.deepEqual(result, expectedResult)
                done()
            }).catch(function (error) {
                console.error('Test error: ' + error)
            })
        })
        it('should return stage3_no', (done: any) => {
            let add_message_stub = sandbox.stub(messageModel, 'addMessage')
            let get_stage_stub = sandbox.stub(userModel, 'getStage').callsFake(() => {
                return new Promise((resolve) => {
                    resolve(3)
                });
            });

            let expectedResult = { text: "Goodbye 👋" }

            messageService.resolveMessage('user1', 'no').then(function (result) {
                assert(add_message_stub.calledOnceWith('user1', 'no'))
                assert(get_stage_stub.calledOnceWith('user1'))
                assert.deepEqual(result, expectedResult)
                done()
            }).catch(function (error) {
                console.error('Test error: ' + error)
            })
        })
        it('should return stage3_fail', (done: any) => {
            let add_message_stub = sandbox.stub(messageModel, 'addMessage')
            let get_stage_stub = sandbox.stub(userModel, 'getStage').callsFake(() => {
                return new Promise((resolve) => {
                    resolve(3)
                });
            });

            let expectedResult = {
                text: "Sorry, I don't understand you. Could you please answer with yes or no?",
                quick_replies: [
                    {
                        content_type: "text",
                        title: "Yes",
                        payload: "STAGE2YES"
                    },
                    {
                        content_type: "text",
                        title: "No",
                        payload: "STAGE2NO"
                    }
                ]
            }

            messageService.resolveMessage('user1', 'up to you').then(function (result) {
                assert(add_message_stub.calledOnceWith('user1', 'up to you'))
                assert(get_stage_stub.calledOnceWith('user1'))
                assert.deepEqual(result, expectedResult)
                done()
            }).catch(function (error) {
                console.error('Test error: ' + error)
            })
        })
    })
    describe('getAllMessages', () => {
        it('should get all messages', (done: any) => {
            let expectedResult = {
                user1: {
                    message1: 'hi',
                    message2: 'welcome'
                },
                user2: {
                    message1: 'hi',
                    message2: 'welcome'
                }
            }

            let stubbed = sandbox.stub(messageModel, 'getAllMessages').callsFake(() => {
                return new Promise((resolve) => {
                    resolve(test_message)
                });
            });

            messageService.getAllMessages().then(function (result) {
                assert(stubbed.calledOnce)
                assert.deepEqual(result, expectedResult)
                done()
            }).catch(function (error) {
                console.error('Test error: ' + error)
            })
        })
    })
    describe('getUserMessageById', () => {
        it('should get one user message by id', (done: any) => {
            let expectedResult = test_message.user1.messages.message1

            let stubbed = sandbox.stub(messageModel, 'getUserMessageById').callsFake(() => {
                return new Promise((resolve) => {
                    resolve(test_message.user1.messages.message1);
                });
            });

            messageService.getUserMessageById('user1', 'message1').then(function (result) {
                assert.equal(result, expectedResult)
                assert(stubbed.calledOnceWith('user1', 'message1'))
                done()
            }).catch(function (error) {
                console.error('Test error: ' + error)
            })
        })
    })
    describe('deleteUserMessageById', () => {
        it('should delete one user message by id', (done: any) => {
            let get_user_stub = sandbox.stub(messageModel, 'getUserMessageById').callsFake(() => {
                return new Promise((resolve) => {
                    resolve(test_message.user1.messages.message1);
                });
            });
            let stubbed = sandbox.stub(messageModel, 'deleteUserMessageById').callsFake(() => {
                return new Promise((resolve) => {
                    resolve(status.OK);
                });
            });

            messageService.deleteUserMessageById('user1', 'message1').then(function () {
                assert(get_user_stub.calledOnceWith('user1', 'message1'))
                assert(stubbed.calledOnceWith('user1', 'message1'))
                done()
            }).catch(function (error) {
                console.error('Test error: ' + error)
            })
        })
        it('should report message not found', (done: any) => {
            let get_user_stub = sandbox.stub(messageModel, 'getUserMessageById').callsFake(() => {
                return new Promise((resolve) => {
                    resolve(null);
                });
            });

            messageService.deleteUserMessageById('user1', 'message1').catch(function (error) {
                get_user_stub.calledOnceWith('user1', 'message1')
                done()
            })
        })
    })
})
