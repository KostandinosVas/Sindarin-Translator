'use client';
import React, { useState } from 'react';
import elvishDictionary from '../data.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faRepeat } from '@fortawesome/free-solid-svg-icons';
import '../app/globals.css';

const ElvishTranslator = () => {
    const [inputPhrase, setInputPhrase] = useState('');
    const [translation, setTranslation] = useState('');
    const [isEnglishToElvish, setIsEnglishToElvish] = useState(true);
    const [placeholder, setPlaceholder] = useState("Enter English text");

    const handleTranslate = () => {
        const words = inputPhrase.toLowerCase().split(' ');
        let translatedWords = [];
        let index = 0;
    
        // Sort dictionary keys by length in descending order
        const sortedKeys = Object.keys(elvishDictionary).sort((a, b) => b.split(' ').length - a.split(' ').length);
    
        while (index < words.length) {
            let matchFound = false;
    
            for (let key of sortedKeys) {
                const keyWords = key.split(' ');
                const slice = words.slice(index, index + keyWords.length).join(' ');
    
                if (slice === key) {
                    translatedWords.push(elvishDictionary[key]);
                    index += keyWords.length;
                    matchFound = true;
                    break;
                }
            }
    
            if (!matchFound) {
                translatedWords.push(words[index]);
                index++;
            }
        }
    
        setTranslation(translatedWords.join(' '));
    };
    

    const toggleTranslationDirection = () => {
        setIsEnglishToElvish(!isEnglishToElvish);
        setInputPhrase('');
        setTranslation('');
        setPlaceholder(isEnglishToElvish ? "Enter Sindarin text" : "Enter English text");
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputPhrase(value);
        if (!value) {
            setTranslation(''); // Clear translation when input is cleared
        }
    };

    const copyToClipboard = () => {
        if (translation) {
            navigator.clipboard.writeText(translation).then(() => {
                alert('Copied to clipboard!');
            }, () => {
                alert('Failed to copy!');
            });
        }
    };

    const handleKeyPress = (e) => {
        if (e.key === 'Enter') {
            e.preventDefault(); // Prevents adding a new line in the textarea
            handleTranslate();  // Trigger translation
        }
    };

    return (
        <div className='flex flex-col justify-center items-center gap-4 w-4/5'>
            <button onClick={toggleTranslationDirection}
            className='border rounded border-[#D4AF37] p-3 bg-[#1A1A1A]  text-2xl mr-4 text-[#F5F5DC] px-6  flex items-center justify-between gap-4 '>
                {isEnglishToElvish ? "English to Sindarin" : "Sindarin to English"}
                <FontAwesomeIcon
                            icon={faRepeat}
                            className='text-slate-300 text-xl cursor-pointer'
                        />
            </button>
            <textarea
                rows="5"
                cols="50"
                className='text-xl font-serif flex justify-start px-2 items-start rounded text-[#F5F5DC] w-full border  bg-[#1A1A1A] '
                type="text"
                value={inputPhrase}
                onChange= {handleInputChange}
                onFocus={() => setPlaceholder('')} // Clear placeholder on focus
                onBlur={() => !inputPhrase && setPlaceholder(isEnglishToElvish ? "Enter English text" : "Enter Sindarin text")} 
                onKeyDown={handleKeyPress}
                placeholder={placeholder}
            />
            <button onClick={handleTranslate} className='text-3xl rounded text-[#F5F5DC] border border-[#D4AF37] p-4 w-full bg-[#cd80329d] shadow-sm shadow-[#D4AF37] hover:bg-[#cd8032]'>
                Translate
            </button>
            <div className='flex justify-center items-center border border-white w-full min-h-40 rounded relative bg-[#1A1A1A] bg-opacity-50'>
                {translation && <p className='text-3xl text-[#F5F5DC]'>{translation}</p>}
                <FontAwesomeIcon
                            icon={faCopy}
                            className='text-slate-300 icon-fixed-size cursor-pointer absolute top-4 right-4'
                            onClick={copyToClipboard}
                        />
            </div>
        </div>
    );
};

export default ElvishTranslator;
