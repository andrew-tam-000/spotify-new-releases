
// This will tell firebase a new host has been
// created
// and return the host key
function createConnection() {
    return {
        type: 'FIREBASE_CREATE_CONNECTION',
    }
}
