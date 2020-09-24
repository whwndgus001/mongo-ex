const {MongoClient} = require('mongodb'); //'mongodb'패키지로부터 현재 스크립트에 'MongoClient'객체를 끄집어낸다. 

//몽고디비 url 확인하기:
//mongodb://{서버ip}:{port}/{데이터베이스이름}

//url 생성
const url = "mongodb://192.168.1.111/mydb";
//client생성
const client = new MongoClient(url, { useUnifiedTopology: true });

// 문서 한 개 가져오기
function testFindOne() {
    client.connect().then(client => {
        const db = client.db("mydb");

        db.collection("friends").findOne().then(result => {
            console.log(result);
         });
    })
}
// testFindOne();
// select * fromt table
function testFind() {
    client.connect().then(client => {
        const db = client.db("mydb");

        // find 는 promise 를 사용하지않음 -> callback
        /*
        db.collection("friends").find((err, cursor) => {
            if (err) {
                console.error(err);
            } else {
                cursor.forEach(item => {
                    console.log(item);
            });
        }
        });
        */
       // 데이터가 많지 않을때는 toArray => Promise 지원
       db.collection("friends").find()
            .skip(2)      // 2개 건너뛰기
            .limit(2)     // 2개 가져오기
            .sort({ name: -1})   // 1: 오름차순, -1: 내림차순
            .toArray()
            .then(result => {
            for (let i = 0; i < result.length; i++) {
               console.log(result[i]);

           }
       }).catch(err => {
           console.error(err);
       });
    });
}
// testFind();

// 조건절
// select * from table where column = ...;
function testFindByName(name) {
    client.connect().then(client => {
        const db = client.db("mydb");

        db.collection("friends").find({
             name : name
        }).toArray().then(result => {
            for (let i = 0; i < result.length; i++) {
                console.log(result[i]);
            }
        }).catch(err => {
            console.error(err);
        
        })
    })
};
// testFindByName("고길동");

// 비교 연산자 : $gt(>), $gte(>=), $lt(<), $lte (<=), $ne(!=)
// // 논리 연산자 : $and, $or, $not
function testFindByCondition(projection, condition) {
    client.connect().then(client => {
        const db = client.db("mydb");

        db.collection("friends").find(
        condition, // 조건
        projection
        ).toArray().then(result => {
        for (let i = 0; i <= result.length; i++) {
            console.log(result[i]);

             }
        })
    })
};
// projection 객체 : 1이면 표시, 0이면 표시하지 않음
/*
testFindByCondition({ name: 1, age: 1, species: 1},
    {
        
        // $and:[
        //     {age:  { $gte: 20 }},
        //     {age:  { $lte: 50 }}
        // ]   // 20세 이상 50세 이하
        
        $or: [
            { age: { $lt: 20}},
             {age: { $gt: 50}}
        ]
    });
*/

// SQL : update table set col=val, col=val ...
// db.collection.update({ 조건 객체 }, { 변경할 내용 })