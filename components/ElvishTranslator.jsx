'use client';
import React, { useState } from 'react';
import elvishDictionary from '../data.js';
import { FontAwesomeIcon } from '@fortawesome/react-fontawesome';
import { faCopy, faRepeat } from '@fortawesome/free-solid-svg-icons';
import '../app/globals.css';

// Flatten the dictionary: split comma-separated synonym keys, take primary Sindarin value.
// For space-separated synonym groups (no commas), also register each word individually.
const buildFlatMap = (dict) => {
    const map = {};
    const addEntry = (subKey, value) => {
        if (!map[subKey]) map[subKey] = value;
    };
    for (const [key, rawValue] of Object.entries(dict)) {
        const primaryValue = rawValue.split(',')[0].trim();
        const subKeys = key.split(',').map(k => k.trim().toLowerCase()).filter(Boolean);
        for (const subKey of subKeys) {
            // Keep the full subkey (enables multi-word phrase matching)
            addEntry(subKey, primaryValue);
            // Also add each individual word so synonym groups are searchable
            if (subKey.includes(' ')) {
                for (const word of subKey.split(' ')) {
                    const clean = word.replace(/[^a-z0-9\-]/gi, '').toLowerCase();
                    if (clean) addEntry(clean, primaryValue);
                }
            }
        }
    }
    return map;
};

const flatDictionary = buildFlatMap(elvishDictionary);

const ElvishTranslator = () => {
    const [inputPhrase, setInputPhrase] = useState('');
    const [translation, setTranslation] = useState([]);
    const [isEnglishToElvish, setIsEnglishToElvish] = useState(true);
    const [placeholder, setPlaceholder] = useState("Enter English text");

    const handleTranslate = () => {
        const words = inputPhrase.toLowerCase().split(' ');
        let translatedWords = [];
        let index = 0;

        // Build the appropriate lookup dictionary
        const lookupDict = isEnglishToElvish
            ? flatDictionary
            : Object.fromEntries(Object.entries(flatDictionary).map(([k, v]) => [v.toLowerCase(), k]));

        // Sort dictionary keys by word count (longest phrase first)
        const sortedKeys = Object.keys(lookupDict).sort((a, b) => b.split(' ').length - a.split(' ').length);

        while (index < words.length) {
            let matchFound = false;

            for (let key of sortedKeys) {
                const keyWords = key.split(' ');
                const slice = words.slice(index, index + keyWords.length).join(' ').replace(/[.,!?]/g, '');

                if (slice === key) {
                    translatedWords.push({ text: lookupDict[key], found: true });
                    index += keyWords.length;
                    matchFound = true;
                    break;
                }
            }

            if (!matchFound) {
                const cleanedWord = words[index].replace(/[.,!?]/g, '');
                if (lookupDict[cleanedWord]) {
                    translatedWords.push({ text: lookupDict[cleanedWord], found: true });
                } else {
                    translatedWords.push({ text: words[index], found: false });
                }
                index++;
            }
        }

        setTranslation(translatedWords);
    };
    

    const toggleTranslationDirection = () => {
        setIsEnglishToElvish(!isEnglishToElvish);
        setInputPhrase('');
        setTranslation([]);
        setPlaceholder(isEnglishToElvish ? "Enter Sindarin text" : "Enter English text");
    };

    const handleInputChange = (e) => {
        const value = e.target.value;
        setInputPhrase(value);
        if (!value) {
            setTranslation([]);
        }
    };

    const copyToClipboard = () => {
        if (translation.length > 0) {
            navigator.clipboard.writeText(translation.map(t => t.text).join(' ')).then(() => {
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
                {translation.length > 0 && (
                    <p className='text-3xl text-[#F5F5DC] px-4 text-center'>
                        {translation.map((token, i) => (
                            <span key={i}>
                                {i > 0 ? ' ' : ''}
                                {token.found ? (
                                    <span>{token.text}</span>
                                ) : (
                                    <span
                                        className='text-red-500 cursor-help'
                                        title='This word has no Sindarin translation'
                                    >{token.text}</span>
                                )}
                            </span>
                        ))}
                    </p>
                )}
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
