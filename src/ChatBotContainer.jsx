import React, { useState } from 'react';
import axios from 'axios'; // Import Axios
import ChatBotHeader from './chat/header';
import ChatBotMessageContainer from './chat/chatbotmessage';
import ChatBotFooter from './chat/fotter';

const questionDomain = ['Who are you?', 'What is this course?', 'What is AI?'];

const answerDomain = [
    "I'm a Chatbot",
    'This is a  Course In reactJS',
    'AI means Artificial Intelligence'
];

const prompt = (message) =>
    `if the question is related to ${questionDomain.join(
        ', '
    )} - answer only one from: ${answerDomain.join(
        ', '
    )} where question is: ${message}, else say: Please try some other question`;

export default function ChatbotContainer() {
    const [messages, setMessages] = useState([
        {
            message: 'How may I help you?',
            userType: 'assistant',
            createdAt: new Date()
        },
        {
            message: 'You can ask what is this course for example.',
            userType: 'assistant',
            createdAt: new Date()
        }
    ]);
    const [message, setMessage] = useState('');

    const onInputChangeHandler = (event) => {
        event.preventDefault();

        const message = event.target.value;
        setMessage(message);
    };

    const onSubmitUserMessageHandler = () => {
        const newMessage = {
            userType: 'user',
            message: message.trim(),
            createdAt: new Date()
        };

        let updatedMessages = [...messages, newMessage];
        setMessages(updatedMessages);
        setMessage('');

        // Use Axios for the API call
        axios.post('../src/chatbot', {  // Replace with your API endpoint
            message: {
                role: newMessage.userType,
                content: prompt(newMessage.message)
            }
        })
            .then((response) => {
                const responseData = response.data;
                const newMessage = {
                    message: responseData.data.content,
                    userType: responseData.data.role,
                    createdAt: new Date()
                };

                updatedMessages = [...updatedMessages, { ...newMessage }];
                console.log(updatedMessages);
                setMessages(updatedMessages);
            })
            .catch((error) => {
                console.log('Error', error);
            });
    };

    const handleKeyPress = (event) => {
        if (event.key === 'Enter') {
            onSubmitUserMessageHandler();
        }
    };

    return (
        <div className="row justify-content-center">
            <div className="col-6 ">
                <ChatBotHeader />
                <ChatBotMessageContainer messages={messages} />
                <ChatBotFooter
                    message={message}
                    onInputChangeHandler={onInputChangeHandler}
                    onSubmitUserMessageHandler={onSubmitUserMessageHandler}
                    onKeyDown={handleKeyPress}
                />
            </div>
        </div>
    );
}
