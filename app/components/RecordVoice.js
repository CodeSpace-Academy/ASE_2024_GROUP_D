"use client";

import React, { useEffect, useState } from 'react';

const RecordVoice = ({ instructions = [] }) => {
    const [currentStep, setCurrentStep] = useState(0); // Track the current instruction step
    const [isListening, setIsListening] = useState(false); // Track listening status

    // Function to read the current instruction
    const readInstruction = () => {
        if (currentStep < instructions.length) {
            const message = new SpeechSynthesisUtterance(instructions[currentStep]);
            speechSynthesis.speak(message);
        } else {
            const message = new SpeechSynthesisUtterance("You have completed all the steps.");
            speechSynthesis.speak(message);
        }
    };

    // Function to handle speech recognition
    const handleVoiceCommands = () => {
        const recognition = new (window.SpeechRecognition || window.webkitSpeechRecognition)();
        recognition.lang = 'en-US'; // Set language
        recognition.interimResults = false; // Disable interim results
        recognition.maxAlternatives = 1; // Use the top result

        recognition.onstart = () => setIsListening(true);
        recognition.onend = () => setIsListening(false);

        recognition.onresult = (event) => {
            const command = event.results[0][0].transcript.toLowerCase(); // Capture user command
            if (command.includes('next step') && currentStep < instructions.length - 1) {
                setCurrentStep((prevStep) => prevStep + 1);
            } else if (command.includes('repeat')) {
                readInstruction(); // Repeat the current instruction
            } else if (command.includes('start over')) {
                setCurrentStep(0); // Restart the instructions
            } else {
                const message = new SpeechSynthesisUtterance("Command not recognized.");
                speechSynthesis.speak(message);
            }
        };

        recognition.start(); // Start listening
    };

    // Read the current step whenever it changes
    useEffect(() => {
        readInstruction();
    }, [currentStep]);

    const styles = {
        container: {
            fontFamily: 'Arial, sans-serif',
            maxWidth: '600px',
            margin: '0 auto',
            padding: '20px',
            border: '1px solid #ddd',
            borderRadius: '8px',
            boxShadow: '0 4px 8px rgba(0, 0, 0, 0.1)',
            textAlign: 'center',
            backgroundColor: '#f9f9f9',
        },
        header: {
            fontSize: '1.5rem',
            marginBottom: '10px',
        },
        paragraph: {
            fontSize: '1.2rem',
            margin: '10px 0 20px',
        },
        controls: {
            display: 'flex',
            justifyContent: 'space-around',
            gap: '10px',
        },
        button: {
            padding: '10px 20px',
            fontSize: '1rem',
            border: 'none',
            borderRadius: '5px',
            cursor: 'pointer',
            transition: 'background-color 0.3s ease',
        },
        prevButton: {
            backgroundColor: '#6c757d',
            color: '#fff',
        },
        nextButton: {
            backgroundColor: '#007bff',
            color: '#fff',
        },
        voiceButton: {
            backgroundColor: isListening ? '#28a745' : '#ffc107',
            color: '#fff',
        },
        buttonHover: {
            hover: {
                filter: 'brightness(90%)',
            },
        },
    };

    return (
        <div style={styles.container}>
            <h2 style={styles.header}>
                Step {currentStep + 1} of {instructions.length}
            </h2>
            <p style={styles.paragraph}>{instructions[currentStep]}</p>
            <div style={styles.controls}>
                <button
                    style={{ ...styles.button, ...styles.prevButton }}
                    onClick={() => setCurrentStep((prev) => Math.max(prev - 1, 0))}
                    disabled={currentStep === 0}
                >
                    Previous Step
                </button>
                <button
                    style={{ ...styles.button, ...styles.nextButton }}
                    onClick={() => setCurrentStep((prev) => Math.min(prev + 1, instructions.length - 1))}
                    disabled={currentStep === instructions.length - 1}
                >
                    Next Step
                </button>
                <button
                    style={{ ...styles.button, ...styles.voiceButton }}
                    onClick={handleVoiceCommands}
                >
                    {isListening ? 'Listening...' : 'Give Voice Command'}
                </button>
            </div>
        </div>
    );
};

export default RecordVoice;
