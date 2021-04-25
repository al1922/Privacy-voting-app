import bigInt from "big-integer"

export async function EncryptData(value, publicKey) {

    const valueMod = bigInt(1000).pow(value)
    let g = bigInt(publicKey.g)
    let n = bigInt(publicKey.n)
    let n2 = n.pow(2)
    let r = bigInt.randBetween(1, n-1)

    let res = g.modPow(valueMod, n2).multiply(r.modPow(n, n2)).mod(n2)

    return Promise.resolve(res)
}


export function DecryptData(value, privateKey){
    let alpha = bigInt(privateKey.alpha)
    let mu = bigInt(privateKey.mu)
    let n = bigInt(privateKey.n)
    let n2 = n.pow(2)

    let res = value.modPow(alpha, n2).minus(1).divide(n).multiply(mu).mod(n)

    return  Promise.resolve(res)
}

export function EncryptSum(value1, value2, publicKey){
    let n = bigInt(publicKey.n)
    let n2 = n.pow(2)

    let res = bigInt(value1).multiply(value2).mod(n2)

    return Promise.resolve(res)
}



// async function EncryptData(number){

//     let g = bigInt()
//     let n = bigInt()

//     await database.ref(`rooms/${roomId}/public/publicKey`).get().then(function(keySnapShot){
//         g =  bigInt(keySnapShot.val().g)
//         n =  bigInt(keySnapShot.val().n)
//     })

//     let n2 = n.pow(2)
//     let r = bigInt.randBetween(1, n-1)

//     return g.modPow(number, n2).multiply(r.modPow(n, n2)).mod(n2)
// }

// async function DecryptData(number){

//     let alpha = bigInt()
//     let mu = bigInt()
//     let n = bigInt()

//     await database.ref(`rooms/${roomId}/private/privateKey`).get().then(function(keySnapShot){
//         alpha =  bigInt(keySnapShot.val().alpha)
//         mu =  bigInt(keySnapShot.val().mu)
//         n =  bigInt(keySnapShot.val().n)
//     })

//     let n2 = n.pow(2)


//     return  number.modPow(alpha, n2).minus(1).divide(n).multiply(mu).mod(n)
// }

// async function EncryptSum(fisrtEncryptedNumer, secondEncryptedNumer){


//     let n = bigInt()

//     await database.ref(`rooms/${roomId}/public/publicKey`).get().then(function(keySnapShot){
//         n =  bigInt(keySnapShot.val().n)
//     })

//     let n2 = n.pow(2)

//     return bigInt(fisrtEncryptedNumer).multiply(secondEncryptedNumer).mod(n2)
// }

// async function handleEncrypt(e){
//     e.preventDefault()
//     try{
//         const num = bigInt(valueRef.current.value)
//         const encryptedNumber1 = await EncryptData(num)
//         const encryptedNumber2 = await EncryptData(num)
//         const sumEncryp = await EncryptSum(encryptedNumber1, encryptedNumber2)
//         const decryptNumber = await DecryptData(sumEncryp)
//         console.log(decryptNumber)
//     }
//     catch(err){console.log(err.message)}
// }