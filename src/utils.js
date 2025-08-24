import { words } from "./words"

export function getRandomWord(difficulty) {
    let newWords = null
    if (difficulty === "hard") {
        newWords = words.filter( word => word.length >= 11 )
    } else if (difficulty === "medium") {
        newWords = words.filter( word => word.length < 11 && word.length > 5 )
    } else if (difficulty === "easy") {
        newWords = words.filter( word => word.length < 6 )
    }

    const randomIndex = Math.floor(Math.random() * newWords.length)
    return newWords[randomIndex]
}

export function getFarewellText(language) {
    const options = [
        `Farewell, ${language}`,
        `Adios, ${language}`,
        `R.I.P., ${language}`,
        `We'll miss you, ${language}`,
        `Oh no, not ${language}!`,
        `${language} bites the dust`,
        `Gone but not forgotten, ${language}`,
        `The end of ${language} as we know it`,
        `Off into the sunset, ${language}`,
        `${language}, it's been real`,
        `${language}, your watch has ended`,
        `${language} has left the building`
    ];

    const randomIndex = Math.floor(Math.random() * options.length);
    return options[randomIndex];
}