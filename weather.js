
//----------------------------------------------------------------------------------------------------------//
//MATH FUNCTIONS
//----------------------------------------------------------------------------------------------------------//

function randomFloat (min, max){
    return Math.random() * (max - min +1) + min
}

function randomInt(min, max){
    return Math.floor(Math.random() * (max - min + 1) + min)
}

function mapTo (num, in_min, in_max, out_min, out_max){
    return (num - in_min) * (out_max - out_min) / (in_max - in_min) + out_min;
}







