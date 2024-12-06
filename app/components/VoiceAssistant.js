'use client';

import { useState, useEffect, useRef } from 'react';

// Helper to parse numbers from text (e.g., "five" to 5)
const parseNumberFromText = (text) => {
    const numberWords = {
        one: 1, two: 2, three: 3, four: 4, five: 5,
        six: 6, seven: 7, eight: 8, nine: 9, ten: 10,
    };
    return numberWords[text] || parseInt(text, 10);
};

export default function VoiceAssistant({ instructions }) {
    const [isActive, setIsActive] = useState(false);
    const [currentStep, setCurrentStep] = useState(0);
    const [isSpeaking, setIsSpeaking] = useState(false);
    const [isPlaying, setIsPlaying] = useState(false);
    const [speechSpeed, setSpeechSpeed] = useState(1);
    const [error, setError] = useState(null);

    const synthRef = useRef(null);
    const recognitionRef = useRef(null);

    useEffect(() => {
        synthRef.current = window.speechSynthesis;

        const SpeechRecognition = window.SpeechRecognition || window.webkitSpeechRecognition;
        if (SpeechRecognition) {
            const recognition = new SpeechRecognition();
            recognition.lang = "en-US";
            recognition.continuous = true;
            recognition.interimResults = false;
            recognition.onresult = handleVoiceCommand;
            recognition.onerror = (e) => setError(e.error);
            recognitionRef.current = recognition;
        } else {
            setError("Speech Recognition not supported in this browser.");
        }
    }, []);

    useEffect(() => {
        if (currentStep >= instructions.length) {
            setCurrentStep(0);
        }
    }, [instructions]);

    useEffect(() => {
        if (isActive && !isSpeaking) {
            readInstruction();
        }
    }, [currentStep]);

    const startVoiceAssistant = () => {
        setIsActive(true);
        recognitionRef.current?.start();
    };

    const playInstructions = () => {
        if (isPlaying) return;
        setIsPlaying(true);

        const speakSequentialStep = (step) => {
            if (step < instructions.length) {
                const utterance = new SpeechSynthesisUtterance(instructions[step]);
                utterance.rate = speechSpeed;
                utterance.onend = () => {
                    if (isPlaying) {
                        setCurrentStep(step + 1);
                        speakSequentialStep(step + 1);
                    }
                };
                utterance.onerror = () => setIsPlaying(false);
                synthRef.current.speak(utterance);
            } else {
                setIsPlaying(false);
                speakText("All instructions have been played.");
            }
        };

        speakSequentialStep(currentStep);
    };

    const stopVoiceAssistant = () => {
        setIsActive(false);
        synthRef.current.cancel();
        recognitionRef.current?.stop();
        setIsSpeaking(false);
        setCurrentStep(0);
        setIsPlaying(false);
    };

    const readInstruction = () => {
        synthRef.current.cancel();
        if (currentStep < instructions.length) {
            const utterance = new SpeechSynthesisUtterance(instructions[currentStep]);
            utterance.rate = speechSpeed;
            utterance.onend = () => setIsSpeaking(false);
            synthRef.current.speak(utterance);
            setIsSpeaking(true);
        } else {
            speakText("You have reached the end of the instructions.");
        }
    };

    const speakText = (text) => {
        synthRef.current.cancel();
        const utterance = new SpeechSynthesisUtterance(text);
        utterance.rate = speechSpeed;
        synthRef.current.speak(utterance);
    };

    const goToNextStep = () => {
        synthRef.current.cancel();
        if (currentStep < instructions.length - 1) {
            setCurrentStep((prev) => prev + 1);
        } else {
            speakText("You are already at the last step.");
        }
    };

    const goToPreviousStep = () => {
        synthRef.current.cancel();
        setCurrentStep((prevStep) => {
            if (prevStep > 0) {
                return prevStep - 1;
            } else {
                speakText("You are already at the first step.");
                return prevStep;
            }
        });
    };

    const handleVoiceCommand = (event) => {
        const transcript = event.results[event.results.length - 1][0].transcript.trim().toLowerCase();
        console.log("Voice Command Received:", transcript);

        if (transcript.includes("next step")) {
            setIsPlaying(false);
            goToNextStep();
        } else if (transcript.includes("previous step")) {
            setIsPlaying(false);
            goToPreviousStep();
        } else if (transcript.includes("repeat step")) {
            setIsPlaying(false);
            readInstruction();
        } else if (transcript.includes("play instructions")) {
            playInstructions();
        } else if (transcript.includes("pause")) {
            synthRef.current.pause();
        } else if (transcript.includes("resume")) {
            synthRef.current.resume();
        } else if (transcript.includes("step")) {
            const match = transcript.match(/step (\w+)/);
            if (match && match[1]) {
                const stepNumber = parseNumberFromText(match[1]);
                if (!isNaN(stepNumber)) {
                    if (stepNumber >= 1 && stepNumber <= instructions.length) {
                        setCurrentStep(stepNumber - 1);
                        speakText(`Jumping to step ${stepNumber}`);
                    } else {
                        speakText("Step number out of range. Please try again.");
                    }
                } else {
                    speakText("Unable to recognize the step number. Please try again.");
                }
            } else {
                speakText("Unable to recognize the step number. Please try again.");
            }
        } else {
            speakText("Command not recognized. Please try again.");
        }
    };

    return (
        <div className="mt-5">
            <h3 className="text-gray-600 font-semibold text-lg">Voice Assistant</h3>
            {error && <p className="text-red-500 mt-2">{error}</p>}
            {!isActive ? (
                <button
                    onClick={startVoiceAssistant}
                    className="bg-blue-500 text-white p-2 rounded-md hover:bg-blue-600 transition-all">
                    Start Voice Assistance
                </button>
            ) : (
                <div>
                    <p className="mt-2 text-gray-600">Current Step: {currentStep + 1}</p>
                    <p className="text-gray-700 font-medium mb-3">{instructions[currentStep]}</p>
                    <div className="flex gap-2 flex-wrap">
                        <button
                            onClick={playInstructions}
                            disabled={isPlaying}
                            className="bg-green-500 text-white p-2 rounded-md hover:bg-green-600 disabled:opacity-50 transition-all">
                            Play Instructions
                        </button>
                        <button
                            onClick={goToNextStep}
                            className="bg-purple-500 text-white p-2 rounded-md hover:bg-purple-600 transition-all">
                            Next Step
                        </button>
                        <button
                            onClick={goToPreviousStep}
                            className="bg-indigo-500 text-white p-2 rounded-md hover:bg-indigo-600 transition-all">
                            Previous Step
                        </button>
                        <button
                            onClick={stopVoiceAssistant}
                            className="bg-red-500 text-white p-2 rounded-md hover:bg-red-600 transition-all">
                            Stop
                        </button>
                    </div>
                    <label className="mt-3 block">
                        <span className="text-gray-600 font-medium">Speed:</span>
                        <input
                            type="range"
                            min="0.5"
                            max="2"
                            step="0.1"
                            value={speechSpeed}
                            onChange={(e) => setSpeechSpeed(parseFloat(e.target.value))}
                            className="ml-2"
                        />
                    </label>
                </div>
            )}
        </div>
    );
}