import CardPack from './packOfCards';

export default function shuffleArray() {
    let arr = [...CardPack];
    console.log(CardPack);
    for (let i = arr.length - 1; i > 0; i--) {
        let j = Math.floor(Math.random() * (i + 1))
        let temp = arr[i]
        arr[i] = arr[j]
        arr[j] = temp;
    }
    console.log(arr);
    return arr;
}