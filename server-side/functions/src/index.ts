const functions = require('firebase-functions');
const admin = require('firebase-admin');

var keys = [];
admin.initializeApp(functions.config().firebase);
let db = admin.firestore();

exports.sshKey = functions.https.onRequest((req, res) => {

    switch (req.method) {
        case 'GET':
            var id = req.query.id;

            if (!id) {
                const responseJson = { data: 'alive' };
                res.status(200).send(JSON.stringify(responseJson));
                return;
            }

            const keysRef = db.collection('keys').doc(id);
            keysRef.get()
                .then(doc => {
                    if (!doc.exists) {
                        console.log('No such document! ', id);
                        res.status(403).send('Forbidden!');
                        return;
                    } else {
                        const docSource = doc.data();
                        console.log('Requested Document data:', docSource);
                        const responseJson = { data: docSource.key };
                        res.status(200).send(JSON.stringify(responseJson));
                        return;
                    }
                })
                .catch(err => {
                    console.log('Error getting document', err);
                    res.status(403).send('Forbidden!');
                    return;
                });

            break;
        case 'POST':
            console.log('Got POST request body :', req.body);

            try {
                if (
                    !req.body.keyContent ||
                    req.body.keyContent.indexOf('ssh-rsa') < 0
                ) {
                    res.status(403).send('Forbidden!');
                    return;
                }
            } catch (err) {
                res.status(403).send('Forbidden!');
                return;
            }

            // Add a new document with a generated id.
            db.collection('keys').add({
                "key": req.body.keyContent,
                "date": new Date()
            }).then(ref => {
                console.log('Added document with ID: ', ref.id);
                var responseJson = {
                    "data": "ok",
                    "id": ref.id
                };
                res.status(200).send(JSON.stringify(responseJson));

            });

            break;

        default:
            res.status(403).send('Forbidden!');
            break;
    }

});

