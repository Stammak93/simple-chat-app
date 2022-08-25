module.exports = (words) => {

    let numbers = "1234567890"
    let numberString = ""

    let adjective = words.adjectives[Math.floor(Math.random()*words.adjectives.length)]
    let noun = words.nouns[Math.floor(Math.random()*words.nouns.length)]

    for(let i=0; i < 5; i++) {
        let number = numbers[Math.floor(Math.random()*numbers.length)]
        numberString += number
    }

    return `${adjective}-${noun}-${numberString}`.toLowerCase()
}


