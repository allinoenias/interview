import { useState, useEffect, useRef, useCallback } from 'react';

// Declare types for Web Speech API
interface SpeechRecognitionEvent extends Event {
  results: SpeechRecognitionResultList;
  resultIndex: number;
}

interface SpeechRecognitionErrorEvent extends Event {
  error: string;
  message?: string;
}

interface IWindow extends Window {
  SpeechRecognition?: any;
  webkitSpeechRecognition?: any;
}

export function useSpeechToText() {
  const [isListening, setIsListening] = useState(false);
  const [transcript, setTranscript] = useState('');
  const [isSupported, setIsSupported] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);
  const recognitionRef = useRef<any>(null);

  useEffect(() => {
    const win = window as unknown as IWindow;
    const SpeechRecognitionClass = win.SpeechRecognition || win.webkitSpeechRecognition;

    if (SpeechRecognitionClass) {
      setIsSupported(true);
      try {
        const recognition = new SpeechRecognitionClass();
        recognition.continuous = true;
        recognition.interimResults = true;
        recognition.lang = 'en-IN'; // Default to Indian English / standard English

        recognition.onresult = (event: SpeechRecognitionEvent) => {
          let currentTranscript = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            const transcriptChunk = event.results[i][0].transcript;
            if (event.results[i].isFinal) {
              currentTranscript += transcriptChunk + ' ';
            } else {
              currentTranscript += transcriptChunk;
            }
          }
          if (currentTranscript) {
            setTranscript(currentTranscript.trim());
          }
        };

        recognition.onerror = (event: SpeechRecognitionErrorEvent) => {
          console.warn('Speech recognition event warning:', event.error);
          if (event.error === 'not-allowed') {
            setErrorMessage('Microphone access blocked. Please allow mic permissions in your browser.');
          }
          setIsListening(false);
        };

        recognition.onend = () => {
          setIsListening(false);
        };

        recognitionRef.current = recognition;
      } catch (err) {
        console.warn('Speech recognition init error:', err);
      }
    } else {
      setIsSupported(false);
    }

    return () => {
      if (recognitionRef.current) {
        try {
          recognitionRef.current.abort();
        } catch {
          // ignore
        }
      }
    };
  }, []);

  const startListening = useCallback((onResultText?: (text: string) => void) => {
    setErrorMessage(null);
    if (!recognitionRef.current) return;
    try {
      if (onResultText) {
        recognitionRef.current.onresult = (event: SpeechRecognitionEvent) => {
          let finalChunk = '';
          for (let i = event.resultIndex; i < event.results.length; i++) {
            if (event.results[i].isFinal) {
              finalChunk += event.results[i][0].transcript + ' ';
            }
          }
          if (finalChunk.trim()) {
            onResultText(finalChunk.trim());
          }
        };
      }
      recognitionRef.current.start();
      setIsListening(true);
    } catch (e) {
      console.warn('Could not start speech recognition:', e);
      setIsListening(false);
    }
  }, []);

  const stopListening = useCallback(() => {
    if (recognitionRef.current) {
      try {
        recognitionRef.current.stop();
      } catch {
        // ignore
      }
    }
    setIsListening(false);
  }, []);

  const toggleListening = useCallback((onResultText?: (text: string) => void) => {
    if (isListening) {
      stopListening();
    } else {
      startListening(onResultText);
    }
  }, [isListening, startListening, stopListening]);

  return {
    isListening,
    transcript,
    isSupported,
    errorMessage,
    startListening,
    stopListening,
    toggleListening,
    setTranscript
  };
}
